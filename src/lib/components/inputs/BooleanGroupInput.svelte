<script lang="ts">
  import { toReadable } from '$lib/utils/stores.js'
  import { getOptionsContext } from '$lib/context.js'
  import type { Setting } from '$lib/types.js'

  interface Props {
    item: Setting<'boolean-group'>
    value: string[]
    onchange: (v: string[]) => void
  }

  let { item, value, onchange }: Props = $props()
  const options = getOptionsContext()
  const { Checkbox, Label } = options.components

  let disabled = toReadable(item.disabled)
</script>

<div class="flex flex-col gap-1">
  {#each item.options as option (option)}
    <div class="flex flex-row items-center gap-2">
      <Checkbox
        id={option}
        disabled={$disabled}
        bind:checked={
          () => value.includes(option),
          (v) => {
            const index = value.indexOf(option)
            if (v && index === -1) value.push(option)
            else if (!v && index !== -1) value.splice(index, 1)
            value = value
            onchange($state.snapshot(value))
          }
        }
      />

      <Label for={option} class="leading-5">{item.labels?.[option] ?? option}</Label>
    </div>
  {/each}
</div>
