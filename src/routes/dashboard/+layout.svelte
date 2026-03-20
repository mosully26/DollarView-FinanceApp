<script lang="ts">
    import Sidebar from '$lib/components/Sidebar.svelte';
	import type { LayoutData } from './$types';
	import SidebarComponent from '$lib/components/Sidebar.svelte';

	let { children }: { children: () => any } = $props();
</script>

<div class="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 md:flex-row">
	<SidebarComponent />
	<div class="min-w-0 flex-1">
		{@render children()}
	</div>
</div>