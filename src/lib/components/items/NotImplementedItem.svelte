<script lang="ts">
  import type { DescriptionItem } from '$lib/types.js'
  import { LockIcon } from '@lucide/svelte'
  import SettingsItemContainer from '../ui/SettingsItemContainer.svelte'

  interface Props {
    item: DescriptionItem
  }

  let { item }: Props = $props()
</script>

<SettingsItemContainer {item} class="text-muted-foreground">
  <LockIcon />
</SettingsItemContainer>
