<script lang="ts">
	import { currency, prettyDate } from '$lib/utils';
	import type { TransactionRow } from '$lib/types';

	let {
		rows,
		showDelete = false
	}: {
		rows: TransactionRow[];
		showDelete?: boolean;
	} = $props();
</script>

<div class="card overflow-hidden">
	<div class="overflow-x-auto">
		<table class="min-w-full text-sm">
			<thead class="bg-slate-50">
				<tr>
					<th class="px-4 py-3 text-left font-semibold text-slate-600">Title</th>
					<th class="px-4 py-3 text-left font-semibold text-slate-600">Type</th>
					<th class="px-4 py-3 text-left font-semibold text-slate-600">Category</th>
					<th class="px-4 py-3 text-left font-semibold text-slate-600">Amount</th>
					<th class="px-4 py-3 text-left font-semibold text-slate-600">Vendor</th>
					<th class="px-4 py-3 text-left font-semibold text-slate-600">Date</th>
					{#if showDelete}
						<th class="px-4 py-3 text-left font-semibold text-slate-600">Action</th>
					{/if}
				</tr>
			</thead>

			<tbody>
				{#if rows.length === 0}
					<tr>
						<td colspan={showDelete ? 7 : 6} class="px-4 py-8 text-center text-slate-500">
							No transactions yet.
						</td>
					</tr>
				{:else}
					{#each rows as row}
						<tr class="border-t border-slate-100">
							<td class="px-4 py-3 font-medium text-slate-900">{row.title}</td>
							<td class="px-4 py-3">
								<span class={row.type === 'EXPENSE' ? 'badge-expense' : 'badge-revenue'}>
									{row.type}
								</span>
							</td>
							<td class="px-4 py-3 text-slate-700">{row.category?.name ?? '-'}</td>
							<td class="px-4 py-3 font-semibold text-slate-900">
								{currency(Number(row.amount))}
							</td>
							<td class="px-4 py-3 text-slate-700">{row.vendor ?? '-'}</td>
							<td class="px-4 py-3 text-slate-700">{prettyDate(row.transaction_date)}</td>
							{#if showDelete}
								<td class="px-4 py-3">
									<form method="POST" action="?/delete">
										<input type="hidden" name="transaction_id" value={row.id} />
										<button class="text-sm font-semibold text-rose-600 hover:text-rose-700" type="submit">
											Delete
										</button>
									</form>
								</td>
							{/if}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>