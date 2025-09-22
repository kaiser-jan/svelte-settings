<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import { getOptionsContext } from '$lib/context.js'
  import type { BasePage } from '$lib/types'
  import { ChevronRightIcon } from '@lucide/svelte'

  interface Props {
    path: string[]
    item: BasePage
    onnavigate: (target: string[]) => void
  }

  let { path, item, onnavigate }: Props = $props()

  const options = getOptionsContext()
</script>

<Button
  variant={options.style.button.category}
  onclick={() => onnavigate([item.id])}
  class="min-h-12 justify-between gap-3 text-base! font-medium"
>
  <item.icon />
  {item.label}
  <ChevronRightIcon class="ml-auto" />
</Button>
