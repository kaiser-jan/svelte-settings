<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import type { DescriptionItem } from '$lib/types.js'
  import { cn } from '$lib/utils.js'

  interface Props {
    item: DescriptionItem
  }

  let { item }: Props = $props()
  const options = getOptionsContext()
</script>

<p
  class={cn(
    options.style.category.classes,
    'h-fit justify-start rounded-md border bg-transparent px-3 py-2 whitespace-normal ',
  )}
>
  {@html item.text}
</p>
