<script lang="ts">
  import type { SelectSetting } from '$lib/types.js'
  import { toReadable } from '$lib/utils/stores.js'
  import AutoCombobox from '../ui/AutoCombobox.svelte'
  import AutoSelect from '../ui/AutoSelect.svelte'

  interface Props {
    item: SelectSetting
    value: string | undefined
    onchange: (v: string) => void
  }

  let { item, value, onchange }: Props = $props()

  let disabled = toReadable(item.disabled)
</script>

{#if item.searchable}
  <AutoCombobox options={item.options} {value} itemLabel={item.label} {onchange} disabled={$disabled} />
{:else}
  <AutoSelect options={item.options} {value} {onchange} disabled={$disabled} />
{/if}
