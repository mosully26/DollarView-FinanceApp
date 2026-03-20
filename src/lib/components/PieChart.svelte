<script lang="ts">
	import { onMount } from 'svelte';
	import { ArcElement, Chart, DoughnutController, Legend, PieController, Tooltip, type ChartConfiguration } from 'chart.js';
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

	const colors = [
		'#0ea5e9',
		'#10b981',
		'#8b5cf6',
		'#f59e0b',
		'#ef4444',
		'#14b8a6',
		'#3b82f6',
		'#6366f1'
	];

	function draw() {
		if (!canvas) return;

		chart?.destroy();

		const config: ChartConfiguration<'pie' | 'doughnut'> = {
			type: variant,
			data: {
				labels: data.map((item) => item.label),
				datasets: [
					{
						label: title,
						data: data.map((item) => item.value),
						backgroundColor: data.map((_, index) => colors[index % colors.length])
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
		draw();
	});
</script>

<div class="card p-5">
	<h3 class="mb-4 text-lg font-bold">{title}</h3>
	<div class="h-80">
		<canvas bind:this={canvas}></canvas>
	</div>
</div>