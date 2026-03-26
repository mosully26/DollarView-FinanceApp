<script lang="ts">
	import { goto } from '$app/navigation';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData | null } = $props();

	let step = $state(data.preferences?.onboarding_step ?? 1);

	let formState = $state({
		monthly_budget: data.preferences?.monthly_budget?.toString() ?? '',
		primary_goal: data.preferences?.primary_goal ?? '',
		tracks_business:
			typeof data.preferences?.tracks_business === 'boolean'
				? String(data.preferences.tracks_business)
				: '',
		business_type: data.preferences?.business_type ?? '',
		categories: (data.preferences?.categories ?? []) as string[],
		alert_preference: data.preferences?.alert_preference ?? ''
	});

	const totalSteps = 5;

	const goalOptions = [
		{
			value: 'saving',
			title: 'Save more money',
			desc: 'Focus on building savings and cutting unnecessary spending.'
		},
		{
			value: 'reduce_expenses',
			title: 'Reduce expenses',
			desc: 'Track costs closely and stay under budget.'
		},
		{
			value: 'tracking',
			title: 'Track everything clearly',
			desc: 'Get a cleaner view of all spending and income.'
		},
		{
			value: 'growth',
			title: 'Grow business revenue',
			desc: 'Monitor performance and make smarter financial decisions.'
		}
	];

	const personalCategories = [
		'Groceries',
		'Rent',
		'Utilities',
		'Transportation',
		'Subscriptions',
		'Entertainment',
		'Shopping',
		'Healthcare'
	];

	const businessCategories = [
		'Payroll',
		'Marketing',
		'Supplies',
		'Software',
		'Rent',
		'Utilities',
		'Travel',
		'Inventory'
	];

	const alertOptions = [
		{
			value: 'light',
			title: 'Light',
			desc: 'Only major reminders and important updates.'
		},
		{
			value: 'balanced',
			title: 'Balanced',
			desc: 'A healthy mix of reminders and financial insights.'
		},
		{
			value: 'frequent',
			title: 'Frequent',
			desc: 'More active tracking with regular financial updates.'
		}
	];

	function nextStep() {
		if (step < totalSteps) step += 1;
	}

	function prevStep() {
		if (step > 1) step -= 1;
	}

	function toggleCategory(category: string) {
		if (formState.categories.includes(category)) {
			formState.categories = formState.categories.filter((c) => c !== category);
		} else {
			formState.categories = [...formState.categories, category];
		}
	}

	function selectUsage(value: 'true' | 'false') {
		formState.tracks_business = value;
		formState.categories = [];
		if (value === 'false') {
			formState.business_type = '';
		}
	}

	function currentCategories() {
		return formState.tracks_business === 'true' ? businessCategories : personalCategories;
	}

	function formatGoal(goal: string) {
		switch (goal) {
			case 'saving':
				return 'Save more money';
			case 'reduce_expenses':
				return 'Reduce expenses';
			case 'tracking':
				return 'Track everything clearly';
			case 'growth':
				return 'Grow business revenue';
			default:
				return goal;
		}
	}

	function formatAlert(alert: string) {
		switch (alert) {
			case 'light':
				return 'Light';
			case 'balanced':
				return 'Balanced';
			case 'frequent':
				return 'Frequent';
			default:
				return alert;
		}
	}
</script>

<svelte:head>
	<title>Onboarding | DollarView</title>
</svelte:head>

