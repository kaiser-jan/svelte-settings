<script lang="ts">
  import { LockIcon } from '@lucide/svelte'
  import SettingsItemContainer from '../ui/SettingsItemContainer.svelte'
  import type { Setting } from '$lib/types.js'

  interface Props {
    item: Setting<'not-implemented'>
  }

  let { item }: Props = $props()
</script>

<SettingsItemContainer {item} class="text-muted-foreground">
  <LockIcon />
</SettingsItemContainer>
