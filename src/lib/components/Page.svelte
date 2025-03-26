<script lang="ts">
    let { children, class: className = '' } = $props();
</script>

<div class="h-screen snap-center {className}">
    {@render children?.()}
</div>