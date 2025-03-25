<script lang="ts">
	import ScheduleView from '$lib/components/ScheduleView.svelte';
	import { obtainFuture, getSchedule, rebase } from '$lib/ctz';
	import { untrack } from 'svelte';

	let { data } = $props();
	let { schedules, dates } = data;
	let curTime = $state(Date.now());
	type ScheduleKey = keyof typeof schedules;
	function keyFor(dateObj: Date) {
		return getSchedule<ScheduleKey>(
			dateObj,
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
	let pickedKey = $state(keyFor(rebase(curTime)));
	// future should update when the pickedKey dependency changes and
	// i like react better, and also on a interval depending on the last return
	let future = $state([1000]);
	let timeoutId = setTimeout(() => {
		future = [1000];
	}, future[0]);
	setInterval(() => {
		curTime = Date.now();
	});
	// $inspect(curTime);
	$inspect(future);
</script>

<!-- <svelte:document onvisibilitychange={message} /> -->

<svelte:head>
	<title>Reagan HS Schedule</title>
	<meta name="description" content="bell schedule app for Reagan HS" />
</svelte:head>

<!-- <div class="h-full w-full snap-y snap-mandatory overflow-auto text-stone-950">
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
		<div class="flex flex-col items-center justify-center">
			<label class="relative">
				<span class="sr-only">Current view</span>
				<select
					class="peer appearance-none rounded-md border border-stone-200 bg-stone-100 pr-6 pl-2 leading-7 shadow-inner"
					bind:value={pickedKey}
				>
					{#each data.pickableKeys as scheduleKey}
						<option value={scheduleKey}>{data.local[scheduleKey]}</option>
					{/each}
				</select>
				<span
					class="pointer-events-none absolute right-2 mt-3 border-x-4 border-t-4 border-x-transparent border-t-stone-950"
				></span>
			</label>
			<ScheduleView schedule={schedules[pickedKey]} />
		</div>
	</div>
</div> -->
