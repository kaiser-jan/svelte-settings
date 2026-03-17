<script lang="ts">
  import type { Setting } from '$lib/types.js'
  import type { PropsFor } from '$lib/registry.js'
  import { PlusIcon } from '@lucide/svelte'

  let props: PropsFor<Setting<'color'>> = $props()
  let { value, onchange } = props
</script>

<label
  for={props.path.join('_')}
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
  id={props.path.join('_')}
  {value}
  oninput={(e) => {
    e.currentTarget.value && onchange(e.currentTarget.value)
  }}
  class="sr-only"
/>
