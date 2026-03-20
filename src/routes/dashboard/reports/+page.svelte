<script lang="ts">
	import BarChart from '$lib/components/BarChart.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import PieChart from '$lib/components/PieChart.svelte';
	import TransactionsTable from '$lib/components/TransactionsTable.svelte';
	import { currency } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="space-y-6">
	<div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
		<div>
			<p class="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Reports</p>
			<h1 class="mt-2 text-3xl font-bold">Filtered financial reporting</h1>
			<p class="mt-1 text-slate-600">{data.periodText}</p>
		</div>

		<FilterBar basePath="/dashboard/reports" period={data.period} />
	</div>

	<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
		<MetricCard label="Revenue" value={currency(data.metrics.revenue)} tone="good" />
		<MetricCard label="Expenses" value={currency(data.metrics.expenses)} />
		<MetricCard label="Profit" value={currency(data.metrics.profit)} tone={data.metrics.profit >= 0 ? 'good' : 'bad'} />
		<MetricCard label="Transactions" value={String(data.metrics.count)} />
	</div>

	<div class="grid gap-6 xl:grid-cols-2">
		<BarChart data={data.bars} />
		<PieChart data={data.expensePie} title="Expense category breakdown" variant="doughnut" />
	</div>

	<TransactionsTable rows={data.rows} />
</div>