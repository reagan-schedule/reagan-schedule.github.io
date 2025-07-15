<script lang="ts">
	import { IntlContext } from '$lib/display';
	import { Temporal } from '@js-temporal/polyfill';
	import { getContext } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import Digit from './Digit.svelte';

	let intl = getContext<IntlContext>('intl');
	let {
		now,
		class: className = '',
	}: { class?: string; now: Temporal.ZonedDateTime } = $props();
	let time = $derived(intl.withSeconds(now));
</script>

<div class={twMerge('flex', className)}>
	<Digit digit={time[0].value[0]} />
	{#if time[0].value.length === 2}
		<Digit digit={time[0].value[1]} />
	{/if}
	<span class="self-center">:</span>
	<Digit digit={time[2].value[0]} />
	<Digit digit={time[2].value[1]} />
	<span class="self-center">:</span>
	<Digit digit={time[4].value[0]} />
	<Digit digit={time[4].value[1]} />
	<span class="self-end">{time[6].value}</span>
</div>
