<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import CountUp from '$lib/components/CountUp.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import RevenueChart from '$lib/components/RevenueChart.svelte';
	import Footer from '$lib/components/Footer.svelte';

	const revenueValue = 18210;
	const expensesValue = 7963;
	const profitValue = 10247;

	const activity = [
		{ name: 'Amazon', type: 'Shopping', amount: '-$24.99', badge: 'AM' },
		{ name: 'Spotify', type: 'Subscription', amount: '-$10.99', badge: 'SP' },
		{ name: 'Payroll', type: 'Income', amount: '+$3,120', badge: 'PY' }
	];

	const features = [
		{
			kicker: 'Track',
			title: 'See every dollar clearly',
			desc: 'Organize income, expenses, categories, and recurring activity without digging through spreadsheets.'
		},
		{
			kicker: 'Understand',
			title: 'Turn activity into insight',
			desc: 'Use charts, reports, and time-based comparisons to understand what changed and why.'
		},
		{
			kicker: 'Act',
			title: 'Know what deserves attention',
			desc: 'Surface budgets, upcoming costs, and meaningful changes before they become surprises.'
		}
	];

	const steps = [
		{ number: '01', title: 'Add your activity', desc: 'Capture income and expenses in one organized place.' },
		{ number: '02', title: 'See the pattern', desc: 'DollarView turns transactions into trends and category views.' },
		{ number: '03', title: 'Make the next move', desc: 'Use alerts and insights to make decisions with more confidence.' }
	];

	const heroInsights = [
		{
			eyebrow: 'Spending trend',
			title: 'Spending is 8% lower this month.',
			body: 'You’re trending toward a stronger month.'
		},
		{
			eyebrow: 'Subscription watch',
			title: '2 subscriptions increased.',
			body: 'Recurring costs rose by $28.47.'
		},
		{
			eyebrow: 'Savings outlook',
			title: 'You’re on track to save $412.',
			body: 'Your current pace is ahead of last month.'
		}
	];

	let activeInsight = 0;
	let heroReady = false;

	onMount(() => {
		const revealTimer = window.setTimeout(() => {
			heroReady = true;
		}, 120);

		const insightTimer = window.setInterval(() => {
			activeInsight = (activeInsight + 1) % heroInsights.length;
		}, 2800);

		return () => {
			window.clearTimeout(revealTimer);
			window.clearInterval(insightTimer);
		};
	});
</script>

<svelte:head>
	<title>DollarView | See your money clearly</title>
	<meta
		name="description"
		content="DollarView helps you track spending, understand trends, and make clearer financial decisions."
	/>
</svelte:head>

