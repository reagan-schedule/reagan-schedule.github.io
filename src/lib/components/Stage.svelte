<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	let { children, class: className = '' } = $props();
</script>

<div class={twMerge('flex flex-col items-center justify-center', className)}>
	{@render children()}
</div>
