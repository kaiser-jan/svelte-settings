<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import { lucideIcons } from '$lib/icons.js'
  import type { ListSettingPage } from '$lib/types.js'
  import { cn } from '$lib/utils.js'
  import { createUUID } from '$lib/utils/common.js'
  import { ChevronRightIcon, GripHorizontalIcon, PlusIcon } from '@lucide/svelte'
  import { onMount } from 'svelte'
  import { dragHandle, dragHandleZone } from 'svelte-dnd-action'

  interface Props {
    item: ListSettingPage
    value: Record<string, unknown>[]
    onchange: (v: unknown[]) => void
    onnavigate: (target: string[]) => void
    onchildchange: (key: string, v: unknown[]) => void
  }

  let { item, value, onchange, onnavigate, onchildchange = $bindable() }: Props = $props()
  const options = getOptionsContext()

  const { Button } = options.components

  onMount(() => {
    onchildchange = (key, v) => {
      const filtered = value.filter((v) => v)
      console.warn('child changed', key, v, value, filtered)
      if (filtered.length !== value.length) {
        onchange(filtered)
        value = filtered
      }
    }
  })
</script>

<div class="flex flex-col gap-4">
  <div
    class="flex grow flex-col flex-nowrap gap-2 py-1"
    data-vaul-no-drag
    use:dragHandleZone={{
      items: value?.filter((v) => v) ?? [],
      flipDurationMs: 300,
      dropTargetStyle: {},
    }}
    onconsider={(e) => {
      value = e.detail.items
    }}
    onfinalize={(e) => {
      value = e.detail.items
      onchange(value)
    }}
  >
    {#each value as listItem, listIndex (listItem.id)}
      <button
        class={cn(
          options.style.category.classes,
          'flex w-full flex-row items-center gap-2 px-3 py-2 not-last:border-b-2 first:rounded-t-md last:rounded-b-md',
        )}
        onclick={() => {
          onnavigate([listIndex.toString()])
        }}
        data-vaul-no-drag
      >
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div use:dragHandle onclick={(e) => e.stopPropagation()} data-vaul-no-drag>
          <GripHorizontalIcon data-vaul-no-drag />
        </div>

        {#if item.iconProperty && item.iconProperty in listItem}
          {@const Icon = lucideIcons[listItem[item.iconProperty] as string]}
          <Icon class="opacity-80" />
        {/if}

        {#if item.nameProperty && item.nameProperty in listItem}
          {listItem[item.nameProperty]}
        {/if}
        <ChevronRightIcon class="ml-auto" />
      </button>
    {:else}
      Nothing here yet!
    {/each}
  </div>

  <Button
    variant={options.style.button.action}
    onclick={() => {
      value = [...(value ?? []), { id: createUUID() }]
      onchange(value)
      onnavigate([(value.length - 1).toString()])
    }}
  >
    <PlusIcon />
    Add {item.itemLabel ?? 'Item'}
  </Button>
</div>
