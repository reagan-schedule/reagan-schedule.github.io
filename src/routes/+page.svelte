<script lang="ts">
	import Status from '../Status.svelte';
	import { format, Time } from '../Time';

	let { data } = $props();
	let schedules = $derived(data.schedules);

	function overrides(current_time: Date) {
		const day = current_time.getDate();
		const month = current_time.getMonth();
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

		const daySchedule = data.week[current_time.getDay()];
		return !daySchedule ? 'regSchedule' : daySchedule;
	}
	let current_time = $state(new Date());
	setInterval(() => {
		current_time = new Date();
	});
	let localization = new Map([
		['regSchedule', 'Regular Schedule'],
		['strikeSchedule', 'STRIKE Schedule'],
		['erSchedule', 'Early Release'],
		['sem1Schedule', 'Finals Day 1'],
		['sem2Schedule', 'Finals Day 2'],
		['sem3Schedule', 'Finals Day 3'],
		['sem4Schedule', 'Finals Day 4']
	]);

	// svelte-ignore state_referenced_locally
	let displayedTypeOfDay = $state(!localization.has(overrides(current_time)) ? 'regSchedule' : overrides(current_time));
	// hidden ones (nil for weekends) have precedence
	let typeOfDay = $derived(!localization.has(overrides(current_time)) ?overrides(current_time) : displayedTypeOfDay);
	let curSchedule = $derived(schedules.get(typeOfDay));
	let displayedSchedule = $derived(schedules.get(displayedTypeOfDay));

	let times = $derived(
		(() => {
			const times = curSchedule?.flatMap(({ start, end, name }) => [
				{ time: start, name: `${name} starts` },
				{ time: end, name: `${name} ends` }
			]);
			const next = new Date(current_time);
			let i = 0;
			do {
				next.setDate(next.getDate() + 1);
				i++;
			} while (overrides(next) === 'nil');
			const typeOfDay = overrides(next);
			times?.push(
				...(schedules.get(typeOfDay)?.flatMap(({ start, end, name }) => [
					{ time: new Time(start.hours + 24 * i, start.minutes), name: `${name} starts` },
					{ time: new Time(end.hours + 24 * i, end.minutes), name: `${name} ends` }
				]) as { time: Time; name: string }[])
			);
			return times;
		})()
	);
	let right = $derived(
		times?.find(({ time }) =>
			Time.greater(time, new Time(current_time.getHours(), current_time.getMinutes()))
		)
	);
	const fmt = new Intl.DateTimeFormat(undefined, { timeStyle: 'medium' });
</script>

<svelte:head>
	<title>Reagan HS Schedule</title>
	<meta name="description" content="view and check the schedule for Reagan HS" />
</svelte:head>

<div class="h-screen w-full snap-y snap-mandatory overflow-scroll">
	<div class="flex h-full snap-center flex-col items-center justify-center bg-cyan-500">
		<span class="font-mono text-6xl md:text-9xl">{current_time.toLocaleTimeString()}</span>
		{#if right}
			<span class="text-lg md:text-3xl"><Status {right} {current_time} /></span>
		{/if}
	</div>
	<div
		class="h-full snap-center max-md:flex max-md:flex-col max-md:items-center max-md:justify-center md:grid md:grid-cols-2"
	>
		<div class="flex flex-col items-center justify-center">
			<span class="font-mono text-6xl">{fmt.format(current_time)}</span>
			{#if right}
				<span class="md:text-xl"><Status {right} {current_time} /></span>
			{/if}
		</div>
		<div class="flex flex-col items-center justify-center">
			<label class="contents">
				<select class="p-2 my-2" bind:value={displayedTypeOfDay}>
					{#each schedules as [prop]}
						{#if localization.has(prop)}
							<option value={prop}>{localization.get(prop)}</option>
						{/if}
					{/each}
				</select>
			</label>
			{#if displayedSchedule}
				<table class="prose">
					<tbody>
						{#each displayedSchedule as { name, start, end }}
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
