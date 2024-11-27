<script lang="ts">
	import { format, Time } from './Time';

	let { data } = $props();
	let schedules = $derived(data.schedules);

	function overrides(now: Date) {
		const day = now.getDate();
		const month = now.getMonth();
		const schedule = (
			[
				['sem1Schedule', data.sem1Dates],
				['sem2Schedule', data.sem2Dates],
				['sem3Schedule', data.sem3Dates],
				['sem4Schedule', data.sem4Dates],
				['erSchedule', data.erDates]
			] satisfies [string, number[][]][]
		).find(([_, dates]) => dates.some(([m, d]) => m === month && d === day));

		if (schedule) return schedule[0];

		const daySchedule = data.week[now.getDay()];
		return !daySchedule ? 'regSchedule' : daySchedule;
	}
	let current_time = $state(new Date());
	setInterval(() => {
		current_time = new Date();
	});

	// svelte-ignore state_referenced_locally
	let displayedTypeOfDay = $state(overrides(current_time));
	let typeOfDay = $derived(
		overrides(current_time) === 'nil' ? overrides(current_time) : displayedTypeOfDay
	);
	let curSchedule = $derived(schedules.find(([prop]) => prop === typeOfDay)?.[1]);

	let times = $derived(
		(() => {
			const times = curSchedule?.flatMap(({ start, end, name }) => [
				{ time: start, name: `${name} starts` },
				{ time: end, name: `${name} ends` }
			]);
			const date = new Date(current_time);
			date.setDate(date.getDate() + 1);
			let i = 1;
			while (overrides(date) === 'nil') {
				date.setDate(date.getDate() + 1);
				i++;
			}
			const typeOfDay = overrides(date);
			times?.push(
				...(schedules
					.find(([prop]) => prop === typeOfDay)?.[1]
					?.flatMap(({ start, end, name }) => [
						{ time: new Time(start.hours + 24 * i, start.minutes), name: `${name} starts` },
						{ time: new Time(end.hours + 24 * i, end.minutes), name: `${name} starts` }
					]) as { time: Time; name: string }[])
			);
			return times;
		})()
	);
	let right = $derived(
		times?.find(({ time }) =>
			Time.greater(time, new Time(new Date().getHours(), new Date().getMinutes()))
		)
	);

	const m = new Intl.NumberFormat(undefined, { style: 'unit', unit: 'minute' });
	const H = new Intl.NumberFormat(undefined, { style: 'unit', unit: 'hour' });
	const fmt = new Intl.ListFormat();

	let duration = $derived(
		right
			? Time.subtract(right.time, new Time(current_time.getHours(), current_time.getMinutes()))
			: undefined
	);
</script>

<svelte:head>
	<title>Reagan HS Schedule</title>
	<meta name="description" content="view and check the schedule" />
</svelte:head>

<div class="h-screen w-full snap-y snap-mandatory overflow-scroll">
	<div class="flex h-full snap-center flex-col items-center justify-center bg-cyan-500">
		<span class="font-mono text-6xl md:text-9xl">{current_time.toLocaleTimeString()}</span>
		{#if right && duration}
			<span class="text-lg md:text-3xl"
				>{fmt.format([H.format(duration.hours), m.format(duration.minutes)])} until {right.name}</span
			>
		{/if}
	</div>
	<div
		class="h-full snap-center max-md:flex max-md:flex-col max-md:items-center max-md:justify-center md:grid md:grid-cols-2"
	>
		<div class="flex flex-col items-center justify-center">
			<span class="font-mono text-6xl">{current_time.toLocaleTimeString()}</span>
			{#if right && duration}
				<span class="md:text-xl"
					>{fmt.format([H.format(duration.hours), m.format(duration.minutes)])} until {right.name}</span
				>
			{/if}
		</div>
		<div class="flex flex-col items-center justify-center">
			<label class="contents">
				View:
				<select bind:value={displayedTypeOfDay}>
					{#each schedules as [prop]}
						<option value={prop}>{prop}</option>
					{/each}
				</select>
			</label>
			{#if curSchedule}
				<table class="prose">
					<tbody>
						{#each curSchedule as { name, start, end }}
							<tr>
								<td>{name}</td>
								<td>{format(start)}-{format(end)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</div>
</div>
