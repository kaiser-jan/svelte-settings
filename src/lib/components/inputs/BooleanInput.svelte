<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import type { Setting } from '$lib/types.js'

  interface Props {
    item: Setting<'boolean'>
    value: boolean
    onchange: (v: boolean) => void
  }

  let { item, value, onchange }: Props = $props()
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
