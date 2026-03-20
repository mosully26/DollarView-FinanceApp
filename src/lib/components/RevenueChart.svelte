<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
				datasets: [
					{
						label: 'Revenue',
						data: [12000, 15000, 14000, 18000, 18420],
						borderColor: '#3b82f6',
						backgroundColor: 'rgba(59, 130, 246, 0.10)',
						fill: true,
						tension: 0.42,
						borderWidth: 3,
						pointRadius: 4,
						pointHoverRadius: 6,
						pointBackgroundColor: '#ffffff',
						pointBorderColor: '#3b82f6',
						pointBorderWidth: 2
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						backgroundColor: '#0f172a',
						titleColor: '#ffffff',
						bodyColor: '#ffffff',
						displayColors: false,
						padding: 12,
						callbacks: {
							label: (context) => `$${Number(context.raw).toLocaleString()}`
						}
					}
				},
				scales: {
					x: {
						grid: {
							display: false
						},
						border: {
							display: false
						},
						ticks: {
							color: '#64748b',
							font: {
								size: 12
							}
						}
					},
					y: {
						grid: {
                            color: 'rgba(148, 163, 184, 0.15)'
                        },
						border: {
							display: false
						},
						ticks: {
							color: '#64748b',
							font: {
								size: 12
							},
							callback: (value) => Number(value).toLocaleString()
						}
					}
				}
			}
		});

		return () => {
			chart.destroy();
		};
	});
</script>

<div class="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-md">
	<div class="mb-4 flex items-start justify-between">
		<div>
			<p class="text-sm font-medium text-slate-500">Revenue trend</p>
			<h3 class="mt-1 text-xl font-bold text-slate-900">$18,420</h3>
		</div>

		<div class="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
			+12.4%
		</div>
	</div>

	<div class="h-64">
		<canvas bind:this={canvas}></canvas>
	</div>
</div>