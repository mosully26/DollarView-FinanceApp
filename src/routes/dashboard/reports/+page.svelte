<script lang="ts">
	import { resolve } from '$app/paths';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import MonthlyOverviewChart from '$lib/components/MonthlyOverviewChart.svelte';
	import PieChart from '$lib/components/PieChart.svelte';
	import TransactionsTable from '$lib/components/TransactionsTable.svelte';
	import { currency } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const reportHighlights = [
		{
			label: 'Reporting window',
			value: data.periodText
		},
		{
			label: 'Plan',
			value: data.isPremium ? 'Premium analytics enabled' : 'Free plan active'
		},
		{
			label: 'Focus',
			value: 'Revenue, expenses, profit, and transaction activity'
		}
	];
</script>

<svelte:head>
	<title>Reports | DollarView</title>
</svelte:head>

<div class="space-y-6">
	<section
		class="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/95 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)] md:p-6 xl:p-7"
	>
		<div class="pointer-events-none absolute inset-0">
			<div class="absolute -left-12 top-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl"></div>
			<div class="absolute right-0 top-8 h-44 w-44 rounded-full bg-sky-100/60 blur-3xl"></div>
			<div class="absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-slate-200/40 blur-3xl"></div>
		</div>

		<div class="relative grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
			<div>
				<div
					class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
				>
					<span class="inline-block h-2 w-2 rounded-full bg-blue-600"></span>
					Financial reporting
				</div>

				<p
					class="mt-4 text-xs font-semibold uppercase tracking-[0.35em] text-blue-600 dark:text-blue-400"
				>
					Reports
				</p>

				<h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
					Filtered financial reporting
				</h1>

				<p class="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
					Review your financial performance across different time periods with clearer
					visibility into revenue, expenses, profit, and transaction activity.
				</p>

				<div class="mt-5 grid gap-3 md:grid-cols-3">
					{#each reportHighlights as item}
						<div class="rounded-xl border border-slate-200 bg-white/85 p-3 shadow-sm">
							<p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-600">
								{item.label}
							</p>
							<p class="mt-2 text-sm font-medium leading-6 text-slate-700">
								{item.value}
							</p>
						</div>
					{/each}
				</div>
			</div>

			<div class="grid gap-3">
				<div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
					<p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
						Selected period
					</p>
					<p class="mt-2 text-lg font-bold text-slate-900">{data.periodText}</p>
					<p class="mt-1 text-sm text-slate-600">
						Adjust your reporting window to compare financial performance over time.
					</p>
				</div>

				<div class="flex flex-wrap items-center gap-3">
					<FilterBar
						basePath="/dashboard/reports"
						period={data.period}
						plan={data.isPremium ? 'premium' : 'free'}
					/>

					{#if data.isPremium}
						<div class="relative group">
							<button
								type="button"
								class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
							>
								Export Report
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>

							<div
								class="invisible absolute right-0 top-full z-20 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100"
							>
								<a
									href={resolve(`/dashboard/reports/export?period=${data.period}&format=csv`)}
									class="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
								>
									Export as CSV
								</a>

								<a
									href={resolve(`/dashboard/reports/export-pdf?period=${data.period}`)}
									class="mt-1 block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
								>
									Export as PDF
								</a>
							</div>
						</div>
					{:else}
						<a
							href={resolve('/pricing')}
							class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
						>
							Export Reports • Premium
						</a>
					{/if}
				</div>
			</div>
		</div>
	</section>

	<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
		<MetricCard label="Revenue" value={currency(data.metrics.revenue)} tone="good" />
		<MetricCard label="Expenses" value={currency(data.metrics.expenses)} tone="bad" />
		<MetricCard
			label="Profit"
			value={currency(data.metrics.profit)}
			tone={data.metrics.profit >= 0 ? 'good' : 'bad'}
		/>
		<MetricCard label="Transactions" value={String(data.metrics.count)} />
	</div>

	{#if data.isPremium}
		<section class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
			<div class="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
				<div class="mb-5 flex items-start justify-between gap-4">
					<div>
						<p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
							Performance trend
						</p>
						<h2 class="mt-2 text-2xl font-bold text-slate-900">Monthly revenue overview</h2>
						<p class="mt-2 text-sm leading-6 text-slate-600">
							Track how your financial performance changes over time and spot movement faster.
						</p>
					</div>

					<div
						class="hidden rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 md:inline-flex"
					>
						Interactive view
					</div>
				</div>

				<div
					class="rounded-[1.25rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4"
				>
					<MonthlyOverviewChart data={data.bars} isPremium={data.isPremium} />
				</div>
			</div>

			<div class="space-y-6">
				<div class="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
					<div class="mb-5">
						<p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
							Expense analysis
						</p>
						<h2 class="mt-2 text-2xl font-bold text-slate-900">Category breakdown</h2>
						<p class="mt-2 text-sm leading-6 text-slate-600">
							See where your money is going with a clearer category-level view.
						</p>
					</div>

					<div
						class="rounded-[1.25rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4"
					>
						<PieChart
							data={data.expensePie}
							title="Expense category breakdown"
							variant="doughnut"
						/>
					</div>
				</div>

				<div
					class="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-sm md:p-6"
				>
					<p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-300">
						Report insights
					</p>
					<h3 class="mt-2 text-xl font-bold">Use reports to spot trends faster</h3>
					<p class="mt-3 text-sm leading-7 text-slate-200">
						Review this page regularly to compare spending shifts, revenue direction, and
						transaction volume across reporting periods. It’s built to help you notice
						patterns before they become bigger problems.
					</p>

					<div class="mt-5 grid gap-3">
						<div class="rounded-xl border border-white/10 bg-white/5 p-3">
							<p class="text-sm font-semibold">Watch revenue momentum</p>
							<p class="mt-1 text-sm text-slate-300">
								Use the trend chart to see whether growth is steady or slowing down.
							</p>
						</div>

						<div class="rounded-xl border border-white/10 bg-white/5 p-3">
							<p class="text-sm font-semibold">Track expense concentration</p>
							<p class="mt-1 text-sm text-slate-300">
								The breakdown chart helps reveal categories taking the biggest share.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	{:else}
		<section class="grid gap-6 xl:grid-cols-2">
			<div class="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
				<div class="mb-5">
					<p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
						Premium reporting
					</p>
					<h2 class="mt-2 text-2xl font-bold text-slate-900">Monthly revenue overview</h2>
					<p class="mt-2 text-sm leading-6 text-slate-600">
						Upgrade to Premium to unlock advanced charts and extended reporting views.
					</p>
				</div>

				<div
					class="rounded-[1.5rem] border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white p-10 text-center"
				>
					<div
						class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-7 w-7"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M3 3v18h18" />
							<path d="M18 17V9" />
							<path d="M13 17V5" />
							<path d="M8 17v-3" />
						</svg>
					</div>

					<p class="mt-5 text-sm font-semibold text-slate-900">Premium feature</p>
					<p class="mt-2 text-slate-600">
						Advanced charting and deeper financial visualizations are available with Premium.
					</p>

					<a
						href={resolve('/pricing')}
						class="mt-5 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
					>
						Upgrade to Premium
					</a>
				</div>
			</div>

			<div class="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
				<div class="mb-5">
					<p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
						Premium analytics
					</p>
					<h2 class="mt-2 text-2xl font-bold text-slate-900">Expense category breakdown</h2>
					<p class="mt-2 text-sm leading-6 text-slate-600">
						Premium users can access richer visual breakdowns and expanded analytics.
					</p>
				</div>

				<div
					class="rounded-[1.5rem] border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white p-10 text-center"
				>
					<div
						class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-7 w-7"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M21 12A9 9 0 1 1 12 3" />
							<path d="M21 3v9h-9" />
						</svg>
					</div>

					<p class="mt-5 text-sm font-semibold text-slate-900">Locked for Free plan</p>
					<p class="mt-2 text-slate-600">
						Upgrade your account to unlock category breakdown charts and advanced insights.
					</p>

					<a
						href={resolve('/pricing')}
						class="mt-5 inline-flex items-center justify-center rounded-xl border border-blue-200 px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
					>
						View Premium Features
					</a>
				</div>
			</div>
		</section>
	{/if}

	<section class="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
		<div class="mb-5">
			<p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
				Transaction records
			</p>
			<h2 class="mt-2 text-2xl font-bold text-slate-900">Detailed transaction history</h2>
			<p class="mt-2 text-sm leading-6 text-slate-600">
				Review the individual records behind your reports for a more complete financial view.
			</p>
		</div>

		<TransactionsTable rows={data.rows} />
	</section>
</div>