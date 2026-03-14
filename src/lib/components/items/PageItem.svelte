<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import { ChevronRightIcon } from '@lucide/svelte'
  import SettingsItemContainer from '../ui/SettingsItemContainer.svelte'
  import type { Setting } from '$lib/types.js'

  interface Props {
    path: string[]
    item: Setting<'page'>
    onnavigate: (target: string[]) => void
  }

  let { path, item, onnavigate }: Props = $props()

  const options = getOptionsContext()
</script>

<SettingsItemContainer variant={options.style.button.category} onclick={() => onnavigate([item.id])} {item}>
  <ChevronRightIcon class="ml-auto" />
</SettingsItemContainer>
