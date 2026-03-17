<script lang="ts">
  import { getItemComponent, type PropsFor } from '$lib/registry.js'
  import { getOptionsContext, getSettingsContext } from '$lib/context.js'
  import { Trash2Icon } from '@lucide/svelte'
  import type { Setting, SettingsBlueprintItem } from '$lib/types.js'

  let { path: parentPath, item, header, ...props }: PropsFor<Setting<'item-list'>> = $props()

  const settings = getSettingsContext()
  const options = getOptionsContext()
  const { Button } = options.components
</script>

{@render header()}

{#each item.children as child (child.id)}
  {@const ItemComponent = getItemComponent(child as SettingsBlueprintItem)}
  {#if !child.visible || child.visible($settings)}
    <ItemComponent path={[...parentPath, child.id]} item={child} />
  {/if}
{/each}
