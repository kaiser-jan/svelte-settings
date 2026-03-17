<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import type { SettingsBlueprintItem } from '$lib/types.js'
  import { cn } from '$lib/utils.js'
  import type { Snippet } from 'svelte'
  import type { ButtonProps } from './button/button.svelte'

  interface Props extends ButtonProps {
    path: readonly string[]
    item: SettingsBlueprintItem
    changed?: boolean
    hideLabel?: boolean
    children: Snippet
  }

  const { item, changed, hideLabel, children, ...restProps }: Props = $props()

  const options = getOptionsContext()
  const { Button } = options.components
</script>

<Button
  {...restProps}
  variant={options.style.button.category}
  class={cn(
    'px-auto relative h-fit min-h-14 flex-wrap justify-between overflow-hidden p-2 text-base whitespace-normal',
    restProps.class,
  )}
>
  {#if !hideLabel}
    <label class="ml-1 flex shrink-0 flex-row items-center gap-3 font-medium" for={restProps.path?.join('_')}>
      {#if item.icon}
        <item.icon class="text-text" />
      {/if}
      {item.label}
    </label>
  {/if}

  {@render children()}

  {#if item.description}
    <p class="text-text-muted mx-1 w-full text-left text-sm opacity-80">
      {item.description}
    </p>
  {/if}

  {#if changed}
    <span class="absolute top-0 bottom-0 left-0 h-full w-0.5 bg-primary"></span>
  {/if}
</Button>
