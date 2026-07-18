<script lang="ts">
	import { onMount } from 'svelte';
	import { Sun, Moon } from 'lucide-svelte';

	let {
		isPremium = false
	}: {
		isPremium?: boolean;
	} = $props();

	let theme = $state<'light' | 'dark'>('light');

	function setTheme(nextTheme: 'light' | 'dark') {
		theme = nextTheme;

		if (typeof document === 'undefined') return;

		document.documentElement.classList.toggle('dark', nextTheme === 'dark');
		localStorage.setItem('dv-theme', nextTheme);
	}

	onMount(() => {
		const savedTheme = localStorage.getItem('dv-theme');

		if (savedTheme === 'dark' || savedTheme === 'light') {
			setTheme(savedTheme);
			return;
		}

		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		setTheme(prefersDark ? 'dark' : 'light');
	});
</script>

{#if isPremium}
	<div class="flex items-center gap-2">
		<button
			type="button"
			aria-label="Use light mode"
			aria-pressed={theme === 'light'}
			onclick={() => setTheme('light')}
			class={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
				theme === 'light'
					? 'border-blue-600 bg-blue-600 text-white'
					: 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
			}`}
		>
			<Sun size={16} />
			<span>Light</span>
		</button>

		<button
			type="button"
			aria-label="Use dark mode"
			aria-pressed={theme === 'dark'}
			onclick={() => setTheme('dark')}
			class={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
				theme === 'dark'
					? 'border-blue-600 bg-blue-600 text-white'
					: 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
			}`}
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