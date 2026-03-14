<script lang="ts">
  import { getInputComponent, isPage } from '$lib/registry.js'
  import type { SettingsInput } from '$lib/types.js'
  import { getSettingsContext } from '$lib/context.js'
  import { cn } from '$lib/utils.js'
  import { getOptionsContext } from '$lib/context.js'
  import SettingsItemContainer from '../ui/SettingsItemContainer.svelte'

  interface Props {
    path: string[]
    item: SettingsInput
    onnavigate: (target: string[]) => void
  }

  let { path, item, onnavigate }: Props = $props()

  const settings = getSettingsContext()

  const Component = getInputComponent(item.type)

  const initialSetting = settings.readSetting(path)
  let value = $state(initialSetting.value)
  let changed = $state(initialSetting.changed ?? false)
</script>

<SettingsItemContainer
  {item}
  {changed}
  onclick={() => {
    if (item.action) return item.action
    if (isPage(item) && !item.inline) onnavigate([item.id])
  }}
  ondblclick={() => {
    value = settings.resetSetting(path)
    changed = false
  }}
>
  {#if Component}
    <Component
      {path}
      {item}
      {value}
      {onnavigate}
      wasChanged={changed}
      onchange={(v: unknown) => {
        settings.writeSetting(path, v)
        changed = true
        value = v
      }}
    />
  {:else}
    {item.type}
    {item.id}
    {value}
  {/if}
</SettingsItemContainer>
