<script lang="ts">
	import StatusText from '$lib/components/StatusText.svelte';
	import ScheduleView from '$lib/components/ScheduleView.svelte';
	import { adjustClock, getSchedule, realTime } from '$lib/ctz';
	import { setSecretMessage } from '$lib/secret';

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

	function keyFor(dateObject: Date) {
		return getSchedule<ScheduleKey>(
			dateObject,
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
	let localization: Record<ScheduleKey, string | null> = {
		regSchedule: 'Regular Schedule',
		strikeSchedule: 'STRIKE Schedule',
		erSchedule: 'Early Release',
		sem1Schedule: 'Finals Day 1',
		sem2Schedule: 'Finals Day 2',
		sem3Schedule: 'Finals Day 3',
		sem4Schedule: 'Finals Day 4',
		nil: null
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

	let fallback: ScheduleKey = 'regSchedule';
	// svelte-ignore state_referenced_locally
	let curDate = Date_getThis(curTime);
	adjustClock(curDate);
	let scheduleKeyAtLoadTime = keyFor(curDate);

	let future = $derived.by(() => {
		let future = Date_getThis(curTime);
		adjustClock(future);
		let daysIntoFuture = 0;
		for (; daysIntoFuture < 1000; future.setDate(future.getDate() + 1), daysIntoFuture++) {
			let events = schedules[keyFor(future)];
			for (let event of realTime(events, future)) {
				if (event.time > curTime) {
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
	$effect(message);
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
					<StatusText future={future.time} event={future.name} present={curTime} />
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
						<StatusText future={future.time} event={future.name} present={curTime} />
					{/if}
				</span>
			{/if}
		</div>
		<ScheduleView
			options={pickableKeys}
			{localization}
			{schedules}
			initialKey={localization[scheduleKeyAtLoadTime] ? scheduleKeyAtLoadTime : fallback}
		/>
	</div>
</div>
