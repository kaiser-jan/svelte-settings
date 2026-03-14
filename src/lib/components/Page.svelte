<script lang="ts">
  import { getItemComponent, type PropsFor, type SettingWith } from '$lib/registry.js'
  import { getSettingsContext } from '$lib/context.js'
  import type { Setting } from '$lib/types.js'

  let { path: parentPath, item, onnavigate, ...props }: PropsFor<Setting<'page'>> = $props()

  const settings = getSettingsContext()
</script>

{#each item.children as child (child.id)}
  {@const ItemComponent = getItemComponent(child)}
  {#if !child.visible || child.visible($settings)}
    <ItemComponent path={[...parentPath, child.id]} item={child} {onnavigate} {...props} />
  {/if}
{/each}
