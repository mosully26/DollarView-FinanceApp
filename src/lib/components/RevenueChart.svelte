<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	let canvas: HTMLCanvasElement;

	const revenueData = [12000, 15000, 14000, 18000, 18210];
	const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

	function calculateTrend(newValue: number, oldValue: number) {
		if (newValue === 0) return 0;
		return ((newValue - oldValue) / newValue) * 100;
	}

	const current = revenueData[revenueData.length - 1];
	const previous = revenueData[revenueData.length - 2];
	const trend = calculateTrend(current, previous);

	onMount(() => {
		const chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label: 'Revenue',
						data: revenueData,
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
			<h3 class="mt-1 text-xl font-bold text-slate-900">${current.toLocaleString()}</h3>
		</div>

		<div
			class={`rounded-full px-3 py-1 text-xs font-medium ${
				trend >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
			}`}
		>
			{trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
		</div>
	</div>

	<div class="h-64">
		<canvas bind:this={canvas}></canvas>
	</div>
</div>