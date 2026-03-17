<script lang="ts">
  import type { Setting } from '$lib/types.js'
  import type { PropsFor } from '$lib/registry.js'
  import { PlusIcon } from '@lucide/svelte'

  let { value, path, onchange }: PropsFor<Setting<'color'>> = $props()
</script>

<label
  for={path.join('_')}
  class="flex h-8 w-8 items-center justify-center rounded-sm border border-input"
  class:bg-transparent={value === undefined}
  style="background-color: {value}"
  aria-label="colorpicker"
>
  {#if !value}
    <PlusIcon class="opacity-75" />
  {/if}
</label>

<input
  type="color"
  id={path.join('_')}
  {value}
  oninput={(e) => {
    if (e.currentTarget.value) onchange(e.currentTarget.value)
  }}
  class="sr-only"
/>
