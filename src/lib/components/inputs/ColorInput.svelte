<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import type { Setting } from '$lib/types.js'
  import type { PropsFor } from '$lib/registry.js'
  import { PlusIcon } from '@lucide/svelte'

  let { item, value, onchange }: PropsFor<Setting<'color'>> = $props()

  const options = getOptionsContext()

  let input: HTMLInputElement
</script>

<button
  type="button"
  class="flex h-8 w-8 items-center justify-center rounded-sm border border-input"
  class:bg-transparent={value === undefined}
  style="background-color: {value}"
  onclick={() => input.click()}
  aria-label="colorpicker"
>
  {#if !value}
    <PlusIcon class="opacity-75" />
  {/if}
  <input
    bind:this={input}
    type="color"
    {value}
    oninput={(e) => {
      e.currentTarget.value && onchange(e.currentTarget.value)
    }}
    class="sr-only"
    id={item.id}
  />
</button>
