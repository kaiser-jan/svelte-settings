<script lang="ts">
  import { LockIcon } from '@lucide/svelte'
  import SettingsItemContainer from '../ui/SettingsItemContainer.svelte'
  import type { Setting } from '$lib/types.js'
  import type { PropsFor } from '$lib/registry.js'

  let props: PropsFor<Setting<'not-implemented'>> = $props()
</script>

<SettingsItemContainer {...props} class="text-muted-foreground">
  <LockIcon />
</SettingsItemContainer>
