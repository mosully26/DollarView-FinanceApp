<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { resolve } from '$app/paths';
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
	let theme = $state<'light' | 'dark'>('light');

	const isDark = $derived(theme === 'dark');

	function applyTheme(nextTheme: 'light' | 'dark') {
		theme = nextTheme;

		if (typeof document === 'undefined') return;

		document.documentElement.classList.toggle('dark', nextTheme === 'dark');
		document.documentElement.style.colorScheme = nextTheme;
		localStorage.setItem('dv-theme', nextTheme);
	}

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
		const savedTheme = localStorage.getItem('dv-theme');

		applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

		const timer = window.setTimeout(() => {
			showWelcome = false;
		}, 300000);

		return () => window.clearTimeout(timer);
	});
</script>

<div
	class={`min-h-screen transition-colors ${
		isDark
			? 'bg-slate-950 text-slate-100'
			: 'bg-white text-slate-900'
	}`}
>
	<div class="flex min-h-screen">
		<aside
			class={`hidden w-64 shrink-0 border-r p-5 transition-colors lg:block ${
				isDark
					? 'border-slate-800 bg-slate-900 text-slate-100'
					: 'border-slate-200 bg-white text-slate-900'
			}`}
		>
			<div class="mb-8">
				<p class="text-[11px] font-bold uppercase tracking-[0.4em]">
					<span class={isDark ? 'text-blue-400' : 'text-blue-600'}>
						DOLLAR
					</span>

					<span class={isDark ? 'text-white' : 'text-slate-900'}>
						VIEW
					</span>
				</p>

				<h1
					class={`mt-2 text-3xl font-bold leading-tight ${
						isDark ? 'text-white' : 'text-slate-900'
					}`}
				>
					Finance Tracker
				</h1>
			</div>

			<nav class="space-y-2">
					{#each navItems as item (item.href)}
						<a
							href={resolve(item.href)}
							class={`block rounded px-3 py-2 transition ${
								isActiveRoute(item.href)
									? 'bg-blue-600 text-white shadow-sm'
									: isDark
										? 'text-slate-300 hover:bg-slate-800'
										: 'text-slate-700 hover:bg-slate-100'
							}`}
						>
							{item.label}
						</a>
					{/each}
			</nav>

			<div
				class={`mt-8 border-t pt-6 ${
					isDark ? 'border-slate-800' : 'border-slate-200'
				}`}
			>
				<form method="POST" action="/logout">
					<button
						type="submit"
						class={`text-sm font-medium transition ${
							isDark
								? 'text-slate-300 hover:text-blue-400'
								: 'text-slate-700 hover:text-blue-600'
						}`}
					>
						Logout
					</button>
				</form>
			</div>
		</aside>

		<div
			class={`flex min-w-0 flex-1 flex-col transition-colors ${
				isDark ? 'bg-slate-950' : 'bg-white'
			}`}
		>
			<header
				class={`sticky top-0 z-30 border-b px-4 py-4 transition-colors sm:px-6 ${
					isDark
						? 'border-slate-800 bg-slate-900 text-slate-100'
						: 'border-slate-200 bg-white text-slate-900'
				}`}
			>
				<div class="flex items-center justify-between gap-4">
					<div class="min-h-[24px] min-w-0">
						{#if showWelcome}
							<p
								in:fade={{ duration: 300 }}
								out:fade={{ duration: 500 }}
								class={`truncate text-sm ${
									isDark ? 'text-slate-400' : 'text-slate-500'
								}`}
							>
								Welcome back,

								<span
									class={`font-semibold ${
										isDark ? 'text-white' : 'text-slate-900'
									}`}
								>
									{getFirstName()}
								</span>
							</p>
						{:else}
							<p
								in:fade={{ duration: 300 }}
								class="text-sm font-bold uppercase tracking-[0.3em]"
							>
								<span class={isDark ? 'text-blue-400' : 'text-blue-600'}>
									DOLLAR
								</span>

								<span class={isDark ? 'text-white' : 'text-slate-900'}>
									VIEW
								</span>
							</p>
						{/if}
					</div>

					<div class="flex shrink-0 items-center gap-3 sm:gap-4">
						<ThemeToggle
							isPremium={data.isPremium}
							{theme}
							onThemeChange={applyTheme}
						/>

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

								<p
									class={`text-sm font-semibold ${
										isDark ? 'text-white' : 'text-slate-900'
									}`}
								>
									{getFullName()}
								</p>
							</div>
						</div>
					</div>
				</div>
			</header>

			<main
				class={`min-h-0 flex-1 p-4 transition-colors sm:p-6 ${
					isDark
						? 'bg-slate-950 text-slate-100'
						: 'bg-white text-slate-900'
				}`}
			>
				{@render children()}
			</main>
		</div>
	</div>
</div>