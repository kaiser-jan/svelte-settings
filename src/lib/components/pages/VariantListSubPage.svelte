<script lang="ts">
  import type { Setting, SettingsBlueprintItem } from '$lib/types.js'
  import { toReadable } from '$lib/utils/stores.js'
  import { getOptionsContext, getSettingsContext } from '$lib/context.js'
  import { getItemComponent, type PropsFor } from '$lib/registry.js'
  import { ComponentIcon, Trash2Icon } from '@lucide/svelte'
  import SettingsItemContainer from '$lib/components/ui/SettingsItemContainer.svelte'
  import AutoSelect from '../ui/AutoSelect.svelte'

  let { item, value, path, onchange, ...props }: PropsFor<Setting<'variant-list'>, any> = $props()

  const settings = getSettingsContext()
  const options = getOptionsContext()
  const { Label, Button, Popover, Select } = options.components

  let disabled = toReadable(item.disabled)

  let type = $derived(item.options.find((i) => i.id === value?.[item.typeField]))
  let subItems = $derived(item.options.find((i) => i.id === type?.id)?.items ?? [])

  // TODO: hide change indicator for list items, it makes no sense here
</script>

<SettingsItemContainer
  item={{
    label: 'Type',
    icon: ComponentIcon,
  } as SettingsBlueprintItem}
  changed={false}
>
  <AutoSelect
    value={item.options.find((i) => i.id === value?.[item.typeField])?.id}
    onchange={(v) => {
      const type = v
      if (!value) value = {}
      value = { ...value, [item.typeField]: type }
      console.log('new', value)
      onchange(value)
    }}
    options={item.options}
  />
</SettingsItemContainer>

{#each [...item.base, ...subItems] as child (child.id)}
  {@const ItemComponent = getItemComponent(child as SettingsBlueprintItem)}
  {#if !child.visible || child.visible($settings)}
    <ItemComponent path={[...path, child.id]} item={child} {value} {onchange} {...props} />
  {/if}
{/each}
