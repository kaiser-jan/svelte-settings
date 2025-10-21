<script lang="ts">
  import type { IconSetting } from '$lib/types.js'
  import { toReadable } from '$lib/utils/stores.js'
  import { getOptionsContext } from '$lib/context.js'
  import SelectInput from './SelectInput.svelte'
  import { lucideIcons } from '$lib/icons.js'

  interface Props {
    item: IconSetting
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

<SelectInput
  item={{
    ...item,
    type: 'select',
    searchable: true,
    options: Object.entries(lucideIcons).map(([key, icon]) => ({ id: key, label: kebabCaseToPascalCase(key), icon })),
    default: undefined,
  }}
  {value}
  {onchange}
/>
