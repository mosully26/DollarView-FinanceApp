<script lang="ts">
	import { onMount } from 'svelte';
	import { CountUp as CountUpJs } from 'countup.js';

	let { value, duration = 2.5 }: { value: number; duration?: number } = $props();

	let el: HTMLSpanElement;

	onMount(() => {
		const counter = new CountUpJs(el, value, {
			duration,
			separator: ','
		});

		if (!counter.error) {
			counter.start();
		}
	});
</script>

<span bind:this={el}></span>