<script lang="ts">
  import { dragHandle, dragHandleZone } from 'svelte-dnd-action'
  import { cn } from '$lib/utils.js'
  import type { ListSettingPage } from '$lib/types.js'
  import { toReadable } from '$lib/utils/stores.js'
  import { ChevronRightIcon, GripHorizontalIcon, PlusIcon, RefreshCcwDotIcon, type SettingsIcon } from '@lucide/svelte'
  import { getOptionsContext } from '$lib/context.js'
  import { createUUID } from '$lib/utils/common.js'
  import { lucideIcons } from '$lib/icons.js'

  type Item = { label?: string; icon?: string }
  type ItemWithId = Item & { id: string }

  interface Props {
    item: ListSettingPage
    value: Record<string, Item>
    wasChanged: boolean
    onchange: (v: Record<string, Item>) => void
    onnavigate: (target: string[]) => void
  }

  let { item, value: _value, wasChanged, onchange, onnavigate }: Props = $props()

  const options = getOptionsContext()
  const { Label, Button, Popover } = options.components

  let disabled = toReadable(item.disabled)

  /** 
  Keep an internal copy of the value prop, so changing it in the parent still leads to updates.
  Otherwise, if we reassign to value, the reactivity is broken.
  */
  let items: Record<string, Item> = $state(filterUndefined(_value))
  $effect(() => {
    items = filterUndefined(_value)
  })

  function filterUndefined(items: Record<string, Item>) {
    if (items === undefined) return {}
    // filter out undefined, which are temporarily there because of deletion
    return Object.fromEntries(Object.entries(items).filter(([_, v]) => v !== undefined))
  }

  function toDragListItems(items: Record<string, Item>) {
    return Object.fromEntries(Object.entries(items).map(([key, item]) => [key, { ...item, id: key }]))
  }
</script>

<div
  class={cn('flex w-full flex-col', $disabled ? 'opacity-50' : '')}
  data-vaul-no-drag
  use:dragHandleZone={{
    items: Object.values(toDragListItems(items)),
    flipDurationMs: 300,
    dragDisabled: $disabled,
    dropTargetStyle: {},
  }}
  onconsider={(e) => {
    const updated: Record<string, ItemWithId> = {}
    e.detail.items.forEach((i) => (updated[i.id] = i))
    items = updated
  }}
  onfinalize={(e) => {
    // TODO: only after reordering does the SettingsView (incl. Breadcrumbs) get reactive to e.g. label changes of the items
    const updated: Record<string, ItemWithId> = {}
    e.detail.items.forEach((i) => (updated[i.id] = i))
    items = updated
    onchange(updated)
  }}
>
  {#each Object.entries(items) as [id, listItem] (id ?? 'in-deletion')}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class={cn(
        'flex min-h-12 w-full flex-row items-center gap-2  px-3 py-2 first:rounded-t-md last:rounded-b-md',
        options.style.category.classes,
        'justify-start rounded-none',
      )}
      onclick={() => onnavigate([id])}
      data-vaul-no-drag
    >
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div use:dragHandle onclick={(e) => e.stopPropagation()} data-vaul-no-drag>
        <GripHorizontalIcon data-vaul-no-drag />
      </div>

      {#if listItem.icon}
        {@const Icon = lucideIcons[listItem.icon]}
        <Icon class="stroke opacity-80" />
      {/if}

      <Label for={id} class="text-left leading-4">
        {listItem?.label ?? id}
      </Label>

      <ChevronRightIcon class="ml-auto" />
    </div>
  {/each}
</div>

{#if item.defaultToCopy && (items === undefined || Object.keys(items).length === 0)}
  <Button
    class="mt-2"
    variant={options.style.button.action}
    onclick={() => {
      if (!item.defaultToCopy) return
      items = item.defaultToCopy
      onchange(item.defaultToCopy)
    }}
  >
    <RefreshCcwDotIcon />
    Recreate defaults
  </Button>
{/if}

<Button
  class="mt-2"
  variant={options.style.button.action}
  onclick={() => {
    const uuid = createUUID()
    onchange({
      ...items,
      [uuid]: {},
    })
    onnavigate([uuid])
  }}
>
  <PlusIcon />
  Add {item.itemLabel ?? 'Item'}
</Button>
