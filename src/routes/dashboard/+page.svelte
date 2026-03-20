<script lang="ts">
	import BarChart from '$lib/components/BarChart.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import PieChart from '$lib/components/PieChart.svelte';
	import { currency } from '$lib/utils';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

{#if !data.business}
	<div class="card mx-auto max-w-2xl p-8">
		<h1 class="text-3xl font-bold">Create your first workspace</h1>
		<p class="mt-2 text-slate-600">
			Use your business name or a personal label like “Personal Finance”.
		</p>

		<form method="POST" action="?/createBusiness" class="mt-6 space-y-4">
			<div>
				<label for="workspace-name" class="mb-1 block text-sm font-medium">Workspace name</label>
				<input id="workspace-name" name="name" placeholder="Dollar View Studio" required />
			</div>

			{#if form?.createError}
				<p class="text-sm text-rose-600">{form.createError}</p>
			{/if}

			<button class="btn-primary" type="submit">Create workspace</button>
		</form>
	</div>
{:else}
	<div class="space-y-6">
		<div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
			<div>
				<p class="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Overview</p>
				<h1 class="mt-2 text-3xl font-bold">{data.business.name}</h1>
				<p class="mt-1 text-slate-600">{data.periodText}</p>
			</div>

			<FilterBar basePath="/dashboard" period={data.period} />
		</div>

		<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
			<MetricCard label="Revenue" value={currency(data.metrics.revenue)} tone="good" />
			<MetricCard label="Expenses" value={currency(data.metrics.expenses)} />
			<MetricCard
				label="Profit"
				value={currency(data.metrics.profit)}
				tone={data.metrics.profit >= 0 ? 'good' : 'bad'}
			/>
			<MetricCard label="Transactions" value={String(data.metrics.count)} />
		</div>

		<div class="grid gap-6 xl:grid-cols-2">
			<BarChart data={data.bars} />
			<PieChart data={data.expensePie} title="Expense breakdown" variant="pie" />
		</div>

		<div class="grid gap-6 xl:grid-cols-2">
			<PieChart data={data.revenueDoughnut} title="Revenue breakdown" variant="doughnut" />
			<div class="card p-6">
				<h2 class="text-xl font-bold">Quick summary</h2>
				<p class="mt-3 text-slate-600">
					Use the Transactions page to add purchases, services, and income. Use Reports for filtered
					history over 1, 3, 6, 9, 12, 24, 36, 48, 60, 72 months, or all time.
				</p>
			</div>
		</div>
	</div>
{/if}