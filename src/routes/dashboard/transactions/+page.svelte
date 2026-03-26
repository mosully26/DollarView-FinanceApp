<script lang="ts">
	import FilterBar from '$lib/components/FilterBar.svelte';
	import TransactionForm from '$lib/components/TransactionForm.svelte';
	import TransactionsTable from '$lib/components/TransactionsTable.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const highlightCards = [
		{
			title: 'Capture activity',
			desc: 'Log purchases, revenue, and service income as they happen.'
		},
		{
			title: 'Stay organized',
			desc: 'Keep transactions grouped by type, category, and vendor.'
		},
		{
			title: 'Filter smarter',
			desc: 'Quickly narrow results by amount, date, and transaction type.'
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
					Transactions
				</p>

				<h1 class="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
					Track every purchase, payment, and income source.
				</h1>

				<p class="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
					Add financial activity, organize it clearly, and use filters to review spending
					and revenue with precision.
				</p>

				<div class="mt-8 grid gap-4 md:grid-cols-3">
					{#each highlightCards as card}
						<div class="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
							<p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
								{card.title}
							</p>
							<p class="mt-3 text-sm leading-6 text-slate-600">
								{card.desc}
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
							basePath="/dashboard/transactions"
							period={data.period}
							plan={data.isPremium ? 'premium' : 'free'}
						/>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
		<div class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
			<div class="mb-5">
				<p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
					Add transaction
				</p>
				<h2 class="mt-2 text-2xl font-bold text-slate-900">Record new activity</h2>
				<p class="mt-2 text-sm leading-6 text-slate-600">
					Add expenses and revenue so your dashboard, reports, and alerts stay current.
				</p>
			</div>

			<TransactionForm categories={data.categories} message={form?.error} />
		</div>

		<div class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
			<div class="mb-5">
				<p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
					Search and filter
				</p>
				<h2 class="mt-2 text-2xl font-bold text-slate-900">Refine your transaction history</h2>
				<p class="mt-2 text-sm leading-6 text-slate-600">
					Search transactions and narrow results by type, category, amount, and date range.
				</p>
			</div>

			<form method="GET" action="/dashboard/transactions" class="space-y-5">
				<input type="hidden" name="period" value={data.period} />

				<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					<div class="xl:col-span-2">
						<label for="search" class="mb-2 block text-sm font-medium text-slate-700">
							Search title or vendor
						</label>
						<input
							id="search"
							name="search"
							type="text"
							placeholder="Search transactions..."
							value={data.filters.search}
						/>
					</div>

					<div>
						<label for="type" class="mb-2 block text-sm font-medium text-slate-700">
							Type
						</label>
						<select id="type" name="type">
							<option value="" selected={data.filters.type === ''}>All types</option>
							<option value="EXPENSE" selected={data.filters.type === 'EXPENSE'}>
								Expense
							</option>
							<option value="REVENUE" selected={data.filters.type === 'REVENUE'}>
								Revenue
							</option>
						</select>
					</div>

					<div>
						<label for="category" class="mb-2 block text-sm font-medium text-slate-700">
							Category
						</label>
						<select id="category" name="category">
							<option value="" selected={data.filters.category === ''}>All categories</option>
							{#each data.categories as category}
								<option value={category.id} selected={data.filters.category === category.id}>
									{category.name}
								</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="min" class="mb-2 block text-sm font-medium text-slate-700">
							Minimum amount
						</label>
						<input
							id="min"
							name="min"
							type="number"
							step="0.01"
							min="0"
							placeholder="0.00"
							value={data.filters.min}
						/>
					</div>

					<div>
						<label for="max" class="mb-2 block text-sm font-medium text-slate-700">
							Maximum amount
						</label>
						<input
							id="max"
							name="max"
							type="number"
							step="0.01"
							min="0"
							placeholder="0.00"
							value={data.filters.max}
						/>
					</div>

					<div>
						<label for="start" class="mb-2 block text-sm font-medium text-slate-700">
							Start date
						</label>
						<input id="start" name="start" type="date" value={data.filters.start} />
					</div>

					<div>
						<label for="end" class="mb-2 block text-sm font-medium text-slate-700">
							End date
						</label>
						<input id="end" name="end" type="date" value={data.filters.end} />
					</div>
				</div>

				<div class="flex flex-wrap gap-3 pt-1">
					<button type="submit" class="btn-primary">Apply Filters</button>

					<a
						href={`/dashboard/transactions?period=${data.period}`}
						class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
					>
						Clear Filters
					</a>
				</div>
			</form>
		</div>
	</section>

	<section class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
		<div class="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
			<div>
				<p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
					Transaction history
				</p>
				<h2 class="mt-2 text-2xl font-bold text-slate-900">Review recorded activity</h2>
				<p class="mt-2 text-sm leading-6 text-slate-600">
					View all matching transactions and keep your records organized and searchable.
				</p>
			</div>

			<div class="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
				Showing filtered results
			</div>
		</div>

		<TransactionsTable rows={data.rows} showDelete={true} />
	</section>
</div>