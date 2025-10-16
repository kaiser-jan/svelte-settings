<script lang="ts">
  import { dragHandle, dragHandleZone } from 'svelte-dnd-action'
  import { cn } from '$lib/utils.js'
  import type { VariantListSettingPage } from '$lib/types.js'
  import { toReadable } from '$lib/utils/stores.js'
  import { ChevronRightIcon, GripHorizontalIcon, PlusIcon, type SettingsIcon } from '@lucide/svelte'
  import { getOptionsContext } from '$lib/context.js'
  import { onMount } from 'svelte'
  import { createUUID } from '$lib/utils/common.js'

  type Item = { id: string; label?: string; icon?: string }

  interface Props {
    item: VariantListSettingPage
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
  {#each Object.entries(value) as [listItemKey, listItem] (listItemKey)}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class={cn('flex flex-row items-center gap-2', options.style.category.classes, 'justify-start')}
      onclick={() => onnavigate([listItemKey])}
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
<Button
  variant={options.style.button.action}
  onclick={() => {
    const uuid = createUUID()
    onchange({
      ...value,
      [uuid]: {
        id: uuid,
      },
    })
    onnavigate([uuid])
  }}
>
  <PlusIcon />
  Add {item.itemLabel}
</Button>
