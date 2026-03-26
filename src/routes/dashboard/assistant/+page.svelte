<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData | null } = $props();

	const promptCards = [
		'What changed in my spending this month?',
		'Which category had the highest expenses?',
		'Summarize my recent alerts.',
		'How is my profit looking right now?',
		'What should I pay attention to this week?',
		'What financial trends stand out?'
	];

	const featureCards = [
		{
			title: 'Real data context',
			desc: 'The assistant answers using your actual transactions, alerts, and notifications.'
		},
		{
			title: 'Financial insights',
			desc: 'Ask about revenue, profit, spending trends, and category activity in plain language.'
		},
		{
			title: 'Smarter guidance',
			desc: 'Use it to understand dashboard activity and decide what to track next.'
		}
	];

	const capabilityCards = [
		{
			title: 'Explain financial activity',
			desc: 'Get quick summaries of spending, revenue, and profit using recent dashboard data.'
		},
		{
			title: 'Summarize alerts',
			desc: 'Understand what notifications mean and what financial activity triggered them.'
		},
		{
			title: 'Identify patterns',
			desc: 'Spot high-expense categories, recent changes, and areas that need attention.'
		}
	];
</script>

<svelte:head>
	<title>AI Assistant | DollarView</title>
</svelte:head>

<div class="space-y-5">
	<section
		class="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/95 p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] md:p-6"
	>
		<div class="pointer-events-none absolute inset-0">
			<div class="absolute -left-16 top-0 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl"></div>
			<div class="absolute right-0 top-6 h-40 w-40 rounded-full bg-sky-100/60 blur-3xl"></div>
			<div class="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-slate-200/50 blur-3xl"></div>
		</div>

		<div class="relative grid gap-5 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
			<div class="max-w-3xl">
				<div
					class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
				>
					<span class="inline-block h-2 w-2 rounded-full bg-blue-600"></span>
					AI-powered financial guidance
				</div>

				<p class="mt-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-blue-600">
					AI Assistant
				</p>

				<h1 class="mt-2 max-w-2xl text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-3xl">
					Ask DollarView about your finances.
				</h1>

				<p class="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
					Get plain-language insights about revenue, expenses, categories, alerts, and recent
					activity using your real dashboard data.
				</p>

				<div class="mt-5 grid gap-3 md:grid-cols-3">
					{#each featureCards as card}
						<div class="rounded-xl border border-slate-200 bg-white/85 p-3 shadow-sm">
							<p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-600">
								{card.title}
							</p>
							<p class="mt-2 text-sm leading-6 text-slate-600">
								{card.desc}
							</p>
						</div>
					{/each}
				</div>
			</div>

			<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
				<div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
					<p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
						Best for
					</p>
					<p class="mt-2 text-base font-bold leading-7 text-slate-900">
						Spending analysis, alert summaries, and dashboard explanations
					</p>
				</div>

				<div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
					<p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
						Access
					</p>
					<p class="mt-2 text-base font-bold leading-7 text-slate-900">
						{#if data.isPremium}
							Included with Premium
						{:else}
							Premium members only
						{/if}
					</p>
				</div>
			</div>
		</div>
	</section>

	{#if data.isPremium}
		<section class="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
			<div class="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
				<div class="mb-5">
					<p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
						Ask a question
					</p>
					<h2 class="mt-2 text-2xl font-bold text-slate-900">Chat with your financial assistant</h2>
					<p class="mt-2 text-sm leading-6 text-slate-600">
						Ask a direct question and DollarView will respond using your current business data.
					</p>
				</div>

				<form method="POST" class="space-y-4">
					<div>
						<label for="question" class="mb-2 block text-sm font-medium text-slate-700">
							Your question
						</label>
						<textarea
							id="question"
							name="question"
							rows="5"
							placeholder="Example: What changed in my spending this month?"
							class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
							required
						></textarea>
					</div>

					<div class="flex flex-wrap items-center gap-3">
						<button type="submit" class="btn-primary">Ask Assistant</button>

						<div class="text-sm text-slate-500">
							Powered by your real transactions, alerts, and notifications.
						</div>
					</div>
				</form>

				{#if form?.error}
					<div class="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
						{form.error}
					</div>
				{/if}

				{#if form?.answer}
					<div
						class="mt-6 rounded-[1.25rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5"
					>
						<div class="flex items-start gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white"
							>
								AI
							</div>

							<div class="min-w-0 flex-1">
								<p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
									Assistant response
								</p>
								<p class="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
									{form.answer}
								</p>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<div class="space-y-5">
				<div class="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
					<p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
						Suggested prompts
					</p>
					<h2 class="mt-2 text-2xl font-bold text-slate-900">Helpful questions to try</h2>

					<div class="mt-5 grid gap-3">
						{#each promptCards as prompt}
							<div
								class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50/50"
							>
								<p class="text-sm font-medium text-slate-800">{prompt}</p>
							</div>
						{/each}
					</div>
				</div>

				<div class="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
					<p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
						What it can do
					</p>
					<h2 class="mt-2 text-2xl font-bold text-slate-900">Use it like a finance guide</h2>

					<div class="mt-5 space-y-3">
						{#each capabilityCards as card}
							<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
								<p class="text-sm font-semibold text-slate-900">{card.title}</p>
								<p class="mt-1 text-sm leading-6 text-slate-600">
									{card.desc}
								</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>
	{:else}
		<section class="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
			<div class="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
				<p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
					Premium feature
				</p>
				<h2 class="mt-2 text-2xl font-bold text-slate-900">AI Assistant is available on Premium</h2>
				<p class="mt-3 text-sm leading-7 text-slate-600">
					Upgrade to Premium to unlock AI-powered financial guidance using your transactions,
					alerts, categories, and recent dashboard activity.
				</p>

				<div
					class="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white p-8 text-center"
				>
					<div
						class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600"
					>
						AI
					</div>

					<p class="mt-5 text-lg font-bold text-slate-900">Unlock smarter financial insights</p>
					<p class="mt-2 text-sm leading-6 text-slate-600">
						Ask questions about profit, expenses, trends, alerts, and category activity in plain
						language.
					</p>

					<a
						href={resolve('/pricing')}
						class="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
					>
						Upgrade to Premium
					</a>
				</div>
			</div>

			<div class="space-y-5">
				<div class="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
					<p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
						Included with Premium
					</p>
					<h2 class="mt-2 text-2xl font-bold text-slate-900">What you’ll unlock</h2>

					<div class="mt-5 space-y-3">
						{#each capabilityCards as card}
							<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
								<p class="text-sm font-semibold text-slate-900">{card.title}</p>
								<p class="mt-1 text-sm leading-6 text-slate-600">
									{card.desc}
								</p>
							</div>
						{/each}
					</div>
				</div>

				<div class="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
					<p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
						Example prompts
					</p>
					<h2 class="mt-2 text-2xl font-bold text-slate-900">Questions Premium users can ask</h2>

					<div class="mt-5 grid gap-3">
						{#each promptCards as prompt}
							<div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
								<p class="text-sm font-medium text-slate-800">{prompt}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>
	{/if}
</div>