<section class="flex min-h-screen items-center justify-center px-6 py-12">
	<div class="w-full max-w-4xl">
		<div class="card overflow-hidden p-0">
			<div class="bg-gradient-to-r from-blue-50 via-white to-slate-50 px-8 py-8">
				<p class="text-[11px] font-bold uppercase tracking-[0.4em]">
					<span class="text-blue-600">DOLLAR</span><span class="text-slate-900">VIEW</span>
				</p>

				<div class="mt-4 flex flex-wrap items-end justify-between gap-4">
					<div class="max-w-2xl">
						<p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
							Step {step} of {totalSteps}
						</p>

						<h1 class="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
							Let’s personalize your finance tracker.
						</h1>

						<p class="mt-3 max-w-2xl text-base leading-7 text-slate-600">
							Answer a few quick questions so DollarView can personalize your dashboard,
							categories, and alerts.
						</p>
					</div>

					<div
						class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm"
					>
						{Math.round((step / totalSteps) * 100)}% complete
					</div>
				</div>

				<div class="mt-6 grid grid-cols-5 gap-2">
					{#each Array(totalSteps) as _, i}
						<div
							class={`h-2 rounded-full transition ${
								i + 1 <= step ? 'bg-blue-600' : 'bg-slate-200'
							}`}
						></div>
					{/each}
				</div>
			</div>

			<div class="px-8 py-8">
				{#if step === 1}
					<div class="space-y-6">
						<div class="max-w-2xl">
							<p class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
								Question 1
							</p>
							<h2 class="mt-2 text-3xl font-bold text-slate-900">
								What monthly budget are you working with?
							</h2>
							<p class="mt-3 text-slate-600">
								This helps DollarView understand your spending pace and recommend better
								alert thresholds.
							</p>
						</div>

						<div class="grid gap-4 sm:grid-cols-3">
							<button
								type="button"
								onclick={() => (form.monthly_budget = '1000')}
								class={`rounded-2xl border px-4 py-4 text-left transition ${
									form.monthly_budget === '1000'
										? 'border-blue-600 bg-blue-50'
										: 'border-slate-200 hover:bg-slate-50'
								}`}
							>
								<p class="font-semibold text-slate-900">$1,000</p>
								<p class="mt-1 text-sm text-slate-500">Starter budget</p>
							</button>

							<button
								type="button"
								onclick={() => (form.monthly_budget = '2500')}
								class={`rounded-2xl border px-4 py-4 text-left transition ${
									form.monthly_budget === '2500'
										? 'border-blue-600 bg-blue-50'
										: 'border-slate-200 hover:bg-slate-50'
								}`}
							>
								<p class="font-semibold text-slate-900">$2,500</p>
								<p class="mt-1 text-sm text-slate-500">Balanced budget</p>
							</button>

							<button
								type="button"
								onclick={() => (form.monthly_budget = '5000')}
								class={`rounded-2xl border px-4 py-4 text-left transition ${
									form.monthly_budget === '5000'
										? 'border-blue-600 bg-blue-50'
										: 'border-slate-200 hover:bg-slate-50'
								}`}
							>
								<p class="font-semibold text-slate-900">$5,000+</p>
								<p class="mt-1 text-sm text-slate-500">Higher-volume tracking</p>
							</button>
						</div>

						<div>
							<label
								for="monthly-budget"
								class="mb-2 block text-sm font-medium text-slate-700"
							>
								Or enter your own monthly budget
							</label>
							<input
								id="monthly-budget"
								bind:value={form.monthly_budget}
								type="number"
								placeholder="Enter monthly budget"
							/>
						</div>

						<div class="flex justify-end">
							<button type="button" onclick={nextStep} class="btn-primary">
								Continue
							</button>
						</div>
					</div>
				{/if}

				{#if step === 2}
					<div class="space-y-6">
						<div class="max-w-2xl">
							<p class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
								Question 2
							</p>
							<h2 class="mt-2 text-3xl font-bold text-slate-900">
								What is your primary financial goal?
							</h2>
							<p class="mt-3 text-slate-600">
								We’ll shape your dashboard and alerts around what matters most to you.
							</p>
						</div>

						<div class="grid gap-4 sm:grid-cols-2">
							{#each goalOptions as option}
								<button
									type="button"
									onclick={() => (form.primary_goal = option.value)}
									class={`rounded-2xl border p-5 text-left transition ${
										form.primary_goal === option.value
											? 'border-blue-600 bg-blue-50'
											: 'border-slate-200 hover:bg-slate-50'
									}`}
								>
									<p class="text-lg font-semibold text-slate-900">{option.title}</p>
									<p class="mt-2 text-sm leading-6 text-slate-600">{option.desc}</p>
								</button>
							{/each}
						</div>

						<div class="flex justify-between">
							<button
								type="button"
								onclick={prevStep}
								class="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
							>
								Back
							</button>

							<button type="button" onclick={nextStep} class="btn-primary">
								Continue
							</button>
						</div>
					</div>
				{/if}

				{#if step === 3}
					<div class="space-y-6">
						<div class="max-w-2xl">
							<p class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
								Question 3
							</p>
							<h2 class="mt-2 text-3xl font-bold text-slate-900">
								Will you be tracking personal or business finances?
							</h2>
							<p class="mt-3 text-slate-600">
								DollarView can adapt categories, reports, and alerts based on how you use it.
							</p>
						</div>

						<div class="grid gap-4 sm:grid-cols-2">
							<button
								type="button"
								onclick={() => selectUsage('false')}
								class={`rounded-2xl border p-5 text-left transition ${
									form.tracks_business === 'false'
										? 'border-blue-600 bg-blue-50'
										: 'border-slate-200 hover:bg-slate-50'
								}`}
							>
								<p class="text-lg font-semibold text-slate-900">Personal finances</p>
								<p class="mt-2 text-sm leading-6 text-slate-600">
									Track expenses, budgets, and day-to-day personal spending.
								</p>
							</button>

							<button
								type="button"
								onclick={() => selectUsage('true')}
								class={`rounded-2xl border p-5 text-left transition ${
									form.tracks_business === 'true'
										? 'border-blue-600 bg-blue-50'
										: 'border-slate-200 hover:bg-slate-50'
								}`}
							>
								<p class="text-lg font-semibold text-slate-900">Business finances</p>
								<p class="mt-2 text-sm leading-6 text-slate-600">
									Track revenue, expenses, categories, and business alerts.
								</p>
							</button>
						</div>

						{#if form.tracks_business === 'true'}
							<div>
								<label
									for="business-type"
									class="mb-2 block text-sm font-medium text-slate-700"
								>
									What type of business are you tracking?
								</label>
								<input
									id="business-type"
									bind:value={form.business_type}
									type="text"
									placeholder="e.g. Ecommerce, Services, Retail, Beauty"
								/>
							</div>
						{/if}

						<div class="flex justify-between">
							<button
								type="button"
								onclick={prevStep}
								class="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
							>
								Back
							</button>

							<button type="button" onclick={nextStep} class="btn-primary">
								Continue
							</button>
						</div>
					</div>
				{/if}

				{#if step === 4}
					<div class="space-y-6">
						<div class="max-w-2xl">
							<p class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
								Question 4
							</p>
							<h2 class="mt-2 text-3xl font-bold text-slate-900">
								Which categories do you want to track?
							</h2>
							<p class="mt-3 text-slate-600">
								Choose the categories you care about most. You can update these later anytime.
							</p>
						</div>

						<div class="grid gap-4 sm:grid-cols-2">
							{#each currentCategories() as category}
								<button
									type="button"
									onclick={() => toggleCategory(category)}
									class={`rounded-2xl border p-5 text-left transition ${
										form.categories.includes(category)
											? 'border-blue-600 bg-blue-50'
											: 'border-slate-200 hover:bg-slate-50'
									}`}
								>
									<p class="font-semibold text-slate-900">{category}</p>
									<p class="mt-2 text-sm text-slate-500">
										{form.categories.includes(category) ? 'Selected' : 'Tap to add'}
									</p>
								</button>
							{/each}
						</div>

						{#if form.categories.length > 0}
							<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
								<p class="text-sm font-semibold text-slate-900">Selected categories</p>
								<div class="mt-3 flex flex-wrap gap-2">
									{#each form.categories as category}
										<span
											class="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
										>
											{category}
										</span>
									{/each}
								</div>
							</div>
						{/if}

						<div class="flex justify-between">
							<button
								type="button"
								onclick={prevStep}
								class="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
							>
								Back
							</button>

							<button type="button" onclick={nextStep} class="btn-primary">
								Continue
							</button>
						</div>
					</div>
				{/if}

				{#if step === 5}
					<div class="space-y-6">
						<div class="max-w-2xl">
							<p class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
								Question 5
							</p>
							<h2 class="mt-2 text-3xl font-bold text-slate-900">
								How often do you want alerts and financial insights?
							</h2>
							<p class="mt-3 text-slate-600">
								We’ll use this to make your experience feel more helpful and less noisy.
							</p>
						</div>

						<div class="grid gap-4 sm:grid-cols-3">
							{#each alertOptions as option}
								<button
									type="button"
									onclick={() => (formState.alert_preference = option.value)}
									class={`rounded-2xl border p-5 text-left transition ${
										formState.alert_preference === option.value
											? 'border-blue-600 bg-blue-50'
											: 'border-slate-200 hover:bg-slate-50'
									}`}
								>
									<p class="text-lg font-semibold text-slate-900">{option.title}</p>
									<p class="mt-2 text-sm text-slate-600">{option.desc}</p>
								</button>
							{/each}
						</div>

						<form method="POST" class="space-y-4">
							<input type="hidden" name="monthly_budget" value={formState.monthly_budget} />
							<input type="hidden" name="primary_goal" value={formState.primary_goal} />
							<input type="hidden" name="tracks_business" value={formState.tracks_business} />
							<input type="hidden" name="business_type" value={formState.business_type} />
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

							<div class="flex justify-between">
								<button
									type="button"
									onclick={prevStep}
									class="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
								>
									Back
								</button>

								<button type="submit" class="btn-primary">
									Finish setup
								</button>
							</div>
						</form>

						{#if form?.success && form?.summary}
							<div
								class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-6"
							>
								<div
									class="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl"
								>
									<p class="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
										Setup complete
									</p>

									<h2 class="mt-3 text-3xl font-bold text-slate-900">
										Your DollarView account is ready.
									</h2>

									<p class="mt-3 leading-7 text-slate-600">
										Here’s a quick summary of the preferences you selected.
									</p>

									<div class="mt-6 grid gap-4 sm:grid-cols-2">
										<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
											<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
												Monthly budget
											</p>
											<p class="mt-2 text-lg font-bold text-slate-900">
												${form.summary.monthly_budget ?? 'Not set'}
											</p>
										</div>

										<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
											<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
												Primary goal
											</p>
											<p class="mt-2 text-lg font-bold text-slate-900">
												{formatGoal(form.summary.primary_goal)}
											</p>
										</div>

										<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
											<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
												Usage type
											</p>
											<p class="mt-2 text-lg font-bold text-slate-900">
												{form.summary.tracks_business
													? 'Business finances'
													: 'Personal finances'}
											</p>
										</div>

										<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
											<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
												Business type
											</p>
											<p class="mt-2 text-lg font-bold text-slate-900">
												{form.summary.business_type || 'Not provided'}
											</p>
										</div>

										<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
											<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
												Alert preference
											</p>
											<p class="mt-2 text-lg font-bold text-slate-900">
												{formatAlert(form.summary.alert_preference)}
											</p>
										</div>

										<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
											<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
												Selected categories
											</p>

											<div class="mt-3 flex flex-wrap gap-2">
												{#each form.summary.categories as category}
													<span
														class="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
													>
														{category}
													</span>
												{/each}
											</div>
										</div>
									</div>

									<div class="mt-8 flex justify-end">
										<a
											href="/dashboard"
											class="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
										>
											Continue to Dashboard
										</a>
									</div>
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>