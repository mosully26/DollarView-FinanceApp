<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import {
		BarChart3,
		FolderKanban,
		ShieldCheck,
		CalendarRange,
		ReceiptText,
		TrendingUp
	} from 'lucide-svelte';

	const features = [
		{
			title: 'Smart Tracking',
			description: 'Categorize and track every expense and revenue stream in real time.',
			icon: ReceiptText
		},
		{
			title: 'Visual Insights',
			description: 'Analyze trends with clean, interactive charts and reports.',
			icon: BarChart3
		},
		{
			title: 'Time Filters',
			description: 'Break down your finances by month, quarter, year, and extended history ranges.',
			icon: CalendarRange
		},
		{
			title: 'Category Management',
			description: 'Create and manage custom expense and revenue categories for better organization.',
			icon: FolderKanban
		},
		{
			title: 'Monthly Reports',
			description: 'View summaries of revenue, expenses, profit, and transaction activity.',
			icon: TrendingUp
		},
		{
			title: 'Secure User Accounts',
			description: 'Each user has a protected account with isolated dashboard and business data.',
			icon: ShieldCheck
		}
	];
</script>

<svelte:head>
	<title>Features | DollarView</title>
	<meta
		name="description"
		content="Explore the features included in DollarView’s financial tracking application."
	/>
</svelte:head>

<div class="min-h-screen bg-slate-100">
	<Navbar />

	<section class="px-6 pt-24 pb-20">
		<div class="mx-auto max-w-6xl">
			<div class="text-center">
				<p class="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
					Features
				</p>

				<h1 class="mx-auto mt-4 max-w-4xl text-5xl font-bold leading-[1.1] text-slate-950 md:text-6xl">
                    Application features built for  
                    <span class="block text-blue-600">smarter finance tracking</span>
                </h1>

				<p class="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
					DollarView gives users a clean way to track transactions, organize categories,
					filter history, and understand financial performance through a modern dashboard.
				</p>
			</div>

			<div class="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
				{#each features as feature}
					<div class="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
						<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
							<svelte:component this={feature.icon} size={22} />
						</div>

						<h2 class="mt-5 text-xl font-bold text-slate-900">{feature.title}</h2>

						<p class="mt-3 leading-7 text-slate-600">
							{feature.description}
						</p>
					</div>
				{/each}
			</div>

			<div class="mt-20 rounded-3xl bg-slate-900 px-8 py-12 text-center shadow-xl">
				<p class="text-sm font-semibold uppercase tracking-[0.25em] text-sky-400">
					Get Started
				</p>

				<h2 class="mt-4 text-3xl font-bold text-white md:text-4xl">
					Start organizing your finances with more clarity
				</h2>

				<p class="mx-auto mt-4 max-w-2xl text-slate-300">
					Create an account to manage transactions, monitor revenue and expenses, and
					explore everything DollarView has to offer.
				</p>

				<div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<a
						href="/signup"
						class="inline-flex items-center justify-center rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
					>
						Create account
					</a>

					<a
						href="/pricing"
						class="inline-flex items-center justify-center rounded-xl border border-slate-600 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
					>
						View pricing
					</a>
				</div>
			</div>
		</div>
	</section>
</div>