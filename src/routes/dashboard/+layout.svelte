<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import type { LayoutData } from './$types';

	let {
		data,
		children
	}: {
		data: LayoutData;
		children: import('svelte').Snippet;
	} = $props();

	const navItems = [
		{ href: '/dashboard', label: 'Overview' },
		{ href: '/dashboard/transactions', label: 'Transactions' },
		{ href: '/dashboard/categories', label: 'Categories' },
		{ href: '/dashboard/reports', label: 'Reports' },
		{ href: '/dashboard/alerts', label: 'Alerts' },
		{ href: '/dashboard/notifications', label: 'Notifications' },
		{ href: '/dashboard/onboarding', label: 'Onboarding' },
		{ href: '/dashboard/assistant', label: 'AI Assistant' }
	];

	let showWelcome = $state(true);

	function getFullName() {
		const fullName =
			`${data.user.firstName ?? ''} ${data.user.lastName ?? ''}`.trim();

		return fullName || data.user.email?.split('@')[0] || 'User';
	}

	function getFirstLetter() {
		return getFullName().charAt(0).toUpperCase();
	}

	function getFirstName() {
		return data.user.firstName || getFullName().split(' ')[0];
	}

	function isActiveRoute(href: string) {
		if (href === '/dashboard') {
			return page.url.pathname === '/dashboard';
		}

		return page.url.pathname.startsWith(href);
	}

	onMount(() => {
		const timer = window.setTimeout(() => {
			showWelcome = false;
		}, 300000);

		return () => window.clearTimeout(timer);
	});

	$effect(() => {
		if (typeof document === 'undefined') return;

		if (!data.isPremium) {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('dv-theme', 'light');
		}
	});
</script>

<div class="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
	<div class="flex min-h-screen bg-white dark:bg-slate-950">
		<aside
			class="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-5 text-slate-900 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 lg:block"
		>
			<div class="mb-8">
				<p class="text-[11px] font-bold uppercase tracking-[0.4em]">
					<span class="text-blue-600">DOLLAR</span>
					<span class="text-slate-900 dark:text-white">VIEW</span>
				</p>

				<h1 class="mt-2 text-3xl font-bold leading-tight text-slate-900 dark:text-white">
					Finance Tracker
				</h1>
			</div>

			<nav class="space-y-2">
				{#each navItems as item}
					<a
						href={item.href}
						class={`block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
							isActiveRoute(item.href)
								? 'bg-blue-600 text-white shadow-sm'
								: 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
						}`}
					>
						{item.label}
					</a>
				{/each}
			</nav>

			<div class="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
				<form method="POST" action="/logout">
					<button
						type="submit"
						class="text-sm font-medium text-slate-700 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
					>
						Logout
					</button>
				</form>
			</div>
		</aside>

		<div class="flex min-w-0 flex-1 flex-col bg-white dark:bg-slate-950">
			<header
				class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-4 text-slate-900 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-100 sm:px-6"
			>
				<div class="flex items-center justify-between gap-4">
					<div class="min-h-[24px] min-w-0">
						{#if showWelcome}
							<p
								in:fade={{ duration: 300 }}
								out:fade={{ duration: 500 }}
								class="truncate text-sm text-slate-500 dark:text-slate-400"
							>
								Welcome back,
								<span class="font-semibold text-slate-900 dark:text-white">
									{getFirstName()}
								</span>
							</p>
						{:else}
							<p
								in:fade={{ duration: 300 }}
								class="text-sm font-bold uppercase tracking-[0.3em]"
							>
								<span class="text-blue-600">DOLLAR</span>
								<span class="text-slate-900 dark:text-white">VIEW</span>
							</p>
						{/if}
					</div>

					<div class="flex shrink-0 items-center gap-3 sm:gap-4">
						<ThemeToggle isPremium={data.isPremium} />

						<div class="flex items-center gap-3">
							<div
								class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white"
							>
								{getFirstLetter()}
							</div>

							<div class="hidden text-right sm:block">
								<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
									Logged in as
								</p>

								<p class="text-sm font-semibold text-slate-900 dark:text-white">
									{getFullName()}
								</p>
							</div>
						</div>
					</div>
				</div>
			</header>

			<main
				class="min-h-0 flex-1 bg-white p-4 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:p-6"
			>
				{@render children()}
			</main>
		</div>
	</div>
</div>