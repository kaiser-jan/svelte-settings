<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import SettingsItemContainer from '../ui/SettingsItemContainer.svelte'
  import type { Setting } from '$lib/types.js'
  import type { PropsFor } from '$lib/registry.js'

  let props: PropsFor<Setting<'description'>> = $props()
  let { item } = props
  const options = getOptionsContext()
</script>

<SettingsItemContainer {...props}>
  <p class="mx-2 text-start">
    {@html item.text}
  </p>
</SettingsItemContainer>
