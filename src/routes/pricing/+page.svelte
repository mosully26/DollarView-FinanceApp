<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';

	const plans = [
		{
			name: 'Free',
			price: 0,
			description: 'Perfect for individuals getting started',
			features: [
				'Track income & expenses',
				'Basic charts & insights',
				'Monthly reports',
				'Category tracking',
				'Manual data entry',
				'History filters: 1, 3, and 6 months only'
			],
			buttonLabel: 'Get Started',
			buttonHref: '/signup'
		},
		{
			name: 'Premium',
			price: 9.99,
			description: 'Advanced tools for growing businesses',
			features: [
				'Includes all Free features',
				'Access to 5 additional charts and graphs',
				'Built-in dark and light theme modes',
				'Extended history filters up to 72 months + all-time',
				'Export financial reports',
				'Priority customer support'
			],
			buttonLabel: 'Upgrade to Premium',
			buttonHref: '/checkout/premium'
		}
	];
</script>

<svelte:head>
	<title>Pricing | DollarView</title>
	<meta
		name="description"
		content="Choose the DollarView plan that fits your needs. Start free and upgrade to Premium for advanced financial tracking features."
	/>
</svelte:head>

<Navbar />

<section class="px-6 pt-28 pb-20">
	<div class="mx-auto max-w-4xl text-center">
		<p class="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
			Pricing
		</p>

		<h1 class="mt-3 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
			Simple pricing for smarter
			<span class="block text-blue-600">finances</span>
		</h1>

		<p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
			Choose the plan that fits your needs. Start free and upgrade as your
			financial tracking grows.
		</p>
	</div>

	<div class="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2">
		{#each plans as plan}
			<div
				class={`flex flex-col justify-between rounded-2xl border bg-white p-8 text-slate-900 transition ${
					plan.name === 'Premium'
						? 'scale-[1.02] border-blue-500 shadow-lg'
						: 'border-slate-200 shadow-sm'
				}`}
			>
				<div>
					<h2 class="text-xl font-semibold">{plan.name}</h2>

					<p class="mt-2 text-slate-500">{plan.description}</p>

					<div class="mt-6 text-4xl font-bold">
						${plan.price}
						<span class="text-sm font-normal text-slate-500">/ month</span>
					</div>

					<ul class="mt-6 space-y-3">
						{#each plan.features as feature}
							<li class="flex items-center gap-2">
								<span class="text-emerald-600">✔</span>
								<span>{feature}</span>
							</li>
						{/each}
					</ul>
				</div>

				<a
					href={plan.buttonHref}
					class={`mt-8 inline-flex w-full items-center justify-center rounded-xl py-3 font-semibold transition ${
						plan.name === 'Premium'
							? 'bg-blue-600 text-white hover:bg-blue-700'
							: 'bg-black text-white hover:bg-gray-900'
					}`}
				>
					{plan.buttonLabel}
				</a>
			</div>
		{/each}
	</div>
</section>