<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import type { SettingsBlueprintItem } from '$lib/types.js'
  import { cn } from '$lib/utils.js'
  import type { Snippet } from 'svelte'
  import type { ButtonProps } from './button/button.svelte'
  import Div from './Div.svelte'

  interface Props extends ButtonProps {
    item: SettingsBlueprintItem
    changed?: boolean
    clickable?: boolean
    hideLabel?: boolean
    children: Snippet
  }

  const { item, changed, clickable, hideLabel, children, ...restProps }: Props = $props()

  const options = getOptionsContext()
  const { Button } = options.components

  const Component = $derived(clickable ? Button : (Div as typeof Button))
</script>

<Component
  {...restProps}
  class={cn(
    !clickable && options.style.container.classes,
    // 'relative flex h-fit min-h-12 shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 overflow-hidden rounded-md px-4 py-2 whitespace-normal',
    'relative h-fit flex-wrap justify-between overflow-hidden px-4 py-2 whitespace-normal',
    restProps.class,
  )}
>
  {#if !hideLabel}
    <span class="flex flex-row items-center gap-3 font-medium">
      {#if item.icon}
        <item.icon class="text-text" />
      {/if}
      {item.label}
    </span>
  {/if}

  {@render children()}

  {#if item.description}
    <p class="text-text-muted text-left text-sm opacity-80">
      {item.description}
    </p>
  {/if}

  {#if changed}
    <span class="absolute top-0 bottom-0 left-0 h-full w-0.5 bg-primary"></span>
  {/if}
</Component>
