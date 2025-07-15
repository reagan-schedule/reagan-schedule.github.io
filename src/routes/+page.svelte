<script lang="ts">
	const MAX_TIMEOUT = 2147483647;
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { setContext, untrack } from 'svelte';
	import type { EventHandler } from 'svelte/elements';
	import { browser } from '$app/environment';
	import { PUBLIC_TZ } from '$env/static/public';

	import {
		StatusText,
		TwoPager,
		Fullscreen,
		Stage,
		SecondsClock,
	} from '$lib/components/';

	import { IntlContext } from '$lib/display';
	import {
		ScheduleCollection,
		type Label,
		labels,
		TimeSkipService,
	} from '$lib/knows_schedules/';
	import {
		applySchedule,
		difference,
		futureSchedules,
		upperBound,
		Temporal,
	} from '$lib/atomic_future';
	const keys = new Map(Object.entries(labels));

	const intlProvider = new IntlContext(
		browser ? [...navigator.languages] : 'en-US'
	);
	setContext('intl', intlProvider);

	let now = $state(Temporal.Now.zonedDateTimeISO(PUBLIC_TZ));
	let key = $derived(ScheduleCollection.getSchedule(now));
	let pickedKey = $state(key || 'Regular Schedule');
	function calculateFuture(key: Label | null) {
		return futureSchedules(
			untrack(() => now),
			key,
			{ resolver: ScheduleCollection, timeSkipService: TimeSkipService }
		)
			.take(1000)
			.flatMap(applySchedule)
			.find(upperBound);
	}

	let soon = $state(calculateFuture(key && pickedKey));
	function recalculate() {
		soon = calculateFuture(key && pickedKey);
	}
	function staticRecalculate() {
		soon = calculateFuture(untrack(() => key && pickedKey));
	}
	function thenWakeup() {
		console.log('visibilitychange', 'document.hidden=', document.hidden);
		if (document.hidden) {
			clearTimeout(timeoutId);
			return;
		}
		staticRecalculate();
	}
	let timeoutId: number;
	$effect(recalculate);
	// |
	// v
	// triggers this effect
	$effect(() => {
		clearTimeout(timeoutId);
		let timeout = 0;
		if (soon) {
			let currentTime = untrack(() => now);
			timeout = difference(soon.at, currentTime);
			timeout = Math.min(timeout, MAX_TIMEOUT);
		}
		timeoutId = setTimeout(staticRecalculate, timeout);
	});
	setInterval(() => {
		now = Temporal.Now.zonedDateTimeISO(now.timeZoneId);
	}, 1000);
	$inspect(soon);
	const sleep: EventHandler<Event, Document> = thenWakeup;

	// this was originally to let the user name their periods.
	// would be very easy to implement.
	// just makes the table ugly when all of the fields are inputs.
	// let settings: Record<string, string> = $state(
	// 	Object.fromEntries(collection.namedSchedule(pickedKey).map(({ name }) => [name, name]))
	// );
	// $inspect(settings);

	// $effect(() => {
	// 	if (!browser) {
	// 		return;
	// 	}
	// 	const base64ascii = localStorage.getItem('::settings::');
	// 	if (base64ascii === null) {
	// 		return;
	// 	}
	// 	const bytes = atob(base64ascii);
	// 	const decoded = Uint8Array.from(bytes, (v) => {
	// 		const c = v.codePointAt(0);
	// 		if (c === undefined) {
	// 			throw new TypeError(bytes);
	// 		}
	// 		return c;
	// 	});
	// 	settings = JSON.parse(new TextDecoder().decode(decoded));
	// });
	// $effect(() => {
	// 	if (!browser) {
	// 		return;
	// 	}
	// 	const encoded = new TextEncoder().encode(JSON.stringify(settings));
	// 	const bytes = String.fromCodePoint(...encoded.values());
	// 	const base64ascii = btoa(bytes);

	// 	localStorage.setItem('::settings::', base64ascii);
	// });
</script>

<svelte:document onvisibilitychange={sleep} />

<svelte:head>
	<title>Reagan HS Schedule</title>
	<meta name="description" content="bell schedule app for Reagan HS" />
</svelte:head>

<TwoPager class="text-stone-950">
	<Fullscreen class="flex flex-col items-center justify-center bg-cyan-300">
		<SecondsClock
			class="h-21 fill-stone-950 text-4xl sm:h-28 sm:text-6xl md:h-56 md:text-9xl"
			now={now}
		/>
		<StatusText
			class="text-md mt-3 sm:text-lg md:text-3xl"
			now={now}
			soon={soon}
		/>
	</Fullscreen>
	<Fullscreen
		class="max-md:flex max-md:flex-col max-md:items-center max-md:justify-center max-md:gap-4 md:grid md:grid-cols-2"
	>
		<Stage>
			<SecondsClock
				class="h-21 fill-stone-950 text-4xl sm:h-28 sm:text-6xl"
				now={now}
			/>
			<StatusText class="mt-2 md:text-xl" now={now} soon={soon} />
		</Stage>
		<Stage>
			<label class="relative">
				<span class="sr-only">Current view</span>
				<select
					class="peer appearance-none rounded-md border border-stone-200 bg-stone-100 pr-6 pl-2 leading-7 shadow-inner"
					bind:value={pickedKey}
				>
					{#each keys.keys() as k}
						<option value={k}>{k}</option>
					{/each}
				</select>
				<span
					class="pointer-events-none absolute right-2 mt-3 border-x-4 border-t-4 border-x-transparent border-t-stone-950"
				></span>
			</label>
			<table class="prose prose-stone prose-td:text-center mt-2 caption-bottom">
				<caption>This table is shown in CT</caption>
				<tbody>
					{#each ScheduleCollection.namedSchedule(pickedKey) as { name, start, end, id } (id)}
						<tr transition:fly={{ x: 200 }} animate:flip>
							<th scope="row">
								{name}
							</th>
							<td>{intlProvider.asRange(start, end)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</Stage>
	</Fullscreen>
</TwoPager>
