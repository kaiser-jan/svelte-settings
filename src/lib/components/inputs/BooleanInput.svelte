<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import type { Setting } from '$lib/types.js'
  import type { PropsFor } from '$lib/registry.js'

  let { item, value, onchange }: PropsFor<Setting<'boolean'>> = $props()
  const options = getOptionsContext()
  const { Switch } = options.components
</script>

<Switch
  bind:checked={
    () => value ?? false,
    (v) => {
      value = v
      onchange(v)
    }
  }
/>
