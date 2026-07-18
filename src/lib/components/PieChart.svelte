<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ArcElement,
		Chart,
		DoughnutController,
		Legend,
		PieController,
		Tooltip,
		type ChartConfiguration
	} from 'chart.js';
	import type { PiePoint } from '$lib/types';

	Chart.register(PieController, DoughnutController, ArcElement, Tooltip, Legend);

	let {
		data,
		title,
		variant = 'pie'
	}: {
		data: PiePoint[];
		title: string;
		variant?: 'pie' | 'doughnut';
	} = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	const revenueColors = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#059669', '#047857'];

	const expenseColors = ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#dc2626', '#b91c1c'];

	const defaultColors = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#6366f1'];

	let colors = $derived(
		title.toLowerCase().includes('revenue')
			? revenueColors
			: title.toLowerCase().includes('expense')
				? expenseColors
				: defaultColors
	);

	function draw() {
		if (!canvas) return;

		chart?.destroy();

		const safeData = data ?? [];

		const config: ChartConfiguration<'pie' | 'doughnut'> = {
			type: variant,
			data: {
				labels: safeData.map((item) => item.label),
				datasets: [
					{
						label: title,
						data: safeData.map((item) => item.value),
						backgroundColor: safeData.map((_, index) => colors[index % colors.length]),
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
		draw();
		return () => chart?.destroy();
	});

	$effect(() => {
		data;
		title;
		variant;
		colors;
		draw();
	});
</script>

<div class="card p-5">
	<h3 class="mb-4 text-lg font-bold">{title}</h3>
	<div class="h-80">
		<canvas bind:this={canvas}></canvas>
	</div>
</div>