<script lang="ts">
	import { page } from '$app/state';

	const links = [
		{ href: '/dashboard', label: 'Overview' },
		{ href: '/dashboard/transactions', label: 'Transactions' },
		{ href: '/dashboard/categories', label: 'Categories' },
		{ href: '/dashboard/reports', label: 'Reports' }
	];
</script>

<aside class="card h-fit w-full p-4 md:sticky md:top-6 md:w-64">
	<div class="mb-6">
		<p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">DollarView</p>
		<h2 class="mt-2 text-xl font-bold text-slate-900">Finance Tracker</h2>
	</div>

	<nav class="space-y-2">
		{#each links as link}
			<a
				href={link.href}
				class={`block rounded-xl px-3 py-2 text-sm font-medium ${
					page.url.pathname === link.href
						? 'bg-sky-600 text-white'
						: 'text-slate-700 hover:bg-slate-100'
				}`}
			>
				{link.label}
			</a>
		{/each}
	</nav>

	<div class="mt-6 border-t border-slate-200 pt-4">
		<a href="/logout" class="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
			Logout
		</a>
	</div>
</aside>