<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import { cn } from '$lib/utils.js'
  import { toReadable } from '$lib/utils/stores.js'
  import type { ValueDisplayItem } from '$lib/types.js'
  import { ExternalLinkIcon } from '@lucide/svelte'

  interface Props {
    item: ValueDisplayItem
  }

  let { item }: Props = $props()
  const options = getOptionsContext()

  let value = $derived(toReadable(item.value))
</script>

<!-- TODO: unite styles between items -->
<a
  href={item.url}
  target="_blank"
  class={cn(
    options.style.category.classes,
    'relative flex min-h-12 shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 overflow-hidden rounded-md px-4 py-2',
  )}
>
  <span class="flex flex-row items-center gap-3">
    <item.icon />
    {item.label}
  </span>

  <span class="ml-auto">{$value}</span>

  {#if item.url}
    <ExternalLinkIcon class="text-text-muted" />
  {/if}
</a>
