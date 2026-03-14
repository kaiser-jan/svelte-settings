<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import SettingsItemContainer from '../ui/SettingsItemContainer.svelte'
  import type { Setting } from '$lib/types.js'
  import type { PropsFor } from '$lib/registry.js'

  let { item }: PropsFor<Setting<'description'>> = $props()
  const options = getOptionsContext()
</script>

<SettingsItemContainer {item}>
  <p>
    {@html item.text}
  </p>
</SettingsItemContainer>
