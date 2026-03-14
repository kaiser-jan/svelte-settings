<script lang="ts">
  import { toReadable } from '$lib/utils/stores.js'
  import { getOptionsContext } from '$lib/context.js'
  import { lucideIcons } from '$lib/utils/icons.js'
  import AutoCombobox from '../ui/AutoCombobox.svelte'
  import type { Setting } from '$lib/types.js'

  interface Props {
    item: Setting<'icon'>
    value: string | undefined
    onchange: (v: string) => void
  }

  let { item, value, onchange }: Props = $props()
  const options = getOptionsContext()
  const { Select } = options.components

  let disabled = toReadable(item.disabled)

  function kebabCaseToPascalCase(s: string) {
    return s.replace(/-([a-z])/g, (_, c) => ' ' + c.toUpperCase()).replace(/^([a-z])/, (_, c) => c.toUpperCase())
  }
</script>

<AutoCombobox
  options={Object.entries(lucideIcons).map(([key, icon]) => ({ id: key, label: kebabCaseToPascalCase(key), icon }))}
  itemLabel={'Icon'}
  {value}
  {onchange}
/>
