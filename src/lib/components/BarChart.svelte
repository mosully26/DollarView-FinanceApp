<script lang="ts">
	import { onMount } from 'svelte';
	import {
		BarController,
		BarElement,
		CategoryScale,
		Chart,
		Legend,
		LinearScale,
		Tooltip,
		type ChartConfiguration
	} from 'chart.js';
	import type { BarPoint } from '$lib/types';

	Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

	let { data }: { data: BarPoint[] } = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	function draw() {
		if (!canvas) return;

		chart?.destroy();

		const config: ChartConfiguration<'bar'> = {
			type: 'bar',
			data: {
				labels: data.map((item) => item.label),
				datasets: [
					{
						label: 'Revenue',
						data: data.map((item) => item.revenue),
						backgroundColor: 'rgba(16, 185, 129, 0.85)',
						borderRadius: 8
					},
					{
						label: 'Expenses',
						data: data.map((item) => item.expenses),
						backgroundColor: 'rgba(239, 68, 68, 0.85)',
						borderRadius: 8
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { position: 'top' }
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
	<h3 class="mb-4 text-lg font-bold">Monthly overview</h3>
	<div class="h-80">
		<canvas bind:this={canvas}></canvas>
	</div>
</div>