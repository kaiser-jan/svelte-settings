<script lang="ts">
  import { getItemComponent } from '$lib/registry.js'
  import { getOptionsContext, getSettingsContext } from '$lib/context.js'
  import { Trash2Icon } from '@lucide/svelte'
  import type { ItemListSetting } from '$lib/types.js'

  interface Props {
    path: string[]
    item: ItemListSetting
    onnavigate: (target: string[], replace?: boolean) => void
    onchange: (v: unknown) => void
  }

  let { path: parentPath, item, onnavigate, onchange }: Props = $props()

  const settings = getSettingsContext()
  const options = getOptionsContext()
  const { Button } = options.components
</script>

{#each item.children as child (child.id)}
  {@const ItemComponent = getItemComponent(child)}
  {#if !child.visible || child.visible($settings)}
    <ItemComponent path={[...parentPath, child.id]} item={child} {onnavigate} />
  {/if}
{/each}

<Button
  variant="destructive"
  class="mt-auto"
  onclick={() => {
    onchange(undefined)
    // TODO: merge with other navigation
    history.back()
  }}
>
  <Trash2Icon />
  Delete {item.itemLabel ?? 'Item'}
</Button>
