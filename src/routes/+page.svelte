<script lang="ts">
	import CountUp from '$lib/components/CountUp.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import RevenueChart from '$lib/components/RevenueChart.svelte';
	import Features from '$lib/components/Features.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<Navbar />

<div class="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
	<div>
		<p class="text-xl font-bold text-blue-600 mb-4">
            <span class="tracking-widest">DOLLAR</span>
            <span class="tracking-widest text-slate-900">VIEW</span>
        </p>

		<h1 class="text-5xl font-bold leading-tight relative">
			<span class="absolute -left-4 top-2 h-10 w-1 bg-blue-500 rounded"></span>
			Track spending, revenue, and profit with clarity.
		</h1>

		<p class="mt-6 text-slate-600 text-lg max-w-md">
			A bright, professional finance dashboard for personal and business use.
			Add purchases, services, and revenue, then analyze everything with charts
			and time-based filters.
		</p>

		<div class="mt-8 flex gap-4">
                <a
                    href="/signup"
                    class="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium shadow-sm transition-all duration-300 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95">
                    Create account
                </a>

                <a
                    href="/login"
                    class="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-100">
                    Login
                </a>
            </div>
        </div>

	<div class="relative">
		<div class="absolute -inset-4 rounded-3xl bg-blue-100 opacity-30 blur-2xl"></div>

		<div class="relative space-y-4">
			<div
				class="rounded-xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
			>
				<p class="text-slate-500">Revenue</p>
				<h2 class="text-2xl font-bold text-emerald-600">
					$<CountUp value={18210} duration={2.5} />
				</h2>
			</div>

			<div
				class="rounded-xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
			>
				<p class="text-slate-500">Expenses</p>
				<h2 class="text-2xl font-bold text-blue-600">
					$<CountUp value={7963} duration={2.5} />
				</h2>
			</div>

			<div
				class="rounded-xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
			>
				<p class="text-slate-500">Profit</p>
				<h2 class="text-2xl font-bold text-slate-900">
					$<CountUp value={10247} duration={2.5} />
				</h2>
			</div>

			<RevenueChart />
		</div>
	</div>
</div>

<Features />
<Footer />