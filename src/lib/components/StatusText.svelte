<script lang="ts">
	interface StatusTextProps {
		future: number;
		present: number;
		event: string;
	}

	let { future, event, present }: StatusTextProps = $props();
	const m = new Intl.NumberFormat(undefined, { style: 'unit', unit: 'minute' });
	const H = new Intl.NumberFormat(undefined, { style: 'unit', unit: 'hour' });
	const fmt = new Intl.ListFormat(undefined);
	let _date = new Date();
	let duration = $derived((_date.setTime(future - present), _date));
</script>

{fmt.format(
	duration.getUTCHours() > 0
		? [H.format(duration.getUTCHours()), m.format(duration.getUTCMinutes())]
		: [m.format(duration.getUTCMinutes())]
)} until {event}
