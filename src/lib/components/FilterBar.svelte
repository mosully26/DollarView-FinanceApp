<script lang="ts">
	import { resolve } from '$app/paths';

	type Plan = 'free' | 'premium';

	type FilterItem = {
		label: string;
		value: string;
		premium: boolean;
	};

	let {
		basePath,
		period,
		plan = 'free'
	}: {
		basePath: string;
		period: string;
		plan?: Plan;
	} = $props();

	const periods: FilterItem[] = [
		{ label: '1 Month', value: '1', premium: false },
		{ label: '3 Months', value: '3', premium: false },
		{ label: '6 Months', value: '6', premium: false },
		{ label: '9 Months', value: '9', premium: true },
		{ label: '12 Months', value: '12', premium: true },
		{ label: '24 Months', value: '24', premium: true },
		{ label: '36 Months', value: '36', premium: true },
		{ label: '48 Months', value: '48', premium: true },
		{ label: '60 Months', value: '60', premium: true },
		{ label: '72 Months', value: '72', premium: true },
		{ label: 'All Time', value: 'all', premium: true }
	];

	const visiblePeriods = $derived(
		periods.filter((item) => plan === 'premium' || !item.premium)
	);

	function submitPeriodForm(event: Event) {
		const select = event.currentTarget as HTMLSelectElement;
		select.form?.requestSubmit();
	}
</script>

<div class="w-full">
	<form method="GET" action={basePath} class="space-y-3">
		<div class="flex flex-col gap-2 sm:flex-row sm:items-center">
			<label
				for="period-filter"
				class="shrink-0 text-sm font-semibold text-slate-700 dark:text-slate-300"
			>
				Period
			</label>

			<select
				id="period-filter"
				name="period"
				value={period}
				onchange={submitPeriodForm}
				class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5
				text-sm font-medium text-slate-700 shadow-sm outline-none transition
				hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100
				dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200
				dark:hover:border-slate-600 dark:focus:border-blue-400 dark:focus:ring-blue-950"
			>
				{#each visiblePeriods as item (item.value)}
					<option value={item.value}>
						{item.label}
					</option>
				{/each}
			</select>
		</div>

		{#if plan === 'free'}
			<div
				class="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3
				dark:border-slate-700 dark:bg-slate-800
				sm:flex-row sm:items-center sm:justify-between"
			>
				<p class="text-sm leading-5 text-slate-600 dark:text-slate-300">
					Unlock longer reporting ranges with Premium.
				</p>

				<a
					href={resolve('/pricing')}
					class="shrink-0 text-sm font-semibold text-blue-600 transition
					hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
				>
					View Premium
				</a>
			</div>
		{/if}
	</form>
</div>