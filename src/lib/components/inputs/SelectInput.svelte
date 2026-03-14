<script lang="ts">
  import { toReadable } from '$lib/utils/stores.js'
  import AutoCombobox from '../ui/AutoCombobox.svelte'
  import AutoSelect from '../ui/AutoSelect.svelte'
  import type { Setting } from '$lib/types.js'
  import type { PropsFor } from '$lib/registry.js'

  let { item, value, onchange }: PropsFor<Setting<'select'>> = $props()

  let disabled = toReadable(item.disabled)
</script>

{#if item.searchable}
  <AutoCombobox options={item.options} {value} itemLabel={item.itemLabel} {onchange} disabled={$disabled} />
{:else}
  <AutoSelect options={item.options} {value} {onchange} disabled={$disabled} />
{/if}
