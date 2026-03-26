<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData | null } = $props();

	const expenseCategories = $derived(
		data.categories.filter((item) => item.type?.toUpperCase() === 'EXPENSE')
	);

	const revenueCategories = $derived(
		data.categories.filter((item) => item.type?.toUpperCase() === 'REVENUE')
	);

	const categoryHighlights = [
		{
			title: 'Organize smarter',
			desc: 'Keep expenses and revenue grouped cleanly for easier reporting.'
		},
		{
			title: 'Improve insights',
			desc: 'Better categories lead to more useful dashboards and breakdowns.'
		},
		{
			title: 'Customize tracking',
			desc: 'Build a category system that matches your personal or business workflow.'
		}
	];
</script>

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
					Categories
				</p>

				<h1 class="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl dark:text-slate-100">
					Manage your financial categories with more structure.
				</h1>

				<p class="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
					Organize the way you track expenses and revenue so reports, charts, and
					transaction history stay clean and easy to understand.
				</p>

				<div class="mt-8 grid gap-4 md:grid-cols-3">
					{#each categoryHighlights as card}
						<div class="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
							<p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
								{card.title}
							</p>
							<p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
								{card.desc}
							</p>
						</div>
					{/each}
				</div>
			</div>

			<div class="w-full max-w-md">
				<div class="grid gap-4 sm:grid-cols-2">
					<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
							Expense categories
						</p>
						<p class="mt-2 text-3xl font-bold text-rose-600">
							{expenseCategories.length}
						</p>
					</div>

					<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
							Revenue categories
						</p>
						<p class="mt-2 text-3xl font-bold text-blue-600">
							{revenueCategories.length}
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
		<div class="mb-5">
			<p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
				Add category
			</p>
			<h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
				Create a new category
			</h2>
			<p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
				Add custom expense or revenue categories to better organize your financial records.
			</p>
		</div>

		<form method="POST" action="?/add" class="grid gap-4 md:grid-cols-[1fr_180px_auto]">
			<input
				name="name"
				type="text"
				placeholder="Advertising"
				required
			/>

			<select name="type" required>
				<option value="EXPENSE">Expense</option>
				<option value="REVENUE">Revenue</option>
			</select>

			<button class="btn-primary" type="submit">Add</button>
		</form>

		{#if form && typeof form === 'object' && 'error' in form}
			<p class="mt-4 text-sm text-rose-600 dark:text-rose-400">{form.error}</p>
		{/if}

		{#if form && typeof form === 'object' && 'success' in form}
			<p class="mt-4 text-sm text-emerald-600 dark:text-emerald-400">
				Category added successfully.
			</p>
		{/if}

		{#if form && typeof form === 'object' && 'deleted' in form}
			<p class="mt-4 text-sm text-emerald-600 dark:text-emerald-400">
				Category deleted successfully.
			</p>
		{/if}
	</section>

	<div class="grid gap-6 lg:grid-cols-2">
		<section class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
			<div class="mb-5 flex items-start justify-between gap-4">
				<div>
					<p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
						Expense side
					</p>
					<h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
						Expense categories
					</h2>
				</div>

				<div class="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
					{expenseCategories.length} total
				</div>
			</div>

			<div class="space-y-3">
				{#if expenseCategories.length === 0}
					<div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950">
						<p class="text-sm text-slate-500 dark:text-slate-400">
							No expense categories yet.
						</p>
					</div>
				{:else}
					{#each expenseCategories as category}
						<div
							class="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
						>
							<div>
								<p class="text-sm font-semibold text-slate-900 dark:text-slate-100">
									{category.name}
								</p>
								<p class="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
									Expense
								</p>
							</div>

							<form method="POST" action="?/delete">
								<input type="hidden" name="category_id" value={category.id} />
								<button
									class="rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30"
									type="submit"
								>
									Delete
								</button>
							</form>
						</div>
					{/each}
				{/if}
			</div>
		</section>

		<section class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
			<div class="mb-5 flex items-start justify-between gap-4">
				<div>
					<p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
						Revenue side
					</p>
					<h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
						Revenue categories
					</h2>
				</div>

				<div class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
					{revenueCategories.length} total
				</div>
			</div>

			<div class="space-y-3">
				{#if revenueCategories.length === 0}
					<div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950">
						<p class="text-sm text-slate-500 dark:text-slate-400">
							No revenue categories yet.
						</p>
					</div>
				{:else}
					{#each revenueCategories as category}
						<div
							class="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
						>
							<div>
								<p class="text-sm font-semibold text-slate-900 dark:text-slate-100">
									{category.name}
								</p>
								<p class="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
									Revenue
								</p>
							</div>

							<form method="POST" action="?/delete">
								<input type="hidden" name="category_id" value={category.id} />
								<button
									class="rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30"
									type="submit"
								>
									Delete
								</button>
							</form>
						</div>
					{/each}
				{/if}
			</div>
		</section>
	</div>
</div>