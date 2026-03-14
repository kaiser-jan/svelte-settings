<script lang="ts">
  import { toReadable } from '$lib/utils/stores.js'
  import ReorderableList from '$lib/components/ui/ReorderableList.svelte'
  import { ChevronRightIcon } from '@lucide/svelte'
  import type { Setting } from '$lib/types.js'

  interface Props {
    item: Setting<'list'>
    value: string[]
    onchange: (v: string[]) => void
  }

  let { item, value, onchange }: Props = $props()

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
