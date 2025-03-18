<script lang="ts">
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { untrack } from 'svelte';
	import StatusText from '../StatusText.svelte';
	import { Time, formatAsClock, getSchedule, flatEvents } from '../utils';
	import { setSecretMessage } from '../secret';

	let { data } = $props();
	let { schedules, dates } = data;
	type ScheduleKey = keyof typeof schedules;

	// do you know what Svelte* classes do? they make it so the set* functions update the state
	// i think that makes the cpu save useless because we have to init instances of Date anyways

	let curTime = $state(Date.now());
	const fmt = new Intl.DateTimeFormat(undefined, { timeStyle: 'medium' });
	setInterval(() => {
		curTime = Date.now();
	});

	// create a global singleton Date
	let _theDate = new Date();
	function Date_getThis(theTime: number) {
		_theDate.setTime(theTime);
		return _theDate;
	}

	let fallback: ScheduleKey = 'regSchedule';
	function keyFor(when: Date) {
		return getSchedule<ScheduleKey>(
			when,
			[
				['sem1Schedule', dates.sem1Dates],
				['sem2Schedule', dates.sem2Dates],
				['sem3Schedule', dates.sem3Dates],
				['sem4Schedule', dates.sem4Dates],
				['erSchedule', dates.erDates]
			],
			data.scheduleByWeek
		);
	}
	let localization: Partial<Record<ScheduleKey, string>> = {
		regSchedule: 'Regular Schedule',
		strikeSchedule: 'STRIKE Schedule',
		erSchedule: 'Early Release',
		sem1Schedule: 'Finals Day 1',
		sem2Schedule: 'Finals Day 2',
		sem3Schedule: 'Finals Day 3',
		sem4Schedule: 'Finals Day 4'
	};
	let pickableKeys: readonly ScheduleKey[] = [
		'regSchedule',
		'strikeSchedule',
		'erSchedule',
		'sem1Schedule',
		'sem2Schedule',
		'sem3Schedule',
		'sem4Schedule'
	];

	// svelte-ignore state_referenced_locally
	let scheduleKeyAtLoadTime = keyFor(Date_getThis(curTime));
	let pickedKey = $state(localization[scheduleKeyAtLoadTime] ? scheduleKeyAtLoadTime : fallback);
	let displayedSchedule = $derived(schedules[pickedKey]);

	let future = $derived.by(() => {
		for (
			let future = Date_getThis(curTime), daysIntoFuture = 0;
			daysIntoFuture < 1000;
			future.setDate(future.getDate() + 1), daysIntoFuture++
		) {
			let events = schedules[keyFor(future)];
			for (let event of flatEvents(events, daysIntoFuture)) {
				if (Time.greater(event.time, Time.fromDate(future))) {
					return event;
				}
			}
		}
	});

	let secret: { message?: string } = $state({});
	function message() {
		if (document.hidden) return;
		setSecretMessage(secret);
	}
	$effect(() => untrack(message));
</script>

<svelte:document onvisibilitychange={message} />

<svelte:head>
	<title>Reagan HS Schedule</title>
	<meta name="description" content="bell schedule app for Reagan HS" />
</svelte:head>

<div class="h-full w-full snap-y snap-mandatory overflow-auto text-stone-950">
	<div class="flex h-full snap-center flex-col items-center justify-center bg-cyan-400">
		<span class="font-mono text-6xl md:text-9xl">{fmt.format(Date_getThis(curTime))}</span>
		{#if future}
			<span class="mt-3 text-lg md:text-3xl">
				{#if secret.message}
					{secret.message}
				{:else}
					<StatusText future={future.time} event={future.name} present={Date_getThis(curTime)} />
				{/if}
			</span>
		{/if}
	</div>
	<div
		class="h-full snap-center max-md:flex max-md:flex-col max-md:items-center max-md:justify-center max-md:gap-4 md:grid md:grid-cols-2"
	>
		<div class="flex flex-col items-center justify-center">
			<span class="font-mono text-6xl">{fmt.format(Date_getThis(curTime))}</span>
			{#if future}
				<span class="mt-2 md:text-xl">
					{#if secret.message}
						{secret.message}
					{:else}
						<StatusText future={future.time} event={future.name} present={Date_getThis(curTime)} />
					{/if}
				</span>
			{/if}
		</div>
		<div class="flex flex-col items-center justify-center">
			<label class="relative">
				<span class="sr-only">Current view</span>
				<select
					class="peer appearance-none rounded-md border border-stone-200 bg-stone-100 pr-6 pl-2 leading-7 shadow-inner"
					bind:value={pickedKey}
				>
					{#each pickableKeys as scheduleKey}
						<option value={scheduleKey}>{localization[scheduleKey]}</option>
					{/each}
				</select>
				<span
					class="pointer-events-none absolute right-2 mt-3 border-x-4 border-t-4 border-x-transparent border-t-stone-950"
				></span>
			</label>
			<table class="prose prose-stone prose-td:text-center mt-2">
				<tbody>
					{#each displayedSchedule as { name, start, end, id } (id)}
						<tr transition:fly={{ x: 200 }} animate:flip>
							<th scope="row">{name}</th>
							<td>{formatAsClock(start, end)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
