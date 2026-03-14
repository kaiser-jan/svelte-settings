<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import type { Setting } from '$lib/types.js'
  import type { PropsFor } from '$lib/registry.js'

  let { item, value, onchange }: PropsFor<Setting<'text'>> = $props()

  const options = getOptionsContext()
  const { Input } = options.components
</script>

<Input
  bind:value
  placeholder={item.placeholder}
  onblur={(e: Event) => onchange((e.target as HTMLInputElement).value)}
  class="w-fit min-w-30"
/>
