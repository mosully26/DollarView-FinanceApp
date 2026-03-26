<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import CountUp from '$lib/components/CountUp.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import RevenueChart from '$lib/components/RevenueChart.svelte';
	import Footer from '$lib/components/Footer.svelte';

	const brandCards = [
		{ name: 'Amazon', type: 'Order', amount: '$24.99', tone: 'expense' },
		{ name: 'Spotify', type: 'Subscription', amount: '$10.99', tone: 'expense' },
		{ name: 'Netflix', type: 'Monthly', amount: '$15.49', tone: 'expense' },
		{ name: 'Walmart', type: 'Shopping', amount: '$98.99', tone: 'expense' }
	];

	const featureCards = [
		{
			title: 'Smart tracking',
			desc: 'Track spending, revenue, and profit in one clean dashboard.'
		},
		{
			title: 'Clear reports',
			desc: 'Break down finances by category, time range, and performance trends.'
		},
		{
			title: 'Automated alerts',
			desc: 'Stay ahead of budgets, recurring costs, and important due dates.'
		}
	];

	const miniStats = [
		{ label: 'Active alerts', value: '12', tone: 'blue' },
		{ label: 'Tracked categories', value: '18', tone: 'slate' },
		{ label: 'Monthly trend', value: '+12%', tone: 'green' }
	];

	const revenueValue = 18210;
	const expensesValue = 7963;
	const profitValue = 10247;
</script>

<svelte:head>
	<title>DollarView | Finance Tracker</title>
</svelte:head>

<Navbar />

