<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import type { Setting, SettingsBlueprintItem } from '$lib/types.js'
  import { cn } from '$lib/utils.js'
  import type { Snippet } from 'svelte'
  import type { ButtonProps } from './button/button.svelte'
  import { type HTMLAttributes } from 'svelte/elements'

  interface Props extends ButtonProps {
    item: SettingsBlueprintItem
    changed?: boolean
    hideLabel?: boolean
    children: Snippet
  }

  const { item, changed, hideLabel, children, class: className, ...props }: Props = $props()

  const options = getOptionsContext()
  const { Button } = options.components
</script>

{#snippet content()}
  {#if !hideLabel}
    <span class="ml-1 flex shrink-0 flex-row items-center gap-3 font-medium">
      {#if item.icon}
        <item.icon class="text-text" />
      {/if}
      {item.label}
    </span>
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
{/snippet}

<!-- NOTE: using a label for e.g. inputs, so the whole item is clickable -->
{#if 'onclick' in props || 'href' in props}
  <label
    class={cn(
      options.style.category.classes,
      'px-auto relative h-fit min-h-14 shrink-0 flex-wrap justify-between overflow-hidden p-2 text-base whitespace-normal',
      className,
    )}
    {...props as HTMLAttributes<HTMLLabelElement>}
  >
    {@render content()}
  </label>
{:else}
  <Button
    {...props}
    variant={options.style.button.category}
    class={cn(
      'px-auto relative h-fit min-h-14 shrink-0 flex-wrap justify-between overflow-hidden p-2 text-base whitespace-normal',
      className,
    )}
  >
    {@render content()}
  </Button>
{/if}
