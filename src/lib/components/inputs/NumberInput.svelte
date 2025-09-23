<script lang="ts">
  import { getOptionsContext } from '$lib/context'
  import type { NumberSetting } from '../../types'

  interface Props {
    item: NumberSetting
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
