<script lang="ts">
	import { Sun, Moon } from 'lucide-svelte';

	let {
		isPremium = false
	}: {
		isPremium?: boolean;
	} = $props();

	let theme = $state<'light' | 'dark'>('light');

	function applyTheme(nextTheme: 'light' | 'dark') {
		theme = nextTheme;

		if (typeof document !== 'undefined') {
			document.documentElement.classList.toggle('dark', nextTheme === 'dark');
			localStorage.setItem('dv-theme', nextTheme);
		}
	}

	function forceLightTheme() {
		theme = 'light';

		if (typeof document !== 'undefined') {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('dv-theme', 'light');
		}
	}

	$effect(() => {
		if (typeof window === 'undefined') return;

		if (!isPremium) {
			forceLightTheme();
			return;
		}

		const savedTheme = localStorage.getItem('dv-theme') as 'light' | 'dark' | null;
		const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		const initialTheme = savedTheme ?? (preferredDark ? 'dark' : 'light');
		applyTheme(initialTheme);
	});
</script>

{#if isPremium}
	<div class="flex items-center gap-2">
		<button
			type="button"
			class={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
				theme === 'light'
					? 'border-blue-600 bg-blue-600 text-white'
					: 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
			}`}
			onclick={() => applyTheme('light')}
		>
			<Sun size={16} />
			<span>Light</span>
		</button>

		<button
			type="button"
			class={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
				theme === 'dark'
					? 'border-blue-600 bg-blue-600 text-white'
					: 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
			}`}
			onclick={() => applyTheme('dark')}
		>
			<Moon size={16} />
			<span>Dark</span>
		</button>
	</div>
{:else}
	<a
		href="/pricing"
		class="inline-flex items-center rounded-xl border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
	>
		Premium theme toggle
	</a>
{/if}