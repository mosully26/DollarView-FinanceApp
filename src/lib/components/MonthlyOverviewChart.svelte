<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ArcElement,
		BarController,
		BarElement,
		BubbleController,
		CategoryScale,
		Chart,
		DoughnutController,
		Legend,
		LineController,
		LineElement,
		LinearScale,
		PointElement,
		PolarAreaController,
		RadarController,
		RadialLinearScale,
		Tooltip,
		type ChartConfiguration
	} from 'chart.js';
	import type { BarPoint } from '$lib/types';

	Chart.register(
		BarController,
		BarElement,
		LineController,
		LineElement,
		DoughnutController,
		PolarAreaController,
		RadarController,
		BubbleController,
		CategoryScale,
		LinearScale,
		PointElement,
		RadialLinearScale,
		ArcElement,
		Tooltip,
		Legend
	);

	type ChartTypeOption =
        | 'bar'
        | 'line'
        | 'area'
        | 'doughnut'
        | 'pie'
        | 'radar'
        | 'polarArea'
        | 'bubble';

	let { data, isPremium = false }: { data: BarPoint[]; isPremium?: boolean } = $props();

	let activeChart = $state<ChartTypeOption>('bar');

	let canvas = $state<HTMLCanvasElement | undefined>(undefined);
	let chart = $state<Chart | null>(null);

	const freeCharts: { label: string; value: ChartTypeOption }[] = [
		{ label: 'Bar', value: 'bar' },
		{ label: 'Line', value: 'line' },
		{ label: 'Doughnut', value: 'doughnut' }
	];

	const premiumCharts: { label: string; value: ChartTypeOption }[] = [
        { label: 'Bar', value: 'bar' },
        { label: 'Line', value: 'line' },
        { label: 'Area', value: 'area' },
        { label: 'Doughnut', value: 'doughnut' },
        { label: 'Pie', value: 'pie' },
        { label: 'Radar', value: 'radar' },
        { label: 'Polar', value: 'polarArea' },
        { label: 'Bubble', value: 'bubble' }
    ];

	let chartOptions = $derived(isPremium ? premiumCharts : freeCharts);

	function destroyChart() {
		chart?.destroy();
		chart = null;
	}

	function draw() {
		if (!canvas) return;

		if (!data?.length) {
			destroyChart();
			return;
		}

		destroyChart();

		const labels = data.map((item) => item.label);
		const revenueValues = data.map((item) => item.revenue);
		const expenseValues = data.map((item) => item.expenses);

		const totalRevenue = revenueValues.reduce((sum, value) => sum + value, 0);
		const totalExpenses = expenseValues.reduce((sum, value) => sum + value, 0);

		const revenueColor = 'rgba(16, 185, 129, 0.85)';
		const revenueBorder = 'rgba(16, 185, 129, 1)';
		const expenseColor = 'rgba(239, 68, 68, 0.85)';
		const expenseBorder = 'rgba(239, 68, 68, 1)';

		let config: ChartConfiguration;

		if (activeChart === 'bar') {
			config = {
				type: 'bar',
				data: {
					labels,
					datasets: [
						{
							label: 'Revenue',
							data: revenueValues,
							backgroundColor: revenueColor,
							borderRadius: 8
						},
						{
							label: 'Expenses',
							data: expenseValues,
							backgroundColor: expenseColor,
							borderRadius: 8
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: { legend: { position: 'top' } },
					scales: { y: { beginAtZero: true } }
				}
			};
		} else if (activeChart === 'line') {
			config = {
				type: 'line',
				data: {
					labels,
					datasets: [
						{
							label: 'Revenue',
							data: revenueValues,
							borderColor: revenueBorder,
							backgroundColor: 'rgba(16, 185, 129, 0.18)',
							pointBackgroundColor: revenueBorder,
							tension: 0.35,
							fill: false
						},
						{
							label: 'Expenses',
							data: expenseValues,
							borderColor: expenseBorder,
							backgroundColor: 'rgba(239, 68, 68, 0.18)',
							pointBackgroundColor: expenseBorder,
							tension: 0.35,
							fill: false
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: { legend: { position: 'top' } },
					scales: { y: { beginAtZero: true } }
				}
			};
            } else if (activeChart === 'area') {
        config = {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Revenue',
                        data: revenueValues,
                        borderColor: revenueBorder,
                        backgroundColor: 'rgba(16, 185, 129, 0.22)',
                        pointBackgroundColor: revenueBorder,
                        tension: 0.35,
                        fill: true
                    },
                    {
                        label: 'Expenses',
                        data: expenseValues,
                        borderColor: expenseBorder,
                        backgroundColor: 'rgba(239, 68, 68, 0.22)',
                        pointBackgroundColor: expenseBorder,
                        tension: 0.35,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: true } }
            }
        };
		} else if (activeChart === 'doughnut') {
			config = {
				type: 'doughnut',
				data: {
					labels: ['Revenue', 'Expenses'],
					datasets: [
						{
							data: [totalRevenue, totalExpenses],
							backgroundColor: [revenueColor, expenseColor],
							borderColor: [revenueBorder, expenseBorder],
							borderWidth: 2
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: { legend: { position: 'top' } }
				}
			};
		} else if (activeChart === 'pie') {
			config = {
				type: 'pie',
				data: {
					labels: ['Revenue', 'Expenses'],
					datasets: [
						{
							data: [totalRevenue, totalExpenses],
							backgroundColor: [revenueColor, expenseColor],
							borderColor: [revenueBorder, expenseBorder],
							borderWidth: 2
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: { legend: { position: 'top' } }
				}
			};
		} else if (activeChart === 'radar') {
			config = {
				type: 'radar',
				data: {
					labels,
					datasets: [
						{
							label: 'Revenue',
							data: revenueValues,
							backgroundColor: 'rgba(16, 185, 129, 0.18)',
							borderColor: revenueBorder,
							pointBackgroundColor: revenueBorder
						},
						{
							label: 'Expenses',
							data: expenseValues,
							backgroundColor: 'rgba(239, 68, 68, 0.18)',
							borderColor: expenseBorder,
							pointBackgroundColor: expenseBorder
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: { legend: { position: 'top' } },
					scales: {
						r: {
							beginAtZero: true
						}
					}
				}
			};
		} else if (activeChart === 'polarArea') {
			config = {
				type: 'polarArea',
				data: {
					labels: ['Revenue', 'Expenses'],
					datasets: [
						{
							data: [totalRevenue, totalExpenses],
							backgroundColor: [revenueColor, expenseColor],
							borderColor: [revenueBorder, expenseBorder],
							borderWidth: 2
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: { legend: { position: 'top' } }
				}
			};
		} else {
			config = {
				type: 'bubble',
				data: {
					datasets: [
						{
							label: 'Revenue',
							data: revenueValues.map((value, index) => ({
								x: index + 1,
								y: value,
								r: Math.max(8, Math.min(22, value / 150))
							})),
							backgroundColor: revenueColor,
							borderColor: revenueBorder
						},
						{
							label: 'Expenses',
							data: expenseValues.map((value, index) => ({
								x: index + 1,
								y: value,
								r: Math.max(8, Math.min(22, value / 150))
							})),
							backgroundColor: expenseColor,
							borderColor: expenseBorder
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: { legend: { position: 'top' } },
					scales: {
						x: {
							beginAtZero: true,
							ticks: {
								callback: (value) => labels[Number(value) - 1] ?? ''
							}
						},
						y: {
							beginAtZero: true
						}
					}
				}
			};
		}

		chart = new Chart(canvas, config);
	}

	onMount(() => {
		draw();
		return () => destroyChart();
	});

	$effect(() => {
		if (!isPremium && ['pie', 'radar', 'polarArea', 'bubble'].includes(activeChart)) {
			activeChart = 'bar';
		}
	});

	$effect(() => {
		activeChart;
		data;
		canvas;
		isPremium;

		queueMicrotask(() => {
			draw();
		});
	});
</script>

<div class="card p-5">
	<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<h3 class="text-lg font-bold">Monthly overview</h3>

		<div class="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-700">
			{#each chartOptions as option}
				<button
					type="button"
					class="toggle-btn"
					class:active={activeChart === option.value}
					onclick={() => (activeChart = option.value)}
				>
					{option.label}
				</button>
			{/each}
		</div>
	</div>

	<div class="h-80">
		{#if data?.length}
			{#key activeChart}
				<canvas bind:this={canvas}></canvas>
			{/key}
		{:else}
			<div class="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
				No data for this period
			</div>
		{/if}
	</div>
</div>

<style>
.toggle-btn {
	border: none;
	background: transparent;
	padding: 0.5rem 0.9rem;
	border-radius: 0.75rem;
	font-size: 0.875rem;
	font-weight: 600;
	color: rgb(71 85 105); /* light mode */
	cursor: pointer;
	transition: all 0.2s ease;
}

/* LIGHT MODE HOVER */
.toggle-btn:hover {
	background: rgba(255, 255, 255, 0.7);
	color: rgb(15 23 42);
}

/* ACTIVE (LIGHT) */
.toggle-btn.active {
	background: white;
	color: rgb(15 23 42);
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

/* 🌙 DARK MODE BASE TEXT (FIXED) */
:global(html.dark) .toggle-btn {
	color: rgb(226 232 240); /* MUCH brighter text */
}

/* 🌙 DARK MODE HOVER */
:global(html.dark) .toggle-btn:hover {
	background: rgba(51, 65, 85, 0.6);
	color: white;
}

/* 🌙 DARK MODE ACTIVE */
:global(html.dark) .toggle-btn.active {
	background: rgb(30 41 59);
	color: white;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
</style>