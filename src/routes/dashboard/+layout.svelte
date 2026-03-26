<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	const navItems = [
		{ href: '/dashboard', label: 'Overview' },
		{ href: '/dashboard/transactions', label: 'Transactions' },
		{ href: '/dashboard/categories', label: 'Categories' },
		{ href: '/dashboard/reports', label: 'Reports' },
		{ href: '/dashboard/alerts', label: 'Alerts' },
		{ href: '/dashboard/notifications', label: 'Notifications' },
		{ href: '/dashboard/onboarding', label: 'Onboarding' },
		{ href: '/dashboard/assistant', label: 'AI Assistant', premiumOnly: true }
	];

	let showWelcome = $state(true);

	function getFullName() {
		return (
			`${data.user.firstName ?? ''} ${data.user.lastName ?? ''}`.trim() ||
			data.user.email?.split('@')[0] ||
			'User'
		);
	}

	function getFirstLetter() {
		return getFullName().charAt(0).toUpperCase();
	}

	function getFirstName() {
		return data.user.firstName || getFullName().split(' ')[0];
	}

	onMount(() => {
		const timer = setTimeout(() => {
			showWelcome = false;
		}, 300000);

		return () => clearTimeout(timer);
	});

	$effect(() => {
		if (typeof document === 'undefined') return;

		if (!data.isPremium) {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('dv-theme', 'light');
		}
	});
</script>

<div class="min-h-screen bg-slate-100 dark:bg-slate-950">
	<div class="dashboard-shell flex min-h-screen">
		<aside class="w-64 border-r border-slate-200 bg-white p-5 text-slate-900">
			<div class="mb-8">
				<p class="text-[11px] font-bold uppercase tracking-[0.4em]">
					<span class="text-blue-600">DOLLAR</span><span class="text-slate-900">VIEW</span>
				</p>

				<h1 class="mt-2 text-3xl font-bold leading-tight text-slate-900">
					Finance Tracker
				</h1>
			</div>

			<nav class="space-y-2">
				{#each navItems as item}
					<a
						href={item.href}
						class={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
							page.url.pathname === item.href
								? 'bg-blue-600 text-white shadow'
								: 'text-slate-700 hover:bg-slate-100'
						}`}
					>
						<div class="flex items-center gap-2">
							<span>{item.label}</span>

							{#if item.premiumOnly && !data.isPremium}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class={`h-4 w-4 ${
										page.url.pathname === item.href ? 'text-white/90' : 'text-slate-400'
									}`}
								>
									<rect x="3" y="11" width="18" height="10" rx="2" />
									<path d="M7 11V8a5 5 0 0 1 10 0v3" />
								</svg>
							{/if}
						</div>

						{#if item.premiumOnly && !data.isPremium}
							<span
								class={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${
									page.url.pathname === item.href
										? 'bg-white/20 text-white'
										: 'bg-amber-100 text-amber-700'
								}`}
							>
								Premium
							</span>
						{/if}
					</a>
				{/each}
			</nav>

			<div class="mt-8 border-t border-slate-200 pt-6">
				<form method="POST" action="/logout">
					<button
						type="submit"
						class="text-sm font-medium text-slate-700 transition hover:text-blue-600"
					>
						Logout
					</button>
				</form>
			</div>
		</aside>

		<div class="flex min-w-0 flex-1 flex-col">
			<header class="border-b border-slate-200 bg-white px-6 py-4 text-slate-900">
				<div class="flex items-center justify-between">
					<div class="min-h-[24px]">
						{#if showWelcome}
							<p
								in:fade={{ duration: 300 }}
								out:fade={{ duration: 500 }}
								class="text-sm text-slate-500"
							>
								Welcome back,
								<span class="font-semibold text-slate-900">{getFirstName()}</span>
							</p>
						{:else}
							<p
								in:fade={{ duration: 300 }}
								class="text-sm font-bold uppercase tracking-[0.3em]"
							>
								<span class="text-blue-600">DOLLAR</span><span class="text-slate-900">VIEW</span>
							</p>
						{/if}
					</div>

					<div class="flex items-center gap-4">
						<ThemeToggle isPremium={data.isPremium} />

						<div class="flex items-center gap-3">
							<div
								class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white"
							>
								{getFirstLetter()}
							</div>

							<div class="text-right">
								<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
									Logged in as
								</p>
								<p class="text-sm font-semibold text-slate-900">
									{getFullName()}
								</p>
							</div>
						</div>
					</div>
				</div>
			</header>

			<main class="flex-1 p-6 text-slate-900 dark:text-slate-100">
				{@render children()}
			</main>
		</div>
	</div>
</div>