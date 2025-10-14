<script lang="ts">
  import { dragHandle, dragHandleZone } from 'svelte-dnd-action'
  import { cn } from '$lib/utils.js'
  import type { ItemListSettingPage } from '../../types.js'
  import { toReadable } from '$lib/utils/stores.js'
  import ReorderableList from '../ui/ReorderableList.svelte'
  import { ChevronRightIcon, GripHorizontalIcon, type SettingsIcon } from '@lucide/svelte'
  import { getOptionsContext } from '$lib/context.js'
  import { onMount } from 'svelte'

  type Item = { id: string; label?: string; icon?: string }

  interface Props {
    item: ItemListSettingPage
    value: Record<string, Item>
    wasChanged: boolean
    onchange: (v: Record<string, Item>) => void
    onnavigate: (target: string[]) => void
  }

  let { item, value, wasChanged, onchange, onnavigate }: Props = $props()

  const options = getOptionsContext()
  const { Label, Button, Popover } = options.components

  let disabled = toReadable(item.disabled)

  onMount(() => {
    // HACK: write the defaults to the settings so editing one does not remove the other defaults
    if (!wasChanged) {
      onchange(value)
    }
  })
</script>

<div
  class={cn('flex w-full flex-col gap-2', $disabled ? 'opacity-50' : '')}
  data-vaul-no-drag
  use:dragHandleZone={{
    items: Object.values(value),
    flipDurationMs: 300,
    dragDisabled: $disabled,
    dropTargetStyle: {},
  }}
  onconsider={(e) => {
    const updated: Record<string, Item> = {}
    e.detail.items.forEach((i) => (updated[i.id] = i))
    value = updated
  }}
  onfinalize={(e) => {
    const updated: Record<string, Item> = {}
    e.detail.items.forEach((i) => (updated[i.id] = i))
    value = updated
    onchange(value)
  }}
>
  {#each Object.values(value) as listItem, listIndex (listItem.id)}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class={cn('flex flex-row items-center gap-2', options.style.category.classes, 'justify-start')}
      onclick={() => onnavigate([listItem.id])}
      data-vaul-no-drag
    >
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div use:dragHandle onclick={(e) => e.stopPropagation()} data-vaul-no-drag>
        <GripHorizontalIcon data-vaul-no-drag />
      </div>

      <Label for={listItem.id} class="text-left leading-4">
        {listItem.label ?? listItem.id}
      </Label>

      <ChevronRightIcon class="ml-auto" />
    </div>
  {/each}
</div>