<div class="min-h-screen bg-[#f7f9fc] text-slate-950">
	<Navbar />

	<!-- HERO -->
	<section class="relative overflow-hidden px-6 pb-24 pt-14 lg:pt-20">
		<div class="pointer-events-none absolute inset-0 -z-10">
			<div class="absolute left-1/2 top-[-18rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl"></div>
			<div class="absolute right-[-8rem] top-32 h-72 w-72 rounded-full bg-cyan-100/80 blur-3xl"></div>
			<div class="absolute left-[-10rem] bottom-0 h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl"></div>
			<div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
		</div>

		<div class="mx-auto grid max-w-7xl items-center gap-14 xl:grid-cols-[0.92fr_1.08fr]">
			<div class="relative z-10">
				<div class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
					<span class="h-2 w-2 rounded-full bg-blue-600"></span>
					Your money, made easier to read
				</div>

				<p class="mt-7 text-sm font-black uppercase tracking-[0.42em]">
					<span class="text-blue-600">DOLLAR</span><span class="text-slate-950">VIEW</span>
				</p>

				<h1 class="mt-5 max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.055em] text-slate-950 md:text-6xl xl:text-7xl">
					Know where your money is going
					<span class="relative inline-block text-blue-600">
						before it surprises you.
						<span class="absolute bottom-1 left-0 h-3 w-full -z-10 rounded-full bg-blue-100"></span>
					</span>
				</h1>

				<p class="mt-7 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
					Track spending, understand trends, and turn everyday financial activity into clearer decisions
					without the clutter.
				</p>

				<div class="mt-9 flex flex-wrap items-center gap-4">
					<a
						href={resolve('/signup')}
						class="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3.5 font-bold text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-blue-600"
					>
						Start using DollarView
					</a>

					<a
						href={resolve('/features')}
						class="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white/90 px-6 py-3.5 font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400"
					>
						Explore features
					</a>
				</div>

				<div class="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-slate-500">
					<span class="inline-flex items-center gap-2"><span class="text-emerald-500">●</span> Free to start</span>
					<span class="inline-flex items-center gap-2"><span class="text-blue-500">●</span> Built for clarity</span>
					<span class="inline-flex items-center gap-2"><span class="text-violet-500">●</span> Works across devices</span>
				</div>
			</div>

			<!-- PRODUCT PREVIEW -->
			<div
				class={`relative transition-all duration-700 ease-out ${
					heroReady ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-[0.985] opacity-0'
				}`}
			>
				<div class="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-blue-200/70 via-white to-indigo-100/80 blur-3xl"></div>

				<div class="relative overflow-hidden rounded-[2.2rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_40px_100px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:p-5">
					<div class="flex items-center justify-between border-b border-slate-100 px-2 pb-4">
						<div class="flex items-center gap-2">
							<span class="h-3 w-3 rounded-full bg-rose-300"></span>
							<span class="h-3 w-3 rounded-full bg-amber-300"></span>
							<span class="h-3 w-3 rounded-full bg-emerald-300"></span>
						</div>

						<div class="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
							Live financial view
						</div>
					</div>

					<div class="grid gap-4 pt-4 lg:grid-cols-[1.15fr_0.85fr]">
						<div class="space-y-4">
							<div class="relative overflow-hidden rounded-[1.7rem] bg-slate-950 p-6 text-white">
								<div class="absolute right-[-3rem] top-[-3rem] h-36 w-36 rounded-full bg-blue-500/25 blur-2xl"></div>
								<p class="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Net position</p>
								<div class="mt-3 flex flex-wrap items-end justify-between gap-3">
									<div>
										<p class="text-4xl font-black tracking-tight">$10,247</p>
										<p class="mt-2 text-sm text-slate-400">Revenue minus expenses this period</p>
									</div>
									<span class="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">+4.8%</span>
								</div>
							</div>

							<div class="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm">
								<div class="mb-4 flex items-center justify-between gap-3">
									<div>
										<p class="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Money movement</p>
										<h2 class="mt-1 text-lg font-black text-slate-950">A clearer financial picture</h2>
									</div>
									<span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">30 days</span>
								</div>

								<div class="h-52 overflow-hidden rounded-2xl bg-gradient-to-b from-blue-50/80 to-white p-3">
									<RevenueChart />
								</div>
							</div>
						</div>

						<div class="space-y-4">
							<div class="grid grid-cols-3 gap-2 lg:grid-cols-1">
								<div class="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
									<p class="text-xs font-semibold text-slate-400">Revenue</p>
									<p class="mt-2 text-xl font-black text-blue-600">
										$
										{#if browser}
											<CountUp value={revenueValue} duration={1.8} />
										{:else}
											{revenueValue.toLocaleString()}
										{/if}
									</p>
								</div>

								<div class="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
									<p class="text-xs font-semibold text-slate-400">Expenses</p>
									<p class="mt-2 text-xl font-black text-rose-600">
										$
										{#if browser}
											<CountUp value={expensesValue} duration={1.8} />
										{:else}
											{expensesValue.toLocaleString()}
										{/if}
									</p>
								</div>

								<div class="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
									<p class="text-xs font-semibold text-slate-400">Profit</p>
									<p class="mt-2 text-xl font-black text-emerald-600">
										$
										{#if browser}
											<CountUp value={profitValue} duration={1.8} />
										{:else}
											{profitValue.toLocaleString()}
										{/if}
									</p>
								</div>
							</div>

							<div class="relative min-h-[11rem] overflow-hidden rounded-[1.5rem] border border-blue-200 bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white shadow-[0_18px_40px_rgba(37,99,235,0.24)]">
								<div class="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl"></div>

								<div class="relative">
									<div class="flex items-center justify-between gap-3">
										<p class="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-100">
											DollarView insight
										</p>
										<span class="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_0_5px_rgba(110,231,183,0.12)]"></span>
									</div>

									<div class="mt-4 grid">
										{#key activeInsight}
											<div class="col-start-1 row-start-1 animate-[insightIn_500ms_ease-out]">
												<p class="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
													{heroInsights[activeInsight].eyebrow}
												</p>
												<p class="mt-2 text-lg font-black leading-snug">
													{heroInsights[activeInsight].title}
												</p>
												<p class="mt-2 text-sm leading-6 text-blue-100">
													{heroInsights[activeInsight].body}
												</p>
											</div>
										{/key}
									</div>

									<div class="mt-4 flex items-center gap-2">
										{#each heroInsights as _, index}
											<span
												class={`h-1.5 rounded-full transition-all duration-300 ${
													index === activeInsight ? 'w-8 bg-white' : 'w-3 bg-white/30'
												}`}
											></span>
										{/each}
									</div>
								</div>
							</div>

							<div class="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
								<div class="flex items-center justify-between">
									<p class="text-sm font-black text-slate-950">Recent activity</p>
									<span class="text-xs font-semibold text-slate-400">Today</span>
								</div>

								<div class="mt-3 space-y-2">
									{#each activity as item}
										<div class="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
											<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[10px] font-black text-slate-600 shadow-sm">
												{item.badge}
											</div>
											<div class="min-w-0 flex-1">
												<p class="truncate text-sm font-bold text-slate-900">{item.name}</p>
												<p class="text-xs text-slate-400">{item.type}</p>
											</div>
											<p class={`text-sm font-black ${item.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-900'}`}>
												{item.amount}
											</p>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="absolute -left-6 top-1/2 hidden -translate-y-1/2 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur xl:block">
					<p class="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Budget status</p>
					<p class="mt-2 text-xl font-black text-slate-950">68%</p>
					<div class="mt-3 h-2 w-32 overflow-hidden rounded-full bg-slate-100">
						<div class="h-full w-[68%] rounded-full bg-blue-600"></div>
					</div>
					<p class="mt-2 text-xs text-slate-500">On pace this month</p>
				</div>
			</div>
		</div>
	</section>

	<!-- VALUE STRIP -->
	<section class="px-6 pb-24">
		<div class="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 px-7 py-8 text-white shadow-[0_30px_70px_rgba(15,23,42,0.12)] md:px-10">
			<div class="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.25em] text-blue-300">Less noise. More signal.</p>
					<h2 class="mt-3 text-3xl font-black tracking-tight md:text-4xl">Your finances should tell a story.</h2>
				</div>

				<p class="text-base leading-8 text-slate-300 md:text-lg">
					DollarView brings transactions, categories, trends, alerts, and reports together so you can understand
					what changed—not just stare at another spreadsheet.
				</p>
			</div>
		</div>
	</section>

	<!-- FEATURES -->
	<section class="px-6 pb-24">
		<div class="mx-auto max-w-7xl">
			<div class="mb-12 max-w-3xl">
				<p class="text-sm font-black uppercase tracking-[0.24em] text-blue-600">Built around the next decision</p>
				<h2 class="mt-3 text-4xl font-black tracking-[-0.035em] text-slate-950 md:text-5xl">
					Not another dashboard full of numbers.
				</h2>
				<p class="mt-5 text-lg leading-8 text-slate-600">
					DollarView is designed to help you move from tracking to understanding to action.
				</p>
			</div>

			<div class="grid gap-5 lg:grid-cols-3">
				{#each features as feature, index}
					<div class={`group relative overflow-hidden rounded-[2rem] border p-7 transition duration-300 hover:-translate-y-1 ${
						index === 1
							? 'border-blue-200 bg-blue-600 text-white shadow-[0_24px_60px_rgba(37,99,235,0.20)]'
							: 'border-slate-200 bg-white text-slate-950 shadow-sm hover:shadow-[0_20px_45px_rgba(15,23,42,0.08)]'
					}`}>
						<div class={`mb-10 flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black ${
							index === 1 ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'
						}`}>
							0{index + 1}
						</div>

						<p class={`text-xs font-bold uppercase tracking-[0.22em] ${index === 1 ? 'text-blue-100' : 'text-blue-600'}`}>
							{feature.kicker}
						</p>
						<h3 class="mt-3 text-2xl font-black tracking-tight">{feature.title}</h3>
						<p class={`mt-4 leading-7 ${index === 1 ? 'text-blue-100' : 'text-slate-600'}`}>
							{feature.desc}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- HOW IT WORKS -->
	<section class="px-6 pb-24">
		<div class="mx-auto grid max-w-7xl gap-12 rounded-[2.5rem] border border-slate-200 bg-white px-7 py-12 shadow-sm md:px-10 lg:grid-cols-[0.75fr_1.25fr] lg:px-14 lg:py-16">
			<div>
				<p class="text-sm font-black uppercase tracking-[0.24em] text-blue-600">How it works</p>
				<h2 class="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950">Clarity in three steps.</h2>
				<p class="mt-5 max-w-md text-lg leading-8 text-slate-600">
					Keep the workflow simple enough to use every day and useful enough to come back to.
				</p>
			</div>

			<div class="divide-y divide-slate-100">
				{#each steps as step}
					<div class="grid gap-3 py-6 first:pt-0 last:pb-0 sm:grid-cols-[5rem_1fr]">
						<p class="text-sm font-black tracking-[0.2em] text-slate-300">{step.number}</p>
						<div>
							<h3 class="text-xl font-black text-slate-950">{step.title}</h3>
							<p class="mt-2 leading-7 text-slate-600">{step.desc}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- MOBILE / APP TEASER -->
	<section class="px-6 pb-24">
		<div class="mx-auto grid max-w-7xl items-center gap-12 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#eef4ff] via-white to-[#eef2ff] px-7 py-12 md:px-12 lg:grid-cols-2 lg:py-16">
			<div>
				<p class="text-sm font-black uppercase tracking-[0.24em] text-blue-600">DollarView anywhere</p>
				<h2 class="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950 md:text-5xl">
					Financial clarity that follows you.
				</h2>
				<p class="mt-5 max-w-xl text-lg leading-8 text-slate-600">
					The mobile experience is in development, bringing transactions, alerts, categories, and insights into a faster on-the-go view.
				</p>

				<div class="mt-8 flex flex-wrap gap-4">
					<div class="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white">
						Mobile app coming soon
					</div>
					<a
						href={resolve('/signup')}
						class="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5"
					>
						Create account
					</a>
				</div>
			</div>

			<div class="relative mx-auto w-full max-w-md">
				<div class="absolute inset-8 rounded-full bg-blue-200/70 blur-3xl"></div>

				<div class="relative mx-auto w-[18rem] rounded-[2.8rem] border-[9px] border-slate-950 bg-white p-3 shadow-[0_35px_80px_rgba(15,23,42,0.22)]">
					<div class="mx-auto mt-1 h-5 w-24 rounded-full bg-slate-950"></div>

					<div class="mt-3 overflow-hidden rounded-[2rem] bg-[#f7f9fc] p-4">
						<div class="flex items-center justify-between">
							<p class="text-[10px] font-bold text-slate-500">9:41</p>
							<p class="text-xs font-black tracking-[0.18em]">
								<span class="text-blue-600">DOLLAR</span><span>VIEW</span>
							</p>
						</div>

						<div class="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
							<p class="text-[10px] uppercase tracking-[0.18em] text-slate-400">Available</p>
							<p class="mt-2 text-3xl font-black">$2,942</p>
							<p class="mt-2 text-xs text-emerald-300">+$184 vs last month</p>
						</div>

						<div class="mt-3 grid grid-cols-2 gap-3">
							<div class="rounded-2xl bg-white p-3 shadow-sm">
								<p class="text-[10px] font-semibold text-slate-400">Spent</p>
								<p class="mt-1 text-lg font-black text-slate-950">$3,298</p>
							</div>
							<div class="rounded-2xl bg-white p-3 shadow-sm">
								<p class="text-[10px] font-semibold text-slate-400">Saved</p>
								<p class="mt-1 text-lg font-black text-blue-600">$2,942</p>
							</div>
						</div>

						<div class="mt-3 rounded-2xl bg-blue-600 p-4 text-white">
							<p class="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-100">Insight</p>
							<p class="mt-2 text-sm font-black">You’re spending less on dining this month.</p>
						</div>

						<div class="mt-3 rounded-2xl bg-white p-4 shadow-sm">
							<p class="text-xs font-black text-slate-900">Recent</p>
							<div class="mt-3 space-y-2">
								{#each activity.slice(0, 2) as item}
									<div class="flex items-center justify-between text-xs">
										<span class="font-semibold text-slate-600">{item.name}</span>
										<span class="font-black text-slate-900">{item.amount}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- FINAL CTA -->
	<section class="px-6 pb-24">
		<div class="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-slate-950 px-8 py-14 text-center text-white shadow-[0_35px_80px_rgba(15,23,42,0.16)] md:px-14 md:py-16">
			<div class="absolute left-[-6rem] top-[-6rem] h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
			<div class="absolute right-[-6rem] bottom-[-6rem] h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>

			<div class="relative">
				<p class="text-sm font-black uppercase tracking-[0.24em] text-blue-300">See your money differently</p>
				<h2 class="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-[-0.045em] md:text-5xl">
					Make your financial picture easier to understand.
				</h2>
				<p class="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
					Start with the essentials, then explore deeper reports, alerts, and premium tools as DollarView grows with you.
				</p>

				<div class="mt-8 flex flex-wrap justify-center gap-4">
					<a
						href={resolve('/signup')}
						class="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 font-black text-slate-950 transition hover:-translate-y-0.5"
					>
						Create your account
					</a>
					<a
						href={resolve('/pricing')}
						class="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-black text-white backdrop-blur transition hover:bg-white/10"
					>
						View pricing
					</a>
				</div>
			</div>
		</div>
	</section>

	<Footer />
</div>


<style>
	@keyframes insightIn {
		from {
			opacity: 0;
			transform: translateY(10px);
			filter: blur(3px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
			filter: blur(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(*) {
			scroll-behavior: auto !important;
		}
	}
</style>
