<script lang="ts">
	import { page } from '$app/state';

	const links = [
		{ href: '/dashboard', label: 'Overview' },
		{ href: '/dashboard/transactions', label: 'Transactions' },
		{ href: '/dashboard/categories', label: 'Categories' },
		{ href: '/dashboard/reports', label: 'Reports' },
		{ href: '/dashboard/alerts', label: 'Alerts' },
		{ href: '/dashboard/notifications', label: 'Notifications' }
	];
</script>

<aside class="card h-fit w-full p-5 md:sticky md:top-6 md:w-64">
	<div class="mb-8">
		<p class="text-[11px] font-bold uppercase tracking-[0.4em]">
			<span class="text-blue-600">DOLLAR</span><span class="text-slate-900">VIEW</span>
		</p>

		<h2 class="mt-2 text-2xl font-extrabold leading-[1.05] text-slate-900">
			Finance<br />
			Tracker
		</h2>

		<p class="mt-3 text-sm leading-6 text-slate-500">
			Track spending, revenue, and reports in one dashboard.
		</p>
	</div>

	<nav class="space-y-2">
		{#each links as link}
			<a
				href={link.href}
				class={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${
					page.url.pathname === link.href
						? 'bg-blue-600 text-white shadow-sm'
						: 'text-slate-700 hover:bg-slate-100'
				}`}
			>
				{link.label}
			</a>
		{/each}
	</nav>

	<div class="mt-6 border-t border-slate-200 pt-4">
		<a
			href="/logout"
			class="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
		>
			Logout
		</a>
	</div>
</aside>