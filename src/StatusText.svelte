<script module lang="ts">
	let secretMessage: string | undefined = $state();
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { messageChance, secretMessages } from './notSecret';
	import { Time } from './utils';

	let { right, current_time }: { right: { time: Time; name: string }; current_time: Date } =
		$props();
	const m = new Intl.NumberFormat(undefined, { style: 'unit', unit: 'minute' });
	const H = new Intl.NumberFormat(undefined, { style: 'unit', unit: 'hour' });
	const fmt = new Intl.ListFormat();
	let duration = $derived(
		Time.subtract(right.time, new Time(current_time.getHours(), current_time.getMinutes()))
	);

	onMount(() => {
		if (!secretMessage && Math.random() < messageChance) {
			secretMessage = secretMessages[Math.floor(Math.random() * secretMessages.length)];
			setTimeout(() => {
				secretMessage = undefined;
			}, 1000);
		}
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
