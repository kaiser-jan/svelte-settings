<script lang="ts">
  import { toReadable } from '$lib/utils/stores.js'
  import ReorderableList from '$lib/components/ui/ReorderableList.svelte'
  import type { Setting } from '$lib/types.js'

  interface Props {
    item: Setting<'list'>
    value: string[]
    onchange: (v: string[]) => void
  }

  let { item, value, onchange }: Props = $props()

  let disabled = toReadable(item.disabled)
</script>

<div class="flex flex-col-reverse items-start gap-2">
  <ReorderableList allOptions={item.options} selectedOptions={value} {onchange} {disabled} labels={item.labels} />
</div>
