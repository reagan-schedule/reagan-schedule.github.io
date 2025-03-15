<script lang="ts">
	import { Time } from './utils';

	let { future, event, present }: { future: Time; event: string; present: Date } = $props();
	const m = new Intl.NumberFormat(undefined, { style: 'unit', unit: 'minute' });
	const H = new Intl.NumberFormat(undefined, { style: 'unit', unit: 'hour' });
	const fmt = new Intl.ListFormat(undefined);
	let duration = $derived(Time.subtract(future, Time.fromDate(present)));
</script>

{fmt.format(
	duration.hours > 0
		? [H.format(duration.hours), m.format(duration.minutes)]
		: [m.format(duration.minutes)]
)} until {event}
