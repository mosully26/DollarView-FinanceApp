<nav class="sticky top-0 z-50 border-b border-slate-200 bg-white/70 backdrop-blur-md">
	<div class="mx-auto grid max-w-7xl grid-cols-3 items-center px-6 py-4">

		<!-- LEFT: NAV LINKS -->
		<div class="flex items-center gap-8 text-sm font-medium text-slate-600">
			<a href="/features" class="nav-link">
				Features
			</a>

			<a href="/pricing" class="nav-link">
				Pricing
			</a>
		</div>

		<!-- CENTER: LOGO -->
		<div class="flex justify-center">
			<a href="/" class="text-lg font-bold tracking-[0.25em]">
				<span class="text-blue-600">DOLLAR</span>
				<span class="text-slate-900">VIEW</span>
			</a>
		</div>

		<!-- RIGHT: ACTION -->
		<div class="flex items-center justify-end gap-3">
			<a
				href="/login"
				class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium transition hover:border-slate-400 hover:bg-slate-100"
			>
				Login
			</a>

			<a
				href="/signup"
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

	.nav-link::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -4px;
		width: 0%;
		height: 2px;
		background: rgb(37 99 235);
		transition: width 0.25s ease;
	}

	.nav-link:hover::after {
		width: 100%;
	}
</style>