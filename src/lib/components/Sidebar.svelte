<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	const links = [
		{ href: '/dashboard', label: 'Overview' },
		{ href: '/dashboard/transactions', label: 'Transactions' },
		{ href: '/dashboard/categories', label: 'Categories' },
		{ href: '/dashboard/reports', label: 'Reports' },
		{ href: '/dashboard/alerts', label: 'Alerts' },
		{ href: '/dashboard/notifications', label: 'Notifications' }
	] as const;

	function isActiveRoute(href: string) {
		if (href === '/dashboard') {
			return page.url.pathname === '/dashboard';
		}

		return page.url.pathname.startsWith(href);
	}
</script>

<aside
	class="h-fit w-full rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm
	dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100
	md:sticky md:top-6 md:w-64"
>
	<div class="mb-8">
		<p class="text-[11px] font-bold uppercase tracking-[0.4em]">
			<span class="text-blue-600 dark:text-blue-400">DOLLAR</span>
			<span class="text-slate-900 dark:text-white">VIEW</span>
		</p>

		<h2 class="mt-2 text-2xl font-extrabold leading-[1.05] text-slate-900 dark:text-white">
			Finance<br />
			Tracker
		</h2>

		<p class="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
			Track spending, revenue, and reports in one dashboard.
		</p>
	</div>

	<nav class="space-y-2">
		{#each links as link (link.href)}
			<a
				href={resolve(link.href)}
				class={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${
					isActiveRoute(link.href)
						? 'bg-blue-600 text-white shadow-sm'
						: 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
				}`}
			>
				{link.label}
			</a>
		{/each}
	</nav>

	<div class="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
		<a
			href={resolve('/logout')}
			class="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium
			text-slate-700 transition hover:bg-slate-100
			dark:text-slate-300 dark:hover:bg-slate-800"
		>
			Logout
		</a>
	</div>
</aside>