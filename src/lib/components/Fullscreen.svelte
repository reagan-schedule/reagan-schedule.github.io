<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	let { children, class: className = '' } = $props();
</script>

<div class={twMerge('h-full snap-center', className)}>
	{@render children()}
</div>
