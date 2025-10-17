<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import type { DescriptionItem } from '$lib/types.js'
  import { cn } from '$lib/utils.js'
  import SettingsItemContainer from '../ui/SettingsItemContainer.svelte'

  interface Props {
    item: DescriptionItem
  }

  let { item }: Props = $props()
  const options = getOptionsContext()
</script>

<SettingsItemContainer {item}>
  <p>
    {@html item.text}
  </p>
</SettingsItemContainer>
