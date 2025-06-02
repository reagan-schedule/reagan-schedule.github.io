<script lang="ts">
	import { Intl, Temporal } from '@js-temporal/polyfill';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { future, getSchedule, localize } from '$lib/utils';
	import { schedules } from '$lib/imutable';
	import { untrack } from 'svelte';
	import StatusText from '$lib/components/StatusText.svelte';
	import TwoPager from '$lib/components/TwoPager.svelte';
	import Fullscreen from '$lib/components/Fullscreen.svelte';
	import Stage from '$lib/components/Stage.svelte';
	import type { EventHandler } from 'svelte/elements';

	let pickableKeys = ['regSchedule', 'strikeSchedule', 'erSchedule'] as const;
	let now = $state(Temporal.Now.instant());
	// let now = $state(Temporal.Instant.from('2024-12-23T10:00-06:00'));
	let key = $derived(getSchedule(now.toZonedDateTimeISO('America/Chicago')));
	let pickedKey = $state(key || 'regSchedule');
	let clock = new Intl.DateTimeFormat(undefined, { timeStyle: 'medium' });
	let fmt = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' });
	let then = $state(future(now, key && pickedKey));
	// so it doesnt update every second
	let timeoutId: number;
	$effect(() => {
		then = future(
			// recalculate when schedule changes
			untrack(() => now),
			key && pickedKey
		);
	});
	// |
	// v
	// triggers this effect
	$effect(() => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			then = untrack(() => future(now, key && pickedKey));
		}, then.shouldUpdate);
	});
	setInterval(() => {
		now = Temporal.Now.instant();
	}, 1000);
	$inspect(then);
	// add a visibility change that makes me go into hibernation and then resets all the effects on show
	const sleep: EventHandler<Event, Document> = () => {
		if (document.hidden) {
			clearTimeout(timeoutId);
		} else {
			then = future(now, key && pickedKey);
		}
	};
</script>

<svelte:document onvisibilitychange={sleep} />

<svelte:head>
	<title>Reagan HS Schedule</title>
	<meta name="description" content="bell schedule app for Reagan HS" />
</svelte:head>

<TwoPager class="text-stone-950">
	<Fullscreen class="flex flex-col items-center justify-center bg-cyan-400">
		<span class="font-mono text-6xl md:text-9xl">{clock.format(now)}</span>
		<StatusText class="mt-3 text-lg md:text-3xl" {now} {then} />
	</Fullscreen>
	<Fullscreen
		class="max-md:flex max-md:flex-col max-md:items-center max-md:justify-center max-md:gap-4 md:grid md:grid-cols-2"
	>
		<Stage>
			<span class="font-mono text-6xl">{clock.format(now)}</span>
			<StatusText class="mt-2 md:text-xl" {now} {then} />
		</Stage>
		<Stage>
			<label class="relative">
				<span class="sr-only">Current view</span>
				<select
					class="peer appearance-none rounded-md border border-stone-200 bg-stone-100 pr-6 pl-2 leading-7 shadow-inner"
					bind:value={pickedKey}
				>
					{#each pickableKeys as k}
						<option value={k}>{localize(k)}</option>
					{/each}
				</select>
				<span
					class="pointer-events-none absolute right-2 mt-3 border-x-4 border-t-4 border-x-transparent border-t-stone-950"
				></span>
			</label>
			<table class="prose prose-stone prose-td:text-center mt-2 caption-bottom">
				<caption>This table is shown in CTZ</caption>
				<tbody>
					{#each schedules[pickedKey] as { name, start, end, id } (id)}
						<tr transition:fly={{ x: 200 }} animate:flip>
							<th scope="row">{name}</th>
							<td>{fmt.formatRange(start, end)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</Stage>
	</Fullscreen>
</TwoPager>
