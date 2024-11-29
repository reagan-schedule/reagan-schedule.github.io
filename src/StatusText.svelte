<script lang="ts">
	import { Time } from './utils';

	let {
		right,
		current_time,
		secretMessage
	}: { right: { time: Time; name: string }; current_time: Date; secretMessage?: string } = $props();
	const m = new Intl.NumberFormat(undefined, { style: 'unit', unit: 'minute' });
	const H = new Intl.NumberFormat(undefined, { style: 'unit', unit: 'hour' });
	const fmt = new Intl.ListFormat();
	let duration = $derived(
		Time.subtract(right.time, new Time(current_time.getHours(), current_time.getMinutes()))
	);
</script>

{#if secretMessage}
	{secretMessage}
{:else}
	{fmt.format(
		duration.hours > 0
			? [H.format(duration.hours), m.format(duration.minutes)]
			: [m.format(duration.minutes)]
	)} until {right.name}
{/if}
