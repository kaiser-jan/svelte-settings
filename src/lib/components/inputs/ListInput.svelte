<script lang="ts">
  import { toReadable } from '$lib/utils/stores.js'
  import ReorderableList from '$lib/components/ui/ReorderableList.svelte'
  import { ChevronRightIcon } from '@lucide/svelte'
  import type { Setting } from '$lib/types.js'
  import type { PropsFor } from '$lib/registry.js'

  let { item, value, onchange }: PropsFor<Setting<'list'>> = $props()

  let disabled = toReadable(item.disabled)
</script>

{#if item.inline}
  <ReorderableList
    allOptions={item.options}
    selectedOptions={value}
    {onchange}
    {disabled}
    labels={item.labels}
    inline
  />
{:else}
  <span class="text-text-muted ml-auto">{value.length} / {item.options.length}</span>
  <ChevronRightIcon />
{/if}
