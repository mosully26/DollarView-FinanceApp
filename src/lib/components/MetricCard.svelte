<script lang="ts">
	let {
		label,
		value,
		tone = 'neutral'
	}: {
		label: string;
		value: string;
		tone?: 'neutral' | 'good' | 'bad';
	} = $props();

	const toneClass = $derived(
		tone === 'good'
			? 'text-emerald-600'
			: tone === 'bad'
				? 'text-rose-600'
				: 'text-slate-900 dark:text-white'
	);
</script>

<div class="card p-5">
	<p class="text-sm text-slate-500 dark:text-slate-400">{label}</p>
	<p class={`mt-2 text-2xl font-bold ${toneClass}`}>{value}</p>
</div>