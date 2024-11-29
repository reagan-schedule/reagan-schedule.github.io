<script lang="ts">
	import StatusText from '../StatusText.svelte';
	import {
		Time,
		format,
		matchDate,
		toFlatTimeArray,
		upperBound,
		type MonthDay,
		type MonthDayYear
	} from '../utils';
	import { messageChance, secretMessages } from './notSecret';

	let { data } = $props();
	let { schedules, dates } = data;
	type ScheduleName = keyof typeof schedules;

	function getSchedule(current_time: Date) {
		const schedule = (
			[
				['sem1Schedule', dates.sem1Dates],
				['sem2Schedule', dates.sem2Dates],
				['sem3Schedule', dates.sem3Dates],
				['sem4Schedule', dates.sem4Dates],
				['erSchedule', dates.erDates]
			] as [ScheduleName, Array<MonthDay | MonthDayYear>][]
		).find(([_, dates]) =>
			dates.some(
				matchDate([current_time.getMonth(), current_time.getDate(), current_time.getFullYear()])
			)
		)?.[0];

		if (schedule) return schedule;

		const daySchedule = data.scheduleByWeek[current_time.getDay()];
		return daySchedule || 'regSchedule';
	}
	let current_time = $state.raw(new Date());
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
		localization.has(getSchedule(current_time)) ? getSchedule(current_time) : 'regSchedule'
	);
	// hidden ones (nil for weekends) have precedence
	let typeOfDay = $derived(
		localization.has(getSchedule(current_time)) ? displayedTypeOfDay : getSchedule(current_time)
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
			} while (schedules[getSchedule(next)].length === 0);
			const scheduleNext = schedules[getSchedule(next)];
			times.push(...toFlatTimeArray(scheduleNext, { hours: 24 * i }));
			return times;
		})()
	);
	let right = $derived(upperBound(times, Time.fromDate(current_time)));
	const fmt = new Intl.DateTimeFormat(undefined, { timeStyle: 'medium' });

	let secretMessage: string | undefined = $state();

	$effect(() => {
		if (Math.random() < messageChance) {
			secretMessage = secretMessages[Math.floor(Math.random() * secretMessages.length)];
			setTimeout(() => {
				secretMessage = undefined;
			}, 1000);
		}
	});

	let formatted = $derived(fmt.format(current_time));
</script>

<svelte:head>
	<title>Reagan HS Schedule</title>
	<meta name="description" content="view and check the schedule for Reagan HS" />
</svelte:head>

<div class="h-full w-full snap-y snap-mandatory overflow-scroll text-slate-950">
	<div class="flex h-full snap-center flex-col items-center justify-center bg-cyan-400">
		<span class="font-mono text-6xl md:text-9xl">{formatted}</span>
		{#if right}
			<span class="mt-3 text-lg md:text-3xl">
				<StatusText {right} {current_time} {secretMessage} />
			</span>
		{/if}
	</div>
	<div
		class="h-full snap-center max-md:flex max-md:flex-col max-md:items-center max-md:justify-center max-md:gap-4 md:grid md:grid-cols-2"
	>
		<div class="flex flex-col items-center justify-center">
			<span class="font-mono text-6xl">{formatted}</span>
			{#if right}
				<span class="mt-2 md:text-xl">
					<StatusText {right} {current_time} {secretMessage} />
				</span>
			{/if}
		</div>
		<div class="flex flex-col items-center justify-center">
			<label
				class="relative after:absolute after:right-2 after:top-1/2 after:-translate-y-1/2 after:rounded-full after:border-x-4 after:border-t-4 after:border-slate-800 after:border-x-transparent after:content-['']"
			>
				<span class="sr-only">View</span>
				<select
					class="appearance-none rounded-full border border-slate-200 bg-slate-100 px-6 text-center [text-align-last:_center]"
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
				<table class="prose prose-slate mt-2 prose-td:text-center">
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
