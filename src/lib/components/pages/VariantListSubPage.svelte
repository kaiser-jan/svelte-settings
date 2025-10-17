<script lang="ts">
  import type { SelectSetting, VariantListSettingPage } from '$lib/types.js'
  import { toReadable } from '$lib/utils/stores.js'
  import { getOptionsContext, getSettingsContext } from '$lib/context.js'
  import { getItemComponent } from '$lib/registry.js'
  import SelectInput from '$lib/components/inputs/SelectInput.svelte'
  import { ComponentIcon, Trash2Icon } from '@lucide/svelte'
  import type { ItemSerialized } from '$lib/types/ui.js'
  import SettingsItemContainer from '$lib/components/ui/SettingsItemContainer.svelte'

  interface Props {
    path: string[]
    item: VariantListSettingPage
    value: any
    onchange: (v: ItemSerialized) => void
    onnavigate: (target: string[]) => void
  }

  let { item, value, path, onchange, onnavigate }: Props = $props()

  const settings = getSettingsContext()
  const options = getOptionsContext()
  const { Label, Button, Popover, Select } = options.components

  let disabled = toReadable(item.disabled)

  let type = $derived(item.options.find((i) => i.id === value?.[item.typeField]))
  let subItems = $derived(item.options.find((i) => i.id === type?.id)?.items ?? [])

  // TODO: hide change indicator for list items, it makes no sense here

  const TYPE_ITEM: SelectSetting = {
    type: 'select',
    id: item.typeField,
    label: 'Type',
    icon: ComponentIcon,
    options: item.options,
    default: undefined as any,
  }
</script>

<SettingsItemContainer item={TYPE_ITEM} changed={false}>
  <SelectInput
    value={item.options.find((i) => i.id === value?.[item.typeField])?.id}
    onchange={(v) => {
      const type = v
      if (!value) value = {}
      value = { ...value, [item.typeField]: type }
      console.log('new', value)
      onchange(value)
    }}
    item={TYPE_ITEM}
  />
</SettingsItemContainer>

{#each [...item.base, ...subItems] as child (child.id)}
  {@const ItemComponent = getItemComponent(child)}
  {#if !child.visible || child.visible($settings)}
    <ItemComponent path={[...path, child.id]} item={child} {onnavigate} />
  {/if}
{/each}

<Button
  variant="destructive"
  class="mt-auto"
  onclick={() => {
    onchange(undefined)
    // TODO: merge with other navigation
    history.back()
  }}
>
  <Trash2Icon />
  Delete {item.itemLabel ?? 'Item'}
</Button>