<section class="relative overflow-hidden px-6 pb-20 pt-12">
	<div class="absolute inset-0 -z-10">
		<div class="absolute left-[-8rem] top-[-3rem] h-72 w-72 rounded-full bg-blue-200/40 blur-3xl"></div>
		<div class="absolute right-[-8rem] top-20 h-80 w-80 rounded-full bg-sky-100/70 blur-3xl"></div>
		<div class="absolute bottom-[-6rem] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-slate-200/50 blur-3xl"></div>
	</div>

	<div class="mx-auto grid max-w-7xl items-center gap-14 xl:grid-cols-[1.05fr_0.95fr]">
		<div>
			<div
				class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"
			>
				<span class="inline-block h-2 w-2 rounded-full bg-blue-600"></span>
				Finance tracking built for clarity
			</div>

			<p class="mt-6 text-sm font-bold uppercase tracking-[0.45em]">
				<span class="text-blue-600">DOLLAR</span><span class="text-slate-900">VIEW</span>
			</p>

			<h1 class="mt-5 max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 md:text-6xl">
				Track spending, revenue, and profit with a cleaner financial workflow.
			</h1>

			<p class="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
				DollarView helps individuals and businesses organize transactions, monitor trends,
				and stay on top of budgets with charts, alerts, and a polished dashboard experience.
			</p>

			<div class="mt-8 flex flex-wrap gap-4">
				<a
					href={resolve('/signup')}
					class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-[0_16px_35px_rgba(37,99,235,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
				>
					Create account
				</a>

				<a
					href={resolve('/login')}
					class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-100"
				>
					Login
				</a>
			</div>

			<div class="mt-10 grid gap-4 sm:grid-cols-3">
				{#each miniStats as stat}
					<div class="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
						<p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
							{stat.label}
						</p>
						<p
							class={`mt-2 text-2xl font-bold ${
								stat.tone === 'blue'
									? 'text-blue-600'
									: stat.tone === 'green'
										? 'text-emerald-600'
										: 'text-slate-900'
							}`}
						>
							{stat.value}
						</p>
					</div>
				{/each}
			</div>

			<div class="mt-10 grid gap-4 sm:grid-cols-3">
				{#each featureCards as card}
					<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
							{card.title}
						</p>
						<p class="mt-3 text-sm leading-6 text-slate-600">{card.desc}</p>
					</div>
				{/each}
			</div>
		</div>

		<div class="relative">
			<div class="absolute -inset-8 rounded-[2.5rem] bg-blue-100/50 blur-3xl"></div>

			<div class="relative space-y-4 rounded-[2rem] border border-slate-200 bg-white/80 p-5 shadow-[0_25px_70px_rgba(15,23,42,0.10)] backdrop-blur">
				<div class="grid gap-4 sm:grid-cols-3">
					<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<p class="text-sm text-slate-500">Revenue</p>
						<h2 class="mt-2 text-3xl font-extrabold text-blue-600">
							$
							{#if browser}
								<CountUp value={revenueValue} duration={4} />
							{:else}
								{revenueValue.toLocaleString()}
							{/if}
						</h2>
						<p class="mt-2 text-sm text-slate-500">Steady monthly growth</p>
					</div>

					<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<p class="text-sm text-slate-500">Expenses</p>
						<h2 class="mt-2 text-3xl font-extrabold text-rose-600">
							$
							{#if browser}
								<CountUp value={expensesValue} duration={4} />
							{:else}
								{expensesValue.toLocaleString()}
							{/if}
						</h2>
						<p class="mt-2 text-sm text-slate-500">Organized by category</p>
					</div>

					<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<p class="text-sm text-slate-500">Profit</p>
						<h2 class="mt-2 text-3xl font-extrabold text-emerald-600">
							$
							{#if browser}
								<CountUp value={profitValue} duration={4} />
							{:else}
								{profitValue.toLocaleString()}
							{/if}
						</h2>
						<p class="mt-2 text-sm text-slate-500">Positive monthly margin</p>
					</div>
				</div>

				<div class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
					<div class="mb-4 flex items-center justify-between">
						<div>
							<p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
								Performance overview
							</p>
							<h2 class="mt-2 text-xl font-bold text-slate-900">
								Financial movement at a glance
							</h2>
						</div>

						<div class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
							+1.2% this period
						</div>
					</div>

					<RevenueChart />
				</div>
			</div>
		</div>
	</div>
</section>

<section class="px-6 pb-20">
	<div
		class="mx-auto grid max-w-7xl items-center gap-14 overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 px-8 py-12 shadow-sm md:grid-cols-2 md:px-12"
	>
		<div>
			<p class="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600">
				On the go
			</p>

			<h2 class="mt-3 text-4xl font-bold leading-tight text-slate-900">
				Manage spending from anywhere with a cleaner mobile experience.
			</h2>

			<p class="mt-5 max-w-xl text-lg leading-8 text-slate-600">
				Our mobile experience is currently in development. Soon you’ll be able to monitor
				purchases, revenue trends, budget progress, and activity from your phone.
			</p>

			<div class="mt-8 flex flex-wrap gap-4">
				<div
					class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white"
				>
					App Coming Soon
				</div>

				<a
					href={resolve('/signup')}
					class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
				>
					Create Account
				</a>
			</div>
		</div>

		<div class="relative mx-auto flex w-full max-w-[34rem] items-center justify-center">
			<div class="absolute inset-x-10 bottom-4 top-10 rounded-full bg-blue-100/60 blur-3xl"></div>

			<div class="relative">
				<div
					class="relative mx-auto h-[36rem] w-[18rem] rounded-[2.8rem] border-[10px] border-slate-900 bg-white p-4 shadow-[0_30px_80px_rgba(15,23,42,0.22)]"
				>
					<div class="absolute left-1/2 top-3 h-6 w-28 -translate-x-1/2 rounded-full bg-slate-950"></div>

					<div class="h-full overflow-hidden rounded-[2rem] bg-gradient-to-b from-blue-50 via-white to-white p-4">
						<div class="mb-5 flex items-center justify-between pt-4">
							<div class="text-xs font-semibold text-slate-500">9:41</div>
							<div class="text-sm font-bold tracking-[0.25em]">
								<span class="text-blue-600">DOLLAR</span><span class="text-slate-900">VIEW</span>
							</div>
						</div>

						<div class="space-y-3">
							<div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
								<p class="text-xs text-slate-500">This month</p>
								<p class="mt-1 text-2xl font-bold text-slate-900">$3,298</p>
								<p class="mt-1 text-xs text-emerald-600">$98 below average spend</p>
							</div>

							<div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
								<div class="mb-2 flex items-center justify-between">
									<p class="text-sm font-semibold text-slate-900">Recent activity</p>
									<p class="text-xs text-slate-500">4 items</p>
								</div>

								<div class="space-y-2">
									{#each brandCards.slice(0, 3) as item (item.name)}
										<div class="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
											<div>
												<p class="text-sm font-medium text-slate-900">{item.name}</p>
												<p class="text-xs text-slate-500">{item.type}</p>
											</div>
											<p class="text-sm font-semibold text-rose-600">{item.amount}</p>
										</div>
									{/each}
								</div>
							</div>

							<div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
								<div class="mb-2 flex items-center justify-between">
									<p class="text-sm font-semibold text-slate-900">Revenue trend</p>
									<span class="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
										+1.2%
									</span>
								</div>

								<div class="h-32 rounded-xl bg-gradient-to-b from-blue-50 to-white p-3">
									<div class="flex h-full items-end gap-2">
										<div class="w-full rounded-t bg-blue-200" style="height: 38%"></div>
										<div class="w-full rounded-t bg-blue-300" style="height: 56%"></div>
										<div class="w-full rounded-t bg-blue-300" style="height: 49%"></div>
										<div class="w-full rounded-t bg-blue-400" style="height: 72%"></div>
										<div class="w-full rounded-t bg-blue-500" style="height: 81%"></div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div
						class="absolute -right-10 top-14 w-56 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur"
					>
						{#each brandCards as item (item.name)}
							<div
								class="flex items-center justify-between border-b border-slate-100 px-2 py-3 last:border-b-0"
							>
								<div>
									<p class="text-sm font-semibold text-slate-900">{item.name}</p>
									<p class="text-xs text-slate-500">{item.type}</p>
								</div>
								<p
									class={`text-sm font-semibold ${
										item.tone === 'expense' ? 'text-slate-900' : 'text-blue-600'
									}`}
								>
									{item.amount}
								</p>
							</div>
						{/each}
					</div>

					<div
						class="absolute -left-8 bottom-20 w-44 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur"
					>
						<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
							Active budget
						</p>
						<p class="mt-2 text-2xl font-bold text-slate-900">$1,240</p>
						<div class="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
							<div class="h-full w-[68%] rounded-full bg-blue-600"></div>
						</div>
						<p class="mt-2 text-xs text-slate-500">68% of monthly spending target used</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="px-6 pb-20">
	<div class="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
		{#each featureCards as card}
			<div class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
				<p class="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
					{card.title}
				</p>
				<h3 class="mt-3 text-xl font-bold text-slate-900">{card.title}</h3>
				<p class="mt-3 text-slate-600 leading-7">
					{card.desc}
				</p>
			</div>
		{/each}
	</div>
</section>

<section class="px-6 pb-20">
	<div class="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
		<p class="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Explore More</p>
		<h2 class="mt-3 text-3xl font-bold text-slate-900">
			See everything DollarView offers
		</h2>
		<p class="mx-auto mt-4 max-w-2xl text-slate-600 leading-7">
			View the full feature set and learn how DollarView helps organize transactions,
			categories, reporting, notifications, and financial insights.
		</p>

		<div class="mt-8 flex flex-wrap justify-center gap-4">
			<a
				href={resolve('/features')}
				class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
			>
				View Features
			</a>

			<a
				href={resolve('/pricing')}
				class="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
			>
				View Pricing
			</a>
		</div>
	</div>
</section>

<Footer />