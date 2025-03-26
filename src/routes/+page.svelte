<script lang="ts">
	import { browser } from "$app/environment";
	import Page from "$lib/components/Page.svelte";
	import TwoPager from "$lib/components/TwoPager.svelte";
	import { Temporal, Intl } from "@js-temporal/polyfill";

	let x = $state(Temporal.Now.instant());
	if(browser) {
		function update() {
			x = Temporal.Now.instant();
			setTimeout(() => requestAnimationFrame(update), 1000);
		}
		setTimeout(() => requestAnimationFrame(update), 1000);
	}
	let fmt = new Intl.DateTimeFormat(undefined, { timeStyle: 'medium' });
</script>

<TwoPager>
	<Page class="flex items-center justify-center flex-col">
		<div>{fmt.format(x)}</div>
	</Page>
</TwoPager>