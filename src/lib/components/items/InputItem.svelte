<script lang="ts">
  import { getInputComponent, isPage, type PropsFor, type SettingHaving, type SettingWith } from '$lib/registry.js'
  import { getSettingsContext } from '$lib/context.js'
  import SettingsItemContainer from '$lib/components/ui/SettingsItemContainer.svelte'

  let { path, item, onnavigate, onchange, ...props }: PropsFor<SettingWith<'input'>> = $props()

  const settings = getSettingsContext()

  const Component = getInputComponent(item.type)

  const initialSetting = settings.readSetting(path)
  let value = $state(initialSetting.value)
  let changed = $state(initialSetting.changed ?? false)
</script>

<SettingsItemContainer
  {...props}
  {item}
  {path}
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
      {...props}
      {item}
      {path}
      {value}
      {onnavigate}
      wasChanged={changed}
      onchange={(v: unknown) => {
        console.log('in input')
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
