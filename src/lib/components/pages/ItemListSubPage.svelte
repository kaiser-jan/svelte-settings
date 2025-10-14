<script lang="ts">
  import { dragHandle, dragHandleZone } from 'svelte-dnd-action'
  import { cn } from '$lib/utils.js'
  import type { ItemListSettingPage } from '../../types.js'
  import { toReadable } from '$lib/utils/stores.js'
  import ReorderableList from '$lib/components/ui/ReorderableList.svelte'
  import { ChevronRightIcon, GripHorizontalIcon, type SettingsIcon } from '@lucide/svelte'
  import { getOptionsContext } from '$lib/context.js'
  import { getItemComponent } from '$lib/registry.js'
  import { settings } from '../../../app/stores/settings.js'
  import SelectInput from '../inputs/SelectInput.svelte'

  type Item = { id: string; label?: string; icon?: string }

  interface Props {
    path: string[]
    item: ItemListSettingPage
    value: any
    onchange: (v: Item) => void
    onnavigate: (target: string[]) => void
  }

  let { item, value, path, onchange, onnavigate }: Props = $props()

  const options = getOptionsContext()
  const { Label, Button, Popover, Select } = options.components

  let disabled = toReadable(item.disabled)

  let type = $derived(item.options.find((i) => i.id === value?.[item.typeField]))
  let subItems = $derived(item.options.find((i) => i.id === type?.id)?.items ?? [])
</script>

<SelectInput
  value={item.options.find((i) => i.id === value?.[item.typeField]).id}
  onchange={(v) => {
    const type = item.options.find((i) => i.id === v)
    if (!value) value = {}
    value = { ...value, [item.typeField]: type.id }
    console.log('new', value)
    onchange(value)
  }}
  item={{
    type: 'select',
    options: item.options.map((o) => o.id),
  }}
/>

<Select.Root
  type="single"
  value={item.options.find((i) => i.id === value?.[item.typeField])}
  onValueChange={(v) => {
    const type = item.options.find((i) => i.id === v)
    if (!value) value = {}
    value = { ...value, [item.typeField]: type.id }
    console.log('new', value)
    onchange(value)
  }}
  disabled={$disabled}
>
  <Select.Trigger class="w-full">
    {#if type && type.icon}
      <span class="flex items-center gap-2">
        <type.icon />
        {type.label}
      </span>
    {:else}
      Click to select type
    {/if}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      {#each item.options as itemType (itemType.id)}
        <Select.Item value={itemType.id} label={itemType.label}>
          <itemType.icon />
          {itemType.label}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>

{#each [...item.base, ...subItems] as child (child.id)}
  {@const ItemComponent = getItemComponent(child)}
  {#if !child.visible || child.visible($settings)}
    <ItemComponent path={[...path, child.id]} item={child} {onnavigate} />
  {/if}
{/each}
