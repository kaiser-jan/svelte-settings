<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import type { TextSetting } from '$lib/types.js'

  interface Props {
    item: TextSetting
    value: string
    onchange: (v: string) => void
  }

  let { item, value, onchange }: Props = $props()

  const options = getOptionsContext()
  const { Input } = options.components
</script>

<Input
  bind:value
  placeholder={item.placeholder}
  onblur={(e) => onchange((e.target as HTMLInputElement).value)}
  class="w-fit min-w-30"
/>
