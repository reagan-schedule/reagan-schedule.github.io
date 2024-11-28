<script lang="ts">
	import { Time } from './utils';

	let { right, current_time }: { right: { time: Time; name: string }; current_time: Date } =
		$props();
	const m = new Intl.NumberFormat(undefined, { style: 'unit', unit: 'minute' });
	const H = new Intl.NumberFormat(undefined, { style: 'unit', unit: 'hour' });
	const fmt = new Intl.ListFormat();
	let duration = $derived(
		Time.subtract(right.time, new Time(current_time.getHours(), current_time.getMinutes()))
	);

	let chance = 1 / 1000;
	let secretMessage = $state();
	let secretMessages = ['William loves Elana', 'Optimized sub-optimal code', 'Marry me Chloe'];
	$effect(() => {
		if (Math.random() < chance)
			secretMessage = secretMessages[Math.floor(Math.random() * secretMessages.length)];
		const id = setTimeout(() => {
			secretMessage = undefined;
		}, 1000);
		return () => {
			clearTimeout(id);
		};
	});
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
