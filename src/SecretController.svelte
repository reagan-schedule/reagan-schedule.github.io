<script lang="ts">
	let { secretMessage = $bindable() }: { secretMessage: string | undefined } = $props()
	const chance = 1 / 1000;
	const secretMessages = ['William loves Elana', 'Optimized sub-optimal code', 'Marry me Chloe'];
	$effect(() => {
		if (Math.random() < chance)
			secretMessage = secretMessages[Math.floor(Math.random() * secretMessages.length)];
		const id = setTimeout(() => {
			secretMessage = undefined;
		}, 1000);
		return () => {
			clearTimeout(id);
		};
	});
</script>
