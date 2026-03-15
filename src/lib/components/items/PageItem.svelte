<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import { ChevronRightIcon } from '@lucide/svelte'
  import SettingsItemContainer from '../ui/SettingsItemContainer.svelte'
  import type { Setting } from '$lib/types.js'
  import type { PropsFor } from '$lib/registry.js'

  let { path, item, onnavigate }: PropsFor<Setting<'page'>> = $props()

  const options = getOptionsContext()
</script>

<SettingsItemContainer variant={options.style.button.category} onclick={() => onnavigate([item.id])} {item} clickable>
  <ChevronRightIcon class="ml-auto" />
</SettingsItemContainer>
