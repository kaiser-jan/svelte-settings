<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import type { BasePage } from '$lib/types.js'
  import { ChevronRightIcon } from '@lucide/svelte'
  import SettingsItemContainer from '../ui/SettingsItemContainer.svelte'

  interface Props {
    path: string[]
    item: BasePage
    onnavigate: (target: string[]) => void
  }

  let { path, item, onnavigate }: Props = $props()

  const options = getOptionsContext()
</script>

<SettingsItemContainer variant={options.style.button.category} onclick={() => onnavigate([item.id])} {item}>
  <ChevronRightIcon class="ml-auto" />
</SettingsItemContainer>
