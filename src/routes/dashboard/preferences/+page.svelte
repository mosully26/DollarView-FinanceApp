<script lang="ts">
	import type { PageData } from './$types';

	type PreferenceForm = {
		monthly_budget: string | number;
		primary_goal: string;
		tracks_business: 'true' | 'false';
		business_type: string;
		categories: string[];
		alert_preference: string;
	};

	let { data, form }: { data: PageData; form: any } = $props();

	const preferences = data.preferences;

	let formState = $state<PreferenceForm>({
		monthly_budget: preferences?.monthly_budget ?? '',
		primary_goal: preferences?.primary_goal ?? '',
		tracks_business: preferences?.tracks_business ? 'true' : 'false',
		business_type: preferences?.business_type ?? '',
		categories: (preferences?.categories ?? []) as string[],
		alert_preference: preferences?.alert_preference ?? 'balanced'
	});

	function toggleCategory(category: string) {
		if (formState.categories.includes(category)) {
			formState.categories = formState.categories.filter(
				(existingCategory) => existingCategory !== category
			);
		} else {
			formState.categories = [...formState.categories, category];
		}
	}

	const categories: string[] = [
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

<section class="mx-auto max-w-3xl space-y-6 p-6">
	<header>
		<h1 class="text-3xl font-bold">Preferences</h1>
		<p class="mt-2 text-slate-600 dark:text-slate-400">
			Update how DollarView personalizes your experience.
		</p>
	</header>

	<form method="POST" class="space-y-6">

		<!-- Monthly Budget -->
		<div>
			<label
				for="monthly-budget"
				class="mb-1 block text-sm font-medium"
			>
				Monthly Budget
			</label>

			<input
				id="monthly-budget"
				type="number"
				bind:value={formState.monthly_budget}
				class="w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
			/>
		</div>

		<!-- Goal -->
		<div>
			<label
				for="primary-goal"
				class="mb-1 block text-sm font-medium"
			>
				Primary Goal
			</label>

			<input
				id="primary-goal"
				type="text"
				bind:value={formState.primary_goal}
				class="w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
			/>
		</div>

		<!-- Usage -->
		<div>
			<label
				for="usage-type"
				class="mb-1 block text-sm font-medium"
			>
				Usage Type
			</label>

			<select
				id="usage-type"
				bind:value={formState.tracks_business}
				class="w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
			>
				<option value="false">Personal</option>
				<option value="true">Business</option>
			</select>
		</div>

		<!-- Business Type -->
		{#if formState.tracks_business === 'true'}
			<div>
				<label
					for="business-type"
					class="mb-1 block text-sm font-medium"
				>
					Business Type
				</label>

				<input
					id="business-type"
					type="text"
					bind:value={formState.business_type}
					class="w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
				/>
			</div>
		{/if}

		<!-- Categories -->
		<div>
			<p class="mb-2 text-sm font-medium">
				Categories
			</p>

			<div class="flex flex-wrap gap-2">
				{#each categories as category}
					<button
						type="button"
						onclick={() => toggleCategory(category)}
						class={`rounded-full px-3 py-1 text-sm transition ${
							formState.categories.includes(category)
								? 'bg-blue-600 text-white'
								: 'bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
						}`}
					>
						{category}
					</button>
				{/each}
			</div>
		</div>

		<!-- Alert Preference -->
		<div>
			<label
				for="alert-preference"
				class="mb-1 block text-sm font-medium"
			>
				Alert Preference
			</label>

			<select
				id="alert-preference"
				bind:value={formState.alert_preference}
				class="w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
			>
				<option value="light">Light</option>
				<option value="balanced">Balanced</option>
				<option value="frequent">Frequent</option>
			</select>
		</div>

		<!-- Hidden Fields -->
		<input
			type="hidden"
			name="monthly_budget"
			value={String(formState.monthly_budget)}
		/>

		<input
			type="hidden"
			name="primary_goal"
			value={formState.primary_goal}
		/>

		<input
			type="hidden"
			name="tracks_business"
			value={formState.tracks_business}
		/>

		<input
			type="hidden"
			name="business_type"
			value={formState.business_type}
		/>

		<input
			type="hidden"
			name="categories"
			value={JSON.stringify(formState.categories)}
		/>

		<input
			type="hidden"
			name="alert_preference"
			value={formState.alert_preference}
		/>

		<button
			type="submit"
			class="btn-primary"
		>
			Save Preferences
		</button>

		{#if form?.success}
			<p class="text-sm text-green-600">
				Saved successfully.
			</p>
		{/if}

		{#if form?.error}
			<p class="text-sm text-red-600">
				{form.error}
			</p>
		{/if}
	</form>
</section>