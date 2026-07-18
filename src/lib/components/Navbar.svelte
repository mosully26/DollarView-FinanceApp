<script>
	import { resolve } from '$app/paths';
</script>

<nav
	class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 text-slate-900 backdrop-blur-md transition-colors
	dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-100"
>
	<div class="mx-auto grid max-w-7xl grid-cols-3 items-center px-6 py-4">
		<!-- Left navigation -->
		<div class="flex items-center gap-8 text-sm font-medium">
			<a
				href={resolve('/features')}
				class="nav-link text-slate-600 dark:text-slate-300"
			>
				Features
			</a>

			<a
				href={resolve('/pricing')}
				class="nav-link text-slate-600 dark:text-slate-300"
			>
				Pricing
			</a>
		</div>

		<!-- Center logo -->
		<div class="flex justify-center">
			<a href={resolve('/')} class="text-lg font-bold tracking-[0.25em]">
				<span class="text-blue-600 dark:text-blue-400">DOLLAR</span>
				<span class="text-slate-900 dark:text-white">VIEW</span>
			</a>
		</div>

		<!-- Right actions -->
		<div class="flex items-center justify-end gap-3">
			<a
				href={resolve('/login')}
				class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition
				hover:border-slate-400 hover:bg-slate-100
				dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200
				dark:hover:border-slate-600 dark:hover:bg-slate-800"
			>
				Login
			</a>

			<a
				href={resolve('/signup')}
				class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
			>
				Get Started
			</a>
		</div>
	</div>
</nav>

<style>
	.nav-link {
		position: relative;
		transition: color 0.2s ease;
	}

	.nav-link:hover {
		color: rgb(37 99 235);
	}

	:global(html.dark) .nav-link:hover {
		color: rgb(96 165 250);
	}

	.nav-link::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -4px;
		width: 0;
		height: 2px;
		background: rgb(37 99 235);
		transition: width 0.25s ease;
	}

	:global(html.dark) .nav-link::after {
		background: rgb(96 165 250);
	}

	.nav-link:hover::after {
		width: 100%;
	}
</style>