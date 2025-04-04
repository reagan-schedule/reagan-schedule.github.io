<script lang="ts">
	import { Intl, Temporal } from "@js-temporal/polyfill";
	import { flip } from "svelte/animate";
	import { fly } from "svelte/transition";
	import { future, getSchedule, localize } from "$lib/utils";
	import { schedules } from "$lib/imutable";
	import { untrack } from "svelte";

	let pickableKeys = [
		'regSchedule',
		'strikeSchedule',
		'erSchedule',
	] as const;
	let now = $state(Temporal.Now.instant());
	let pickedKey = $state(getSchedule(now.toZonedDateTimeISO('America/Chicago')) || 'regSchedule');
	let clock = new Intl.DateTimeFormat(undefined, { timeStyle: 'medium' });
	let fmt = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' });
	let then = $state(future(now, getSchedule(now.toZonedDateTimeISO('America/Chicago')) && pickedKey));
	$effect(() => {
		then = future(untrack(() => now), getSchedule(now.toZonedDateTimeISO('America/Chicago')) && pickedKey);
	})
	$effect(() => {
		setTimeout(() => {
			then = untrack(() => future(now, getSchedule(now.toZonedDateTimeISO('America/Chicago')) && pickedKey));
		}, then.shouldUpdate);
	})
	setInterval(() => {
		now = Temporal.Now.instant();
	})
</script>

<!-- <svelte:document onvisibilitychange={message} /> -->

<svelte:head>
	<title>Reagan HS Schedule</title>
	<meta name="description" content="bell schedule app for Reagan HS" />
</svelte:head>

<div class="h-screen w-full snap-y snap-mandatory overflow-auto text-stone-950">
	<div class="flex h-full snap-center flex-col items-center justify-center bg-cyan-400">
		<span class="font-mono text-6xl md:text-9xl">{clock.format(now)}</span>
		<!-- {#if future}
			<span class="mt-3 text-lg md:text-3xl">
				{#if secret.message}
					{secret.message}
				{:else}
					<StatusText future={future.time} event={future.name} present={Date_getThis(curTime)} />
				{/if}
			</span>
		{/if} -->
	</div>
	<div
		class="h-full snap-center max-md:flex max-md:flex-col max-md:items-center max-md:justify-center max-md:gap-4 md:grid md:grid-cols-2"
	>
		<div class="flex flex-col items-center justify-center">
			<span class="font-mono text-6xl">{clock.format(now)}</span>
			<!-- {#if future}
				<span class="mt-2 md:text-xl">
					{#if secret.message}
						{secret.message}
					{:else}
						<StatusText future={future.time} event={future.name} present={Date_getThis(curTime)} />
					{/if}
				</span>
			{/if} -->
		</div>
		<div class="flex flex-col items-center justify-center">
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
			<table class="prose prose-stone prose-td:text-center mt-2">
				<tbody>
					{#each schedules[pickedKey] as { name, start, end, id } (id)}
						<tr transition:fly={{ x: 200 }} animate:flip>
							<th scope="row">{name}</th>
							<td>{fmt.formatRange(start, end)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
