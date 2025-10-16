<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import type { SettingsBlueprintItem } from '$lib/types.js'
  import { cn } from '$lib/utils.js'
  import type { Snippet } from 'svelte'
  import type { ButtonProps } from './button/button.svelte'

  interface Props extends ButtonProps {
    item: SettingsBlueprintItem
    changed: boolean
    children: Snippet
  }

  const { item, changed, children }: Props = $props()

  const options = getOptionsContext()
</script>

<button
  class={cn(
    options.style.category.classes,
    'relative flex h-fit min-h-12 shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 overflow-hidden rounded-md px-4 py-2 whitespace-normal',
  )}
>
  <span class="flex flex-row items-center gap-3 font-medium">
    <item.icon class="text-text" />
    {item.label}
  </span>

  {@render children()}

  {#if item.description}
    <p class="text-text-muted text-left text-sm opacity-80">
      {item.description}
    </p>
  {/if}

  {#if changed}
    <span class="absolute top-0 bottom-0 left-0 h-full w-0.5 bg-primary"></span>
  {/if}
</button>
