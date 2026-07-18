<script lang="ts">
	// Import individual icon components to avoid TypeScript module definition issues
	import Sun from 'lucide-svelte/icons/sun.svelte';
	import Moon from 'lucide-svelte/icons/moon.svelte';
	import { resolve } from '$app/navigation';

	let {
		isPremium = false,
		theme = 'light',
		onThemeChange
	}: {
		isPremium?: boolean;
		theme?: 'light' | 'dark';
		onThemeChange: (theme: 'light' | 'dark') => void;
	} = $props();
</script>

{#if isPremium}
	<div class="flex items-center gap-2">
		<button
			type="button"
			aria-label="Use light mode"
			aria-pressed={theme === 'light'}
			on:click={() => onThemeChange('light')}
			class={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
				theme === 'light'
					? 'border-blue-600 bg-blue-600 text-white'
					: 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
			}`}
		>
			<Sun size={16} />
			<span>Light</span>
		</button>

		<button
			type="button"
			aria-label="Use dark mode"
			aria-pressed={theme === 'dark'}
			on:click={() => onThemeChange('dark')}
			class={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
				theme === 'dark'
					? 'border-blue-600 bg-blue-600 text-white'
					: 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
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