<script lang="ts">
  import { getOptionsContext } from '$lib/context'
  import type { BooleanSetting } from '../../types'

  interface Props {
    item: BooleanSetting
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
