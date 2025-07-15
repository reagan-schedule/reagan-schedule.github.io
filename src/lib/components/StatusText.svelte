<script lang="ts">
	import { IntlContext } from '$lib/display';
	import { Temporal } from '@js-temporal/polyfill';
	import { getContext } from 'svelte';

	let {
		soon,
		now,
		class: className = '',
	}: {
		now: Temporal.ZonedDateTime;
		soon?: { kind: string; name: string; at: Temporal.ZonedDateTime };
		class?: string;
	} = $props();
	
	let intl = getContext<IntlContext>('intl');
</script>

<div class={className}>
	{#if soon}
		{@const duration = now.until(soon.at, {
			roundingMode: 'ceil',
			largestUnit: 'day',
			smallestUnit: 'minute',
		})}
		{intl.asList(
			duration.days && intl.unit('day').format(duration.days),
			duration.hours && intl.unit('hour').format(duration.hours),
			intl.unit('minute').format(duration.minutes)
		)} until {soon.kind} of {soon.name}
	{:else}
		Oops! This is awkward...
	{/if}
</div>
