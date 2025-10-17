<script lang="ts" module>
  import { type WithElementRef } from '$lib/utils.js'
  import type { HTMLAnchorAttributes, HTMLAttributes } from 'svelte/elements'

  type DivProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & WithElementRef<HTMLAnchorAttributes>
</script>

<script lang="ts">
  let { children, ...props }: DivProps = $props()
</script>

<div {...props}>
  {@render children?.()}
</div>
