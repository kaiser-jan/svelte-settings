<script lang="ts">
  import type { MultiSelectSetting } from '$lib/types.js'
  import { toReadable } from '$lib/utils/stores.js'
  import ReorderableList from '$lib/components/ui/ReorderableList.svelte'
  import { ChevronRightIcon } from '@lucide/svelte'

  interface Props {
    item: MultiSelectSetting
    value: string[]
    onchange: (v: string[]) => void
  }

  let { item, value, onchange }: Props = $props()

  let disabled = toReadable(item.disabled)
</script>

{#if item.inline}
  <ReorderableList allOptions={item.options} selectedOptions={value} {onchange} {disabled} labels={item.labels} />
{:else}
  <span class="text-text-muted ml-auto">{value.length} / {item.options.length}</span>
  <ChevronRightIcon />
{/if}
