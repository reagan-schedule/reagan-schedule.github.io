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
</script>

{fmt.format([H.format(duration.hours), m.format(duration.minutes)])} until {right.name}
