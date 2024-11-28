<script lang="ts">
	import StatusText from '../StatusText.svelte';
	import {
		Time,
		format,
		matchDate,
		toFlatTimeArray,
		upperBound,
		type DailyEvent,
		type SpecialDate
	} from '../utils';

	let {
		data
	}: {
		data: {
			dates: {
				[x: string]: SpecialDate[];
			};
			schedules: {
				[x: string]: DailyEvent[];
			};
			scheduleByWeek: string[];
		};
	} = $props();
	let { schedules, dates } = data;

	function getSchedule(current_time: Date) {
		const schedule = (
			[
				['sem1Schedule', dates.sem1Dates],
				['sem2Schedule', dates.sem2Dates],
				['sem3Schedule', dates.sem3Dates],
				['sem4Schedule', dates.sem4Dates],
				['erSchedule', dates.erDates]
			] satisfies [string, SpecialDate[]][]
		).find(([_, dates]) => dates.some((date) => matchDate(current_time, date)));

		if (schedule) return schedule[0];

		const daySchedule = data.scheduleByWeek[current_time.getDay()];
		return daySchedule || 'regSchedule';
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
	let displayedTypeOfDay = $state(
		!localization.has(getSchedule(current_time)) ? 'regSchedule' : getSchedule(current_time)
	);
	// hidden ones (nil for weekends) have precedence
	let typeOfDay = $derived(
		!localization.has(getSchedule(current_time)) ? getSchedule(current_time) : displayedTypeOfDay
	);
	let curSchedule = $derived(schedules[typeOfDay]);
	let displayedSchedule = $derived(schedules[displayedTypeOfDay]);

	let times = $derived(
		(() => {
			const times = toFlatTimeArray(curSchedule);
			const next = new Date(current_time);
			let i = 0;
			do {
				next.setDate(next.getDate() + 1);
				i++;
			} while (getSchedule(next) === 'nil');
			const scheduleNext = schedules[getSchedule(next)];
			times.push(...toFlatTimeArray(scheduleNext, { hours: 24 * i }));
			return times;
		})()
	);
	let right = $derived(upperBound(times, Time.fromDate(current_time)));
	const fmt = new Intl.DateTimeFormat(undefined, { timeStyle: 'medium' });
</script>

<svelte:head>
	<title>Reagan HS Schedule</title>
	<meta name="description" content="view and check the schedule for Reagan HS" />
</svelte:head>

<div class="h-full w-full snap-y snap-mandatory overflow-scroll">
	<div class="flex h-full snap-center flex-col items-center justify-center bg-cyan-500">
		<span class="font-mono text-6xl md:text-9xl">{fmt.format(current_time)}</span>
		{#if right}
			<span class="mt-3 text-lg md:text-3xl">
				<StatusText {right} {current_time} />
			</span>
		{/if}
	</div>
	<div
		class="h-full snap-center max-md:flex max-md:flex-col max-md:items-center max-md:justify-center md:grid md:grid-cols-2"
	>
		<div class="flex flex-col items-center justify-center">
			<span class="font-mono text-6xl">{fmt.format(current_time)}</span>
			{#if right}
				<span class="mt-2 md:text-xl">
					<StatusText {right} {current_time} />
				</span>
			{/if}
		</div>
		<div class="flex flex-col items-center justify-center">
			<label class="contents">
				<span>View:</span>
				<select
					class="mt-2 appearance-none rounded-full border-2 border-slate-200 bg-slate-100 px-8 py-2 text-center [text-align-last:_center]"
					bind:value={displayedTypeOfDay}
				>
					{#each Object.keys(schedules) as prop}
						{#if localization.has(prop)}
							<option value={prop}>{localization.get(prop)}</option>
						{/if}
					{/each}
				</select>
			</label>
			{#if displayedSchedule}
				<table class="prose mt-2 prose-td:text-center">
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
