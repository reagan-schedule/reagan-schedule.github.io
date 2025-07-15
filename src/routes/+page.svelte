<script lang="ts">
	import { Temporal } from '@js-temporal/polyfill';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { setContext, untrack } from 'svelte';
	import StatusText from '$lib/components/StatusText.svelte';
	import TwoPager from '$lib/components/TwoPager.svelte';
	import Fullscreen from '$lib/components/Fullscreen.svelte';
	import Stage from '$lib/components/Stage.svelte';
	import type { EventHandler } from 'svelte/elements';
	import { IntlContext } from '$lib/display';
	import { browser } from '$app/environment';
	import { PUBLIC_TZ } from '$env/static/public';
	import {
		ScheduleCollection,
		type Label,
	} from '$lib/knows_schedules/schedule';
	import {
		applySchedule,
		difference,
		futureSchedules,
		upperBound,
	} from '$lib/atomic_future';
	import { Compare } from '$lib/compare';
	import { labels } from '$lib/knows_schedules/data';
	import SecondsClock from '$lib/components/SecondsClock.svelte';
	import { base } from '$app/paths';
	const keys = new Map(Object.entries(labels));

	const MAX_TIMEOUT = 2147483647;

	const intlProvider = new IntlContext(
		browser ? [...navigator.languages] : 'en-US'
	);
	setContext('intl', intlProvider);
	const comp = new Compare<Temporal.PlainDateLike>(Temporal.PlainDate.compare);
	const collection = new ScheduleCollection();
	let now = $state(Temporal.Now.zonedDateTimeISO(PUBLIC_TZ));

	function calculateFuture(key: Label | null) {
		return futureSchedules(
			untrack(() => now),
			key,
			{ comparator: comp, collection }
		)
			.take(1000)
			.flatMap(applySchedule)
			.find(upperBound);
	}

	let key = $derived(collection.getSchedule(now));
	let pickedKey = $state(key || 'Regular Schedule');

	let soon = $state(calculateFuture(key && pickedKey));

	function recalculate() {
		soon = calculateFuture(key && pickedKey);
	}

	function staticRecalculate() {
		soon = calculateFuture(untrack(() => key && pickedKey));
	}
	let timeoutId: number;
	$effect(recalculate);
	// |
	// v
	// triggers this effect
	$effect(() => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(
			staticRecalculate,
			Math.min(
				MAX_TIMEOUT,
				soon ?
					difference(
						soon.at,
						untrack(() => now)
					)
				:	0
			)
		);
	});
	setInterval(() => {
		now = Temporal.Now.zonedDateTimeISO(now.timeZoneId);
	}, 1000);
	$inspect(soon);
	const sleep: EventHandler<Event, Document> = () => {
		console.log('visibilitychange', 'document.hidden=', document.hidden);
		if (document.hidden) {
			clearTimeout(timeoutId);
			return;
		}
		staticRecalculate();
	};

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
		<StatusText class="mt-3 text-md sm:text-lg md:text-3xl" now={now} soon={soon} />
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
					{#each collection.namedSchedule(pickedKey) as { name, start, end, id } (id)}
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
