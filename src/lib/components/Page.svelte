<script lang="ts">
  import { getItemComponent, type SettingWith } from '$lib/registry.js'
  import { getSettingsContext } from '$lib/context.js'
  import type { Setting } from '$lib/types.js'

  interface Props {
    path: string[]
    item: Setting<'page'>
    onnavigate: (target: string[], replace?: boolean) => void
  }

  let { path: parentPath, item, onnavigate }: Props = $props()

  const settings = getSettingsContext()
</script>

{#each item.children as child (child.id)}
  {@const ItemComponent = getItemComponent(child)}
  {#if !child.visible || child.visible($settings)}
    <ItemComponent path={[...parentPath, child.id]} item={child} {onnavigate} />
  {/if}
{/each}
