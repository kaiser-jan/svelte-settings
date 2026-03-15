<script lang="ts">
  import { getItemComponent, type PropsFor, type SettingWith } from '$lib/registry.js'
  import { getSettingsContext } from '$lib/context.js'
  import type { Setting } from '$lib/types.js'

  let props: PropsFor<Setting<'page'>> = $props()
  let { path: parentPath, item, onnavigate, header } = props

  const settings = getSettingsContext()
</script>

{@render header()}

{#each item.children as child (child.id)}
  {@const ItemComponent = getItemComponent(child)}
  {#if !child.visible || child.visible($settings)}
    <ItemComponent {...props} path={[...parentPath, child.id]} item={child} />
  {/if}
{/each}
