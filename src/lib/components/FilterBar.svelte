<script lang="ts">
	import { resolve } from '$app/paths';

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
		plan?: 'free' | 'premium';
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
		{ label: 'All', value: 'all', premium: true }
	];

	const visiblePeriods = periods.filter((item) => plan === 'premium' || !item.premium);

	function submitPeriodForm(event: Event) {
		const form = (event.currentTarget as HTMLSelectElement).form;
		form?.requestSubmit();
	}
</script>

<div class="space-y-3">
	{#if plan === 'free'}
		<div class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
			<p class="text-sm text-blue-700">
				Upgrade to Premium to unlock extended history filters.
			</p>
			<a
				href={resolve('/pricing')}
				class="mt-2 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
			>
				View Premium
			</a>
		</div>
	{/if}

	<form method="GET" action={resolve(basePath)}>
		<div class="flex items-center gap-3">
			<label for="period-filter" class="text-sm font-medium text-slate-700">
				Period
			</label>

			<select
				id="period-filter"
				name="period"
				class="min-w-45 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition focus:border-blue-500 focus:outline-none"
				value={period}
				onchange={submitPeriodForm}
			>
				{#each visiblePeriods as item (item.value)}
					<option value={item.value}>
						{item.label}
					</option>
				{/each}
			</select>
		</div>
	</form>
</div>