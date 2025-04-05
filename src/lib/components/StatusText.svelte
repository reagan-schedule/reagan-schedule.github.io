<script lang="ts">
	import type { future } from '$lib/utils';
	import type { Temporal } from '@js-temporal/polyfill';

	let {
		then,
		now,
		class: className = ''
	}: {
		then: ReturnType<typeof future>;
		now: Temporal.Instant;
		class?: string;
	} = $props();
	let list = new Intl.ListFormat();
	let hour = new Intl.NumberFormat(undefined, { style: 'unit', unit: 'hour' });
	let minute = new Intl.NumberFormat(undefined, { style: 'unit', unit: 'minute' });
</script>

<span class={className}>
	{#if then.when}
		{@const duration = now.until(then.when, {
			roundingMode: 'ceil',
			largestUnit: 'hour',
			smallestUnit: 'minute'
		})}
		{@const parts = [
			duration.hours && hour.format(duration.hours),
			minute.format(duration.minutes)
		].filter((x) => x !== 0)}
		{list.format(parts)} until {then.what[1]} of {then.what[0].name}
	{:else}
		Oops! This shouldn't happen.
	{/if}
</span>
