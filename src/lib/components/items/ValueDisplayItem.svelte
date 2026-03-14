<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import { toReadable } from '$lib/utils/stores.js'
  import { ExternalLinkIcon } from '@lucide/svelte'
  import SettingsItemContainer from '../ui/SettingsItemContainer.svelte'
  import type { Setting } from '$lib/types.js'
  import type { PropsFor } from '$lib/registry.js'

  let { item }: PropsFor<Setting<'value'>> = $props()
  const options = getOptionsContext()

  let value = $derived(toReadable(item.value))
</script>

<SettingsItemContainer {item} href={item.url} target="_blank" clickable variant={options.style.button.category}>
  <span class="ml-auto">{$value}</span>

  {#if item.url}
    <ExternalLinkIcon class="text-text-muted" />
  {/if}
</SettingsItemContainer>
