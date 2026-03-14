<script lang="ts">
  import type { Setting } from '$lib/types.js'
  import { toReadable } from '$lib/utils/stores.js'
  import AutoCombobox from '../ui/AutoCombobox.svelte'
  import AutoSelect from '../ui/AutoSelect.svelte'

  interface Props {
    item: Setting<'select'>
    value: string | undefined
    onchange: (v: string) => void
  }

  let { item, value, onchange }: Props = $props()

  let disabled = toReadable(item.disabled)
</script>

{#if item.searchable}
  <AutoCombobox options={item.options} {value} itemLabel={item.itemLabel} {onchange} disabled={$disabled} />
{:else}
  <AutoSelect options={item.options} {value} {onchange} disabled={$disabled} />
{/if}
