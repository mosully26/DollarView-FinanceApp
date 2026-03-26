<script lang="ts">
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form: any } = $props();

	let preferences = data.preferences;

	let formState = $state({
		monthly_budget: preferences?.monthly_budget ?? '',
		primary_goal: preferences?.primary_goal ?? '',
		tracks_business: preferences?.tracks_business ? 'true' : 'false',
		business_type: preferences?.business_type ?? '',
		categories: preferences?.categories ?? [],
		alert_preference: preferences?.alert_preference ?? ''
	});

	function toggleCategory(category: string) {
		if (formState.categories.includes(category)) {
			formState.categories = formState.categories.filter((c) => c !== category);
		} else {
			formState.categories = [...formState.categories, category];
		}
	}

	const categories = [
		'Groceries',
		'Rent',
		'Utilities',
		'Transportation',
		'Subscriptions',
		'Entertainment',
		'Shopping',
		'Healthcare',
		'Marketing',
		'Payroll',
		'Supplies',
		'Software'
	];
</script>

<svelte:head>
	<title>Preferences | DollarView</title>
</svelte:head>

<section class="max-w-3xl mx-auto p-6 space-y-6">
	<h1 class="text-3xl font-bold">Preferences</h1>
	<p class="text-slate-600">Update how DollarView personalizes your experience.</p>

	<form method="POST" class="space-y-6">

		<!-- Monthly Budget -->
		<div>
			<label class="block text-sm font-medium mb-1">Monthly Budget</label>
			<input type="number" bind:value={formState.monthly_budget} />
		</div>

		<!-- Goal -->
		<div>
			<label class="block text-sm font-medium mb-1">Primary Goal</label>
			<input type="text" bind:value={formState.primary_goal} />
		</div>

		<!-- Business Toggle -->
		<div>
			<label class="block text-sm font-medium mb-1">Usage Type</label>
			<select bind:value={formState.tracks_business}>
				<option value="false">Personal</option>
				<option value="true">Business</option>
			</select>
		</div>

		<!-- Business Type -->
		{#if formState.tracks_business === 'true'}
			<div>
				<label class="block text-sm font-medium mb-1">Business Type</label>
				<input type="text" bind:value={formState.business_type} />
			</div>
		{/if}

		<!-- Categories -->
		<div>
			<label class="block text-sm font-medium mb-2">Categories</label>
			<div class="flex flex-wrap gap-2">
				{#each categories as cat}
					<button
						type="button"
						onclick={() => toggleCategory(cat)}
						class={`px-3 py-1 rounded-full text-sm ${
							formState.categories.includes(cat)
								? 'bg-blue-600 text-white'
								: 'bg-slate-200'
						}`}
					>
						{cat}
					</button>
				{/each}
			</div>
		</div>

		<!-- Alerts -->
		<div>
			<label class="block text-sm font-medium mb-1">Alert Preference</label>
			<select bind:value={formState.alert_preference}>
				<option value="light">Light</option>
				<option value="balanced">Balanced</option>
				<option value="frequent">Frequent</option>
			</select>
		</div>

		<!-- Hidden fields -->
		<input type="hidden" name="monthly_budget" value={formState.monthly_budget} />
		<input type="hidden" name="primary_goal" value={formState.primary_goal} />
		<input type="hidden" name="tracks_business" value={formState.tracks_business} />
		<input type="hidden" name="business_type" value={formState.business_type} />
		<input type="hidden" name="categories" value={JSON.stringify(formState.categories)} />
		<input type="hidden" name="alert_preference" value={formState.alert_preference} />

		<button class="btn-primary">Save Preferences</button>

		{#if form?.success}
			<p class="text-green-600 text-sm">Saved successfully</p>
		{/if}

		{#if form?.error}
			<p class="text-red-600 text-sm">{form.error}</p>
		{/if}
	</form>
</section>