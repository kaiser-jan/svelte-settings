<script lang="ts">
  import { getOptionsContext, getSettingsContext } from '$lib/context.js'
  import { ChevronRightIcon } from '@lucide/svelte'
  import SettingsItemContainer from '../ui/SettingsItemContainer.svelte'
  import type { Setting } from '$lib/types.js'
  import { getPageComponent, type PropsFor } from '$lib/registry.js'
  import { getDeep } from '$lib/utils/deep.js'

  let { item, onnavigate, ...props }: PropsFor<Setting<'page'>> = $props()

  const options = getOptionsContext()
  const settings = getSettingsContext()
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
      onchange={(v) => settings.writeSetting(props.path, v)}
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
  <SettingsItemContainer variant={options.style.button.category} onclick={() => onnavigate([item.id])} {item}>
    <ChevronRightIcon class="ml-auto" />
  </SettingsItemContainer>
{/if}
