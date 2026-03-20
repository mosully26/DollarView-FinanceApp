<script lang="ts">
	import FilterBar from '$lib/components/FilterBar.svelte';
	import TransactionForm from '$lib/components/TransactionForm.svelte';
	import TransactionsTable from '$lib/components/TransactionsTable.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="space-y-6">
	<div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
		<div>
			<p class="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Transactions</p>
			<h1 class="mt-2 text-3xl font-bold">Track every purchase and payment</h1>
			<p class="mt-1 text-slate-600">{data.periodText}</p>
		</div>

		<FilterBar basePath="/dashboard/transactions" period={data.period} />
	</div>

	<TransactionForm categories={data.categories} message={form?.error} />
	<TransactionsTable rows={data.rows} showDelete={true} />
</div>