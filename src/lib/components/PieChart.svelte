<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import type { ChartConfiguration } from 'chart.js';
	import type { PiePoint } from '$lib/types';

	let {
		data,
		title,
		variant = 'pie'
	}: {
		data: PiePoint[];
		title: string;
		variant?: 'pie' | 'doughnut';
	} = $props();

	let canvas = $state<HTMLCanvasElement | undefined>(undefined);
	let chart: Chart<'pie' | 'doughnut'> | null = null;

	const revenueColors = [
		'#10b981',
		'#34d399',
		'#6ee7b7',
		'#a7f3d0',
		'#059669',
		'#047857'
	];

	const expenseColors = [
		'#ef4444',
		'#f87171',
		'#fca5a5',
		'#fecaca',
		'#dc2626',
		'#b91c1c'
	];

	const defaultColors = [
		'#0ea5e9',
		'#8b5cf6',
		'#f59e0b',
		'#6366f1'
	];

	const colors = $derived(
		title.toLowerCase().includes('revenue')
			? revenueColors
			: title.toLowerCase().includes('expense')
				? expenseColors
				: defaultColors
	);

	function destroyChart() {
		chart?.destroy();
		chart = null;
	}

	function drawChart() {
		if (!canvas) return;

		destroyChart();

		const safeData = data ?? [];

		if (safeData.length === 0) return;

		const config: ChartConfiguration<'pie' | 'doughnut', number[], string> = {
			type: variant,
			data: {
				labels: safeData.map((item) => item.label),
				datasets: [
					{
						label: title,
						data: safeData.map((item) => item.value),
						backgroundColor: safeData.map(
							(_, index) => colors[index % colors.length]
						),
						borderWidth: 2
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'bottom'
					}
				}
			}
		};

		chart = new Chart(canvas, config);
	}

	onMount(() => {
		drawChart();

		return () => {
			destroyChart();
		};
	});

	$effect(() => {
		const currentData = data;
		const currentTitle = title;
		const currentVariant = variant;
		const currentColors = colors;
		const currentCanvas = canvas;

		if (
			currentCanvas &&
			currentData &&
			currentTitle &&
			currentVariant &&
			currentColors
		) {
			queueMicrotask(drawChart);
		}
	});
</script>

<div class="card p-5">
	<h3 class="mb-4 text-lg font-bold text-slate-900 dark:text-white">
		{title}
	</h3>

	<div class="h-80">
		{#if data?.length}
			<canvas bind:this={canvas}></canvas>
		{:else}
			<div
				class="flex h-full items-center justify-center rounded-2xl border
				border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500
				dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
			>
				No data for this period
			</div>
		{/if}
	</div>
</div>