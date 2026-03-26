<script lang="ts">
	import { currency, prettyDate } from '$lib/utils';
	import type { TransactionRow } from '$lib/types';

	type SortKey = 'title' | 'type' | 'category' | 'amount' | 'vendor' | 'date';
	type SortDirection = 'asc' | 'desc';

	let {
		rows,
		showDelete = false
	}: {
		rows: TransactionRow[];
		showDelete?: boolean;
	} = $props();

	let sortKey = $state<SortKey>('date');
	let sortDirection = $state<SortDirection>('desc');

	function confirmDelete(event: MouseEvent) {
		if (!confirm('Are you sure you want to delete this transaction?')) {
			event.preventDefault();
		}
	}

	function handleSort(key: SortKey) {
		if (sortKey === key) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDirection = key === 'date' || key === 'amount' ? 'desc' : 'asc';
		}
	}

	function compareValues(a: string | number, b: string | number) {
		if (typeof a === 'number' && typeof b === 'number') {
			return a - b;
		}

		return String(a).localeCompare(String(b), undefined, {
			sensitivity: 'base'
		});
	}

	let sortedRows = $derived(
		[...rows].sort((a, b) => {
			let aValue: string | number = '';
			let bValue: string | number = '';

			if (sortKey === 'title') {
				aValue = a.title ?? '';
				bValue = b.title ?? '';
			} else if (sortKey === 'type') {
				aValue = a.type ?? '';
				bValue = b.type ?? '';
			} else if (sortKey === 'category') {
				aValue = a.category?.name ?? '';
				bValue = b.category?.name ?? '';
			} else if (sortKey === 'amount') {
				aValue = Number(a.amount ?? 0);
				bValue = Number(b.amount ?? 0);
			} else if (sortKey === 'vendor') {
				aValue = a.vendor ?? '';
				bValue = b.vendor ?? '';
			} else if (sortKey === 'date') {
				aValue = new Date(a.transaction_date).getTime();
				bValue = new Date(b.transaction_date).getTime();
			}

			const result = compareValues(aValue, bValue);
			return sortDirection === 'asc' ? result : -result;
		})
	);

	function sortIcon(key: SortKey) {
		if (sortKey !== key) return '↕';
		return sortDirection === 'asc' ? '↑' : '↓';
	}
</script>

<div class="card overflow-hidden">
	<div class="overflow-x-auto">
		<table class="min-w-full text-sm">
			<thead class="bg-slate-50">
				<tr>
					<th class="px-4 py-3 text-left font-semibold text-slate-600">
						<button type="button" class="sort-btn" onclick={() => handleSort('title')}>
							Title <span>{sortIcon('title')}</span>
						</button>
					</th>

					<th class="px-4 py-3 text-left font-semibold text-slate-600">
						<button type="button" class="sort-btn" onclick={() => handleSort('type')}>
							Type <span>{sortIcon('type')}</span>
						</button>
					</th>

					<th class="px-4 py-3 text-left font-semibold text-slate-600">
						<button type="button" class="sort-btn" onclick={() => handleSort('category')}>
							Category <span>{sortIcon('category')}</span>
						</button>
					</th>

					<th class="px-4 py-3 text-left font-semibold text-slate-600">
						<button type="button" class="sort-btn" onclick={() => handleSort('amount')}>
							Amount <span>{sortIcon('amount')}</span>
						</button>
					</th>

					<th class="px-4 py-3 text-left font-semibold text-slate-600">
						<button type="button" class="sort-btn" onclick={() => handleSort('vendor')}>
							Vendor <span>{sortIcon('vendor')}</span>
						</button>
					</th>

					<th class="px-4 py-3 text-left font-semibold text-slate-600">
						<button type="button" class="sort-btn" onclick={() => handleSort('date')}>
							Date <span>{sortIcon('date')}</span>
						</button>
					</th>

					{#if showDelete}
						<th class="px-4 py-3 text-left font-semibold text-slate-600">Action</th>
					{/if}
				</tr>
			</thead>

			<tbody>
				{#if sortedRows.length === 0}
					<tr>
						<td colspan={showDelete ? 7 : 6} class="px-4 py-8 text-center text-slate-500">
							No transactions yet.
						</td>
					</tr>
				{:else}
					{#each sortedRows as row}
						<tr class="border-t border-slate-100">
							<td class="px-4 py-3 font-medium text-white dark:text-white">
								{row.title}
							</td>

							<td class="px-4 py-3">
								<span class={row.type === 'EXPENSE' ? 'badge-expense' : 'badge-revenue'}>
									{row.type}
								</span>
							</td>

							<td class="px-4 py-3 text-slate-200 dark:text-slate-200">
								{row.category?.name ?? '-'}
							</td>

							<td
								class={`px-4 py-3 font-semibold ${
									row.type === 'EXPENSE' ? 'text-rose-500' : 'text-emerald-500'
								}`}
							>
								{currency(Number(row.amount))}
							</td>

							<td class="px-4 py-3 text-slate-200 dark:text-slate-200">
								{row.vendor ?? '-'}
							</td>

							<td class="px-4 py-3 text-slate-200 dark:text-slate-200">
								{prettyDate(row.transaction_date)}
							</td>
							
							{#if showDelete}
								<td class="px-4 py-3">
									<form method="POST" action="?/delete">
										<input type="hidden" name="transaction_id" value={row.id} />
										<button
											type="submit"
											class="text-sm font-semibold text-rose-600 hover:text-rose-700"
											onclick={confirmDelete}
										>
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

<style>
	.sort-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		border: none;
		background: transparent;
		padding: 0;
		font: inherit;
		font-weight: 600;
		color: inherit;
		cursor: pointer;
	}

	.sort-btn:hover {
		color: rgb(37 99 235);
	}
</style>