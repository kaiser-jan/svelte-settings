<script lang="ts">
  import type { PropsFor } from '$lib/registry.js'
  import type { Setting } from '$lib/types.js'
  import PageRenderer from '../Page.svelte'

  let { onnavigate, item, ...props }: PropsFor<Setting<'page'>> = $props()
</script>

<section class="flex flex-col gap-2">
  <h2 class="text-text-muted -mb-1 flex flex-row items-center gap-2">
    <item.icon />
    {item.label}
  </h2>
  <PageRenderer
    {...props}
    {item}
    onnavigate={(target) => {
      onnavigate([item.id, ...target])
    }}
  />
</section>
