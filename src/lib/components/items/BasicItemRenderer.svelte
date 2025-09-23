<script lang="ts">
  import { getInputComponent } from '../../registry'
  import type { SettingsInput } from '../../types'
  import { getSettingsContext } from '$lib/context'
  import { cn } from '$lib/utils.js'
  import { getOptionsContext } from '$lib/context.js'

  interface Props {
    path: string[]
    item: SettingsInput
    fullscreen?: boolean
    onnavigate: (target: string[]) => void
  }

  let { path, item, fullscreen, onnavigate }: Props = $props()

  const options = getOptionsContext()
  const settings = getSettingsContext()

  const Component = getInputComponent(item.type)

  const initialSetting = settings.readSetting(path)
  let value = $state(initialSetting.value)
  let hasChanged = $state(initialSetting.changed ?? false)
</script>

<button
  class={cn(
    options.style.category.classes,
    'relative flex h-fit min-h-12 shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 overflow-hidden rounded-md px-4 py-2 whitespace-normal',
  )}
  onclick={() => {
    if (item.action) return item.action
    if (!fullscreen && item.allowsFullscreen) onnavigate([item.id])
  }}
  ondblclick={() => {
    value = settings.resetSetting(path)
    hasChanged = false
  }}
>
  <span class="flex flex-row items-center gap-3 font-medium">
    <item.icon class="text-text" />
    {item.label}
  </span>

  {#if Component}
    <Component
      {path}
      {item}
      {value}
      {onnavigate}
      {fullscreen}
      onchange={(v: unknown) => {
        settings.writeSetting(path, v)
        hasChanged = true
        value = v
      }}
    />
  {:else}
    {item.type}
    {item.id}
    {value}
  {/if}

  {#if item.description}
    <p class="text-text-muted text-left text-sm opacity-80">
      {item.description}
    </p>
  {/if}

  {#if hasChanged}
    <span class="absolute top-0 bottom-0 left-0 h-full w-0.5 bg-primary"></span>
  {/if}
</button>
