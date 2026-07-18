<script lang="ts">
	import FilterBar from '$lib/components/FilterBar.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import PieChart from '$lib/components/PieChart.svelte';
	import MonthlyOverviewChart from '$lib/components/MonthlyOverviewChart.svelte';
	import { currency } from '$lib/utils';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const quickStats = [
		{
			title: 'Smarter visibility',
			desc: 'See revenue, expenses, profit, and transaction volume at a glance.'
		},
		{
			title: 'Flexible reporting',
			desc: 'Compare trends over time and break down where your money is going.'
		},
		{
			title: 'Actionable insights',
			desc: 'Use alerts, filters, and categories to stay in control of finances.'
		}
	];
</script>

{#if !data.business}
	<div class="mx-auto max-w-3xl">
		<section
			class="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
		>
			<div class="pointer-events-none absolute inset-0">
				<div class="absolute -left-24 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
				<div class="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-slate-300/30 blur-3xl"></div>
			</div>

			<div class="relative">
				<p class="text-xs font-semibold uppercase tracking-[0.35em] text-blue-600">
					Workspace setup
				</p>

				<h1 class="mt-4 text-4xl font-extrabold tracking-tight text-slate-900">
					Create your first workspace
				</h1>

				<p class="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
					Use your business name or a personal label like “Personal Finance” to get started.
				</p>

				<form method="POST" action="?/createBusiness" class="mt-8 space-y-5">
					<div>
						<label for="workspace-name" class="mb-2 block text-sm font-medium text-slate-700">
							Workspace name
						</label>
						<input
							id="workspace-name"
							name="name"
							placeholder="Dollar View Studio"
							required
						/>
					</div>

					{#if form?.createError}
						<p class="text-sm text-rose-600">{form.createError}</p>
					{/if}

					<button class="btn-primary" type="submit">Create workspace</button>
				</form>
			</div>
		</section>
	</div>
{:else}
	<div class="space-y-8">
		<section
			class="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-8 xl:p-10"
		>
			<div class="pointer-events-none absolute inset-0">
				<div class="absolute -left-24 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
				<div class="absolute right-0 top-10 h-72 w-72 rounded-full bg-sky-100/50 blur-3xl"></div>
			</div>

			<div class="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
				<div class="max-w-3xl">
					<p class="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-blue-600 dark:text-blue-400">
						Overview
					</p>

					<h1 class="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
						{data.business.name}
					</h1>

					<p class="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
						Monitor performance, track financial movement, and understand trends across your
						workspace with a cleaner dashboard experience.
					</p>

					<div class="mt-8 grid gap-4 md:grid-cols-3">
						{#each quickStats as stat}
							<div class="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
								<p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
									{stat.title}
								</p>
								<p class="mt-3 text-sm leading-6 text-slate-600">
									{stat.desc}
								</p>
							</div>
						{/each}
					</div>
				</div>

				<div class="w-full max-w-xl">
					<div class="rounded-[1.5rem] border border-slate-200 bg-white/85 p-4 shadow-sm backdrop-blur">
						<div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
							<div>
								<p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
									Current range
								</p>
								<p class="mt-2 text-lg font-bold text-slate-900">{data.periodText}</p>
							</div>

							<FilterBar
								basePath="/dashboard"
								period={data.period}
								plan={data.isPremium ? 'premium' : 'free'}
							/>
						</div>
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

		<div class="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
			<div class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
				<div class="mb-5 flex items-start justify-between gap-4">
					<div>
						<p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
							Performance chart
						</p>
						<h2 class="mt-2 text-2xl font-bold text-slate-900">Monthly overview</h2>
					</div>

					<div class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
						Live financial view
					</div>
				</div>

				<MonthlyOverviewChart data={data.bars} isPremium={data.isPremium} />
			</div>

			{#if data.isPremium}
				<div class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
					<PieChart data={data.expensePie} title="Expense breakdown" variant="pie" />
				</div>
			{:else}
				<div class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
					<h2 class="text-2xl font-bold text-slate-900">Expense breakdown</h2>
					<p class="mt-2 text-sm leading-6 text-slate-600">
						Upgrade to Premium to unlock additional charts, visual breakdowns, and deeper
						financial insights.
					</p>

					<div class="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
						<p class="text-sm font-semibold text-slate-900">Premium feature</p>
						<p class="mt-2 text-slate-600">
							Free users can view core metrics and essential reporting. Premium unlocks
							additional visual analysis.
						</p>
						<a
							href="/pricing"
							class="mt-5 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
						>
							Upgrade to Premium
						</a>
					</div>
				</div>
			{/if}
		</div>

		<div class="grid gap-6 xl:grid-cols-2">
			{#if data.isPremium}
				<div class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
					<PieChart data={data.revenueDoughnut} title="Revenue breakdown" variant="doughnut" />
				</div>
			{:else}
				<div class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
					<h2 class="text-2xl font-bold text-slate-900">Revenue breakdown</h2>
					<p class="mt-2 text-sm leading-6 text-slate-600">
						Advanced revenue visuals are available on the Premium plan only.
					</p>

					<div class="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
						<p class="text-sm font-semibold text-slate-900">Locked for Free plan</p>
						<p class="mt-2 text-slate-600">
							Upgrade to unlock deeper charting, stronger trend visibility, and more advanced
							reporting tools.
						</p>
						<a
							href="/pricing"
							class="mt-5 inline-flex items-center justify-center rounded-xl border border-blue-200 px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
						>
							View Premium Features
						</a>
					</div>
				</div>
			{/if}

			<div class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
				<div class="flex items-start gap-3">
					<div
						class="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M9 21h6a1 1 0 0 0 1-1v-1.07a8.001 8.001 0 1 0-8 0V20a1 1 0 0 0 1 1Zm3-19a6 6 0 0 1 3.857 10.596A3 3 0 0 0 14.8 15H9.2a3 3 0 0 0-1.057-2.404A6 6 0 0 1 12 2Zm-2 15h4v2h-4v-2Z"
							/>
						</svg>
					</div>

					<div>
						<h2 class="text-2xl font-bold text-slate-900">Quick summary</h2>
						<p class="mt-1 text-sm text-slate-500">Helpful ways to use your dashboard</p>
					</div>
				</div>

				<div class="mt-6 space-y-3">
					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
						<p class="text-sm font-semibold text-slate-800">Track activity</p>
						<p class="mt-1 text-sm leading-6 text-slate-600">
							Add purchases, services, and income from the Transactions page to keep your
							dashboard current.
						</p>
					</div>

					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
						<p class="text-sm font-semibold text-slate-800">Review trends</p>
						<p class="mt-1 text-sm leading-6 text-slate-600">
							Use Reports to compare revenue, expenses, and profit across different time
							periods.
						</p>
					</div>

					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
						<p class="text-sm font-semibold text-slate-800">Filter your history</p>
						<p class="mt-1 text-sm leading-6 text-slate-600">
							{#if data.isPremium}
								View performance over 1, 3, 6, 9, 12, 24, 36, 48, 60, 72 months, or all
								time.
							{:else}
								Free users can filter history over 1, 3, and 6 months. Upgrade to Premium
								for extended ranges up to 72 months and all time.
							{/if}
						</p>
					</div>

					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
						<p class="text-sm font-semibold text-slate-800">Stay informed</p>
						<p class="mt-1 text-sm leading-6 text-slate-600">
							Use Alerts and Notifications to keep up with due dates, spending thresholds,
							and important financial activity.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}