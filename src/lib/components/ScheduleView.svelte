<script lang="ts">
	import { flip } from "svelte/animate";
	import { fly } from "svelte/transition";

    let { schedule } = $props();
</script>

<table class="prose prose-stone prose-td:text-center mt-2">
    <tbody>
        {#each schedule as seg (seg.id)}
            <tr transition:fly={{ x: 200 }} animate:flip>
                <th scope="row">{seg.name}</th>
                <td>{seg}</td>
            </tr>
        {/each}
    </tbody>
</table>