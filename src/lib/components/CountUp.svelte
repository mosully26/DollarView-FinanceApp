<script lang="ts">
	import { onMount } from 'svelte';

	let { value, duration = 2.5 }: { value: number; duration?: number } = $props();

	let el: HTMLSpanElement;

	onMount(async () => {
		const { CountUp: CountUpJs } = await import('countup.js');

		const counter = new CountUpJs(el, value, {
			duration,
			separator: ','
		});

		if (!counter.error) {
			counter.start();
		} else {
			el.textContent = value.toLocaleString();
		}
	});
</script>

<span bind:this={el}>{value.toLocaleString()}</span>