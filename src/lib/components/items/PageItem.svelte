<script lang="ts">
  import { getOptionsContext, getSettingsContext } from '$lib/context.js'
  import { ChevronRightIcon } from '@lucide/svelte'
  import SettingsItemContainer from '../ui/SettingsItemContainer.svelte'
  import type { Setting } from '$lib/types.js'
  import { getPageComponent, type PropsFor } from '$lib/registry.js'
  import { getDeep } from '$lib/utils/deep.js'

  let props: PropsFor<Setting<'page'>> = $props()
  let { item, onnavigate } = props

  const options = getOptionsContext()
  const settings = getSettingsContext()

  // TODO: reactivity
  // let value = settings.select((s) => {
  //   let _s = s
  //   console.log(props.path)
  //   props.path.forEach((p) => (_s = _s[p]))
  //   console.log(_s)
  //   return _s
  // })
</script>

{#if item.inline && getPageComponent(item.type)}
  {@const PageComponent = getPageComponent(item.type)}

  <SettingsItemContainer variant={options.style.button.category} {item} hideLabel>
    <PageComponent
      {...props}
      {item}
      onnavigate={(p) => {
        // TODO: this breaks breadcrumb nav
        onnavigate([item.id, ...p])
      }}
      onchange={(v) => {
        // NOTE: this does not help, its not the child which is writing
        settings.writeSetting(props.path, v)
      }}
      value={settings.readSetting(props.path).value}
    >
      {#snippet header()}
        <span class="ml-1 flex shrink-0 flex-row items-center gap-3 font-medium">
          {#if item.icon}
            <item.icon class="text-text" />
          {/if}
          {item.label}
        </span>
      {/snippet}
    </PageComponent>
  </SettingsItemContainer>
{:else}
  <SettingsItemContainer {props} variant={options.style.button.category} onclick={() => onnavigate([item.id])} {item}>
    <ChevronRightIcon class="ml-auto" />
  </SettingsItemContainer>
{/if}
