<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { untrack } from 'svelte';
	import StatusText from '../StatusText.svelte';
	import { Time, format, getSchedule, flattenTimes, findUpperBound } from '../utils';
	import { setSecretMessage } from '../secret';

	let { data } = $props();
	let { schedules, dates } = data;
	type ScheduleKey = keyof typeof schedules;

	let curTime = new SvelteDate();
	const fmt = new Intl.DateTimeFormat(navigator.language, { timeStyle: 'medium' });
	let formatted = $derived(fmt.format(curTime));
	setInterval(() => {
		curTime.setTime(Date.now());
	});

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
			data.scheduleByWeek,
			fallback
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
	let pickableKeys = [
		'regSchedule',
		'strikeSchedule',
		'erSchedule',
		'sem1Schedule',
		'sem2Schedule',
		'sem3Schedule',
		'sem4Schedule'
	];

	let scheduleKey = $derived(keyFor(curTime));
	let pickedKey = $state(untrack(() => (localization[scheduleKey] ? scheduleKey : fallback)));
	// hidden ones (nil for weekends) have precedence
	let actualKey = $derived(localization[scheduleKey] ? pickedKey : scheduleKey);
	let curSchedule = $derived(schedules[actualKey]);
	let displayedSchedule = $derived(schedules[pickedKey]);

	let times = $derived.by(() => {
		let future = new Date(curTime);
		let times = [];
		flattenTimes(times, curSchedule);
		let daysIntoFuture = 0;
		do {
			future.setDate(future.getDate() + 1);
			daysIntoFuture++;
		} while (schedules[keyFor(future)].length === 0);
		let futureSchedule = schedules[keyFor(future)];
		flattenTimes(times, futureSchedule, 24 * daysIntoFuture);
		return times;
	});
	let future = $derived(findUpperBound(times, Time.fromDate(curTime)));

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
	<meta name="description" content="view and check the schedule for Reagan HS" />
</svelte:head>

<div class="h-full w-full snap-y snap-mandatory overflow-auto text-stone-950">
	<div class="flex h-full snap-center flex-col items-center justify-center bg-cyan-400">
		<span class="font-mono text-6xl md:text-9xl">{formatted}</span>
		{#if future}
			<span class="mt-3 text-lg md:text-3xl">
				{#if secret.message}
					{secret.message}
				{:else}
					<StatusText right={future} current_time={curTime} />
				{/if}
			</span>
		{/if}
	</div>
	<div
		class="h-full snap-center max-md:flex max-md:flex-col max-md:items-center max-md:justify-center max-md:gap-4 md:grid md:grid-cols-2"
	>
		<div class="flex flex-col items-center justify-center">
			<span class="font-mono text-6xl">{formatted}</span>
			{#if future}
				<span class="mt-2 md:text-xl">
					{#if secret.message}
						{secret.message}
					{:else}
						<StatusText right={future} current_time={curTime} />
					{/if}
				</span>
			{/if}
		</div>
		<div class="flex flex-col items-center justify-center">
			<label class="relative">
				<span class="sr-only">Current view</span>
				<select
					class="peer appearance-none rounded-md border border-stone-200 bg-stone-100 pl-2 pr-6 leading-7 shadow-inner"
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
			{#if displayedSchedule}
				<table class="prose prose-stone mt-2 prose-td:text-center">
					<tbody>
						{#each displayedSchedule as { name, start, end, id } (id)}
							<tr transition:fly={{ x: 200 }} animate:flip>
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
