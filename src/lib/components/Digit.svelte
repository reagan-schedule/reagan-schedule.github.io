<script lang="ts">
	import { label } from '$lib/digit';

	let { digit }: { digit: string } = $props();
	let bits = $derived(label(digit));
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="-1 -1 12 20"
	stroke="#FFF"
	stroke-width=".25"
	class="inline-block h-full"
>
	{#if bits & 1}
		<polygon id="a" points="1, 1  2, 0  8, 0  9, 1  8, 2  2, 2" />
	{/if}
	{#if bits & (1 << 1)}
		<polygon id="b" points="9, 1 10, 2 10, 8  9, 9  8, 8  8, 2" />
	{/if}
	{#if bits & (1 << 2)}
		<polygon id="c" points="9, 9 10,10 10,16  9,17  8,16  8,10" />
	{/if}
	{#if bits & (1 << 3)}
		<polygon id="d" points="9,17  8,18  2,18  1,17  2,16  8,16" />
	{/if}
	{#if bits & (1 << 4)}
		<polygon id="e" points="1,17  0,16  0,10  1, 9  2,10  2,16" />
	{/if}
	{#if bits & (1 << 5)}
		<polygon id="f" points="1, 9  0, 8  0, 2  1, 1  2, 2  2, 8" />
	{/if}
	{#if bits & (1 << 6)}
		<polygon id="g" points="1, 9  2, 8  8, 8  9, 9  8,10  2,10" />
	{/if}
</svg>
