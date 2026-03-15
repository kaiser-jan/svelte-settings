<script lang="ts">
  import { dndzone, dragHandle, dragHandleZone } from 'svelte-dnd-action'
  import { cn } from '$lib/utils.js'
  import { toReadable } from '$lib/utils/stores.js'
  import {
    CheckIcon,
    ChevronRightIcon,
    GripHorizontalIcon,
    PlusIcon,
    RefreshCcwDotIcon,
    SquarePenIcon,
    Trash2Icon,
  } from '@lucide/svelte'
  import { getOptionsContext } from '$lib/context.js'
  import { createUUID } from '$lib/utils/common.js'
  import { lucideIcons } from '$lib/utils/icons.js'
  import type { Setting } from '$lib/types.js'
  import type { PropsFor } from '$lib/registry.js'

  type Item = { label?: string; icon?: string }
  type ItemWithId = Item & { id: string }

  let props: PropsFor<Setting<'item-list'>> = $props()
  const { item, value: _value, wasChanged, header, onchange, onnavigate } = props

  const options = getOptionsContext()
  const { Label, Button, Popover } = options.components

  let disabled = toReadable(item.disabled)

  let edit = $state(false)

  /** 
  Keep an internal copy of the value prop, so changing it in the parent still leads to updates.
  Otherwise, if we reassign to value, the reactivity is broken.
  */
  let items: Record<string, Item> = $state(filterUndefined(_value as Record<string, Item>))
  $effect(() => {
    items = filterUndefined(_value as Record<string, Item>)
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

<div class="flex w-full flex-row items-center gap-2">
  <div class="mr-auto">
    {@render header?.()}
  </div>

  <Button
    variant={edit ? options.style.button.action : options.style.button.secondary}
    size="icon"
    onclick={() => (edit = !edit)}
  >
    {#if edit}
      <CheckIcon />
    {:else}
      <SquarePenIcon />
    {/if}
  </Button>

  <Button
    disabled={edit}
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
    Add
  </Button>
</div>

<div
  class={cn('flex w-full flex-col', $disabled ? 'opacity-50' : '')}
  data-vaul-no-drag
  use:dndzone={{
    items: Object.values(toDragListItems(items)),
    flipDurationMs: 300,
    dragDisabled: $disabled || !edit,
    dropTargetStyle: {},
    // BUG: this causes flickering
    morphDisabled: true,
    dropAnimationDisabled: true,
    dropFromOthersDisabled: true,
  }}
  onconsider={(e) => {
    const updated: Record<string, ItemWithId> = {}
    e.detail.items.forEach((i) => (updated[i.id] = i))
    items = updated
  }}
  onfinalize={(e) => {
    const updated: Record<string, ItemWithId> = {}
    e.detail.items.forEach((i) => (updated[i.id] = i))
    items = updated
    onchange(updated)
  }}
>
  {#each Object.entries(items) as [id, listItem] (id ?? 'in-deletion')}
    {@const Icon = listItem.icon ? lucideIcons[listItem.icon] : undefined}

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <button
      class={cn(
        options.style.category.classes,
        'flex min-h-12 w-full flex-row items-center gap-2 px-3 py-2 not-last:border-b-2 first:rounded-t-md last:rounded-b-md',
        'justify-start rounded-none',
      )}
      onclick={() => !edit && onnavigate([id])}
      data-vaul-no-drag
    >
      {#if edit}
        <div data-vaul-no-drag>
          <GripHorizontalIcon data-vaul-no-drag />
        </div>
      {/if}

      {#if Icon}
        <Icon class="stroke opacity-80" />
      {/if}

      <Label for={id} class="block w-0 grow overflow-hidden text-left leading-4 text-nowrap text-ellipsis">
        {listItem?.label ?? id}
      </Label>

      <div class="ml-auto">
        {#if edit}
          <Button
            variant="destructive"
            size="icon"
            onclick={() => {
              delete items[id]
              onchange(items)
            }}
          >
            <Trash2Icon />
          </Button>
        {:else}
          <ChevronRightIcon />
        {/if}
      </div>
    </button>
  {/each}
</div>

{#if item.defaultToCopy && (items === undefined || Object.keys(items).length === 0)}
  <Button
    disabled={edit}
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
