<script lang="ts">
	import type { Category } from '$lib/types';

	let {
		categories,
		message = ''
	}: {
		categories: Category[];
		message?: string;
	} = $props();

	let selectedType = $state<'EXPENSE' | 'REVENUE'>('EXPENSE');

	const filteredCategories = $derived(
		categories.filter((category) => category.type === selectedType)
	);
</script>

<form method="POST" class="card space-y-4 p-5">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-bold">Add transaction</h2>
		{#if message}
			<p class="text-sm text-rose-600">{message}</p>
		{/if}
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		<div>
			<label for="tx-title" class="mb-1 block text-sm font-medium">Title</label>
			<input id="tx-title" name="title" placeholder="Office supplies" required />
		</div>

		<div>
			<label for="tx-amount" class="mb-1 block text-sm font-medium">Amount</label>
			<input
				id="tx-amount"
				name="amount"
				type="number"
				step="0.01"
				min="0.01"
				placeholder="120.00"
				required
			/>
		</div>

		<div>
			<label for="tx-type" class="mb-1 block text-sm font-medium">Type</label>
			<select id="tx-type" name="type" bind:value={selectedType}>
				<option value="EXPENSE">Expense</option>
				<option value="REVENUE">Revenue</option>
			</select>
		</div>

		<div>
			<label for="tx-category" class="mb-1 block text-sm font-medium">Category</label>
			<select id="tx-category" name="category_id" required>
				<option value="">Select category</option>
				{#each filteredCategories as category}
					<option value={category.id}>{category.name}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="tx-vendor" class="mb-1 block text-sm font-medium">Vendor / Service</label>
			<input id="tx-vendor" name="vendor" placeholder="Adobe, UPS, Client invoice" />
		</div>

		<div>
			<label for="tx-date" class="mb-1 block text-sm font-medium">Date</label>
			<input id="tx-date" name="transaction_date" type="date" required />
		</div>
	</div>

	<div>
		<label for="tx-notes" class="mb-1 block text-sm font-medium">Notes</label>
		<textarea id="tx-notes" name="notes" rows="3" placeholder="Optional notes"></textarea>
	</div>

	<button class="btn-primary" type="submit">Save transaction</button>
</form>