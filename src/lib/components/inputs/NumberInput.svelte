<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import type { Setting } from '$lib/types.js'

  interface Props {
    item: Setting<'number'>
    value: number
    onchange: (v: number) => void
  }

  let { item, value, onchange }: Props = $props()
  const options = getOptionsContext()
  const { Input } = options.components
</script>

<div class="inline-flex flex-row items-baseline gap-1">
  <Input type="number" bind:value onblur={() => onchange(value)} min={item.min} max={item.max} step={item.step} />
  <span class="whitespace-nowrap">{item.unit}</span>
</div>
