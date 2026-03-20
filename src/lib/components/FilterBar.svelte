<script lang="ts">
	import type { Period } from '$lib/types';

	let { basePath, period = '6' }: { basePath: string; period?: Period } = $props();

	const options: { label: string; value: Period }[] = [
		{ label: '1 Month', value: '1' },
        { label: '3 Months', value: '3' },
		{ label: '6 Months', value: '6' },
        { label: '9 Months', value: '9' },
		{ label: '12 Months', value: '12' },
		{ label: '24 Months', value: '24' },
		{ label: '36 Months', value: '36' },
        { label: '48 Months', value: '48' },
        { label: '60 Months', value: '60' },
        { label: '72 Months', value: '72' },
		{ label: 'All', value: 'all' }
	];
</script>

<div class="card flex flex-wrap gap-2 p-3">
	{#each options as option}
		<a
			href={`${basePath}?period=${option.value}`}
			class={`rounded-xl px-3 py-2 text-sm font-medium ${
				period === option.value
					? 'bg-sky-600 text-white'
					: 'bg-slate-50 text-slate-700 hover:bg-slate-100'
			}`}
		>
			{option.label}
		</a>
	{/each}
</div>