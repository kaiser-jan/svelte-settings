<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import type { Setting } from '$lib/types.js'
  import SettingsItemContainer from '../ui/SettingsItemContainer.svelte'

  interface Props {
    item: Setting<'description'>
  }

  let { item }: Props = $props()
  const options = getOptionsContext()
</script>

<SettingsItemContainer {item}>
  <p>
    {@html item.text}
  </p>
</SettingsItemContainer>
