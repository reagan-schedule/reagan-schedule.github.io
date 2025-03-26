<script lang="ts">
    let { children, class: className = '' } = $props();
</script>

<div class="h-screen overflow-auto snap-y snap-mandatory {className}">
    {@render children?.()}
</div>