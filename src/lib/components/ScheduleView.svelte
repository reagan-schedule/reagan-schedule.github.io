<script lang="ts">
	import { formatSegment, type Segment } from '$lib/ctz';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	interface ScheduleViewProps {
		options: readonly string[];
		localization: Record<string, string | null>;
		schedules: Record<string, readonly Segment[]>;
		initialKey: string;
	}

	let { options, localization, initialKey, schedules }: ScheduleViewProps = $props();

	let pickedKey = $state(initialKey);
</script>

<div class="flex flex-col items-center justify-center">
	<label class="relative">
		<span class="sr-only">Current view</span>
		<select
			class="peer appearance-none rounded-md border border-stone-200 bg-stone-100 pr-6 pl-2 leading-7 shadow-inner"
			bind:value={pickedKey}
		>
			{#each options as scheduleKey}
				<option value={scheduleKey}>{localization[scheduleKey]}</option>
			{/each}
		</select>
		<span
			class="pointer-events-none absolute right-2 mt-3 border-x-4 border-t-4 border-x-transparent border-t-stone-950"
		></span>
	</label>
	<table class="prose prose-stone prose-td:text-center mt-2">
		<tbody>
			{#each schedules[pickedKey] as seg (seg.id)}
				<tr transition:fly={{ x: 200 }} animate:flip>
					<th scope="row">{seg.name}</th>
					<td>{formatSegment(seg)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
