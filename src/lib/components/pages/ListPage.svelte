<script lang="ts">
  import { toReadable } from '$lib/utils/stores.js'
  import ReorderableList from '$lib/components/ui/ReorderableList.svelte'
  import type { Setting } from '$lib/types.js'
  import type { PropsFor } from '$lib/registry.js'

  let { item, value, onchange, header }: PropsFor<Setting<'list'>> = $props()

  let disabled = toReadable(item.disabled)
</script>

{@render header()}

<div class="flex flex-col-reverse items-start gap-2">
  <ReorderableList allOptions={item.options} selectedOptions={value} {onchange} {disabled} labels={item.labels} />
</div>
