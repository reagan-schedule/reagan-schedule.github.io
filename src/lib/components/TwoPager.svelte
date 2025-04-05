<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	let { children, class: className = '' } = $props();
</script>

<div class={twMerge('h-screen snap-y snap-mandatory overflow-auto', className)}>
	{@render children()}
</div>
