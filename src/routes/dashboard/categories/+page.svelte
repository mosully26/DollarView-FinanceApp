<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const expenseCategories = $derived(
        data.categories.filter((item) => item.type === 'EXPENSE')
    );

    const revenueCategories = $derived(
        data.categories.filter((item) => item.type === 'REVENUE')
    );
</script>

<div class="space-y-6">
	<div>
		<p class="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Categories</p>
		<h1 class="mt-2 text-3xl font-bold">Manage your financial categories</h1>
	</div>

	<div class="card p-5">
		<h2 class="text-lg font-bold">Add category</h2>

		<form method="POST" action="?/add" class="mt-4 grid gap-4 md:grid-cols-[1fr_180px_auto]">
			<input name="name" placeholder="Advertising" required />
			<select name="type">
				<option value="EXPENSE">Expense</option>
				<option value="REVENUE">Revenue</option>
			</select>
			<button class="btn-primary" type="submit">Add</button>
		</form>

		{#if form?.error}
			<p class="mt-3 text-sm text-rose-600">{form.error}</p>
		{/if}
	</div>

	<div class="grid gap-6 lg:grid-cols-2">
		<div class="card p-5">
			<h2 class="text-lg font-bold">Expense categories</h2>
			<div class="mt-4 space-y-2">
				{#each expenseCategories as category}
					<div class="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
						<span class="text-sm font-medium">{category.name}</span>
						<form method="POST" action="?/delete">
							<input type="hidden" name="category_id" value={category.id} />
							<button class="text-sm font-semibold text-rose-600" type="submit">Delete</button>
						</form>
					</div>
				{/each}
			</div>
		</div>

		<div class="card p-5">
			<h2 class="text-lg font-bold">Revenue categories</h2>
			<div class="mt-4 space-y-2">
				{#each revenueCategories as category}
					<div class="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
						<span class="text-sm font-medium">{category.name}</span>
						<form method="POST" action="?/delete">
							<input type="hidden" name="category_id" value={category.id} />
							<button class="text-sm font-semibold text-rose-600" type="submit">Delete</button>
						</form>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>