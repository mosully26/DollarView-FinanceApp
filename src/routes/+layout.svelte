<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();
</script>

<svelte:head>
	<title>DollarView</title>
	<meta
		name="description"
		content="Bright, professional financial tracking for individuals and businesses."
	/>
</svelte:head>

{@render children()}