<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import type { Item } from '$lib/types/ui.js'

  interface Props {
    options: readonly Item[]
    value: string | undefined
    disabled?: boolean
    onchange: (v: string) => void
  }

  let { options: itemOptions, disabled, value, onchange }: Props = $props()
  const options = getOptionsContext()
  const { Select } = options.components

  let selectedOption = $derived(itemOptions.find((o) => o.id === value))
</script>

<Select.Root
  type="single"
  {value}
  onValueChange={(v) => {
    const selectedOption = itemOptions.find((o) => o.id === v)
    if (!selectedOption) return
    value = selectedOption.id
    onchange(value)
  }}
  {disabled}
>
  <Select.Trigger>
    {#if selectedOption}
      {#if selectedOption.icon}
        <selectedOption.icon class="text-text" />
      {/if}
      {selectedOption.label ?? selectedOption.id}
    {:else}
      Click to select
    {/if}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      {#each itemOptions as option (option.id)}
        <Select.Item value={option.id} label={option.label}>
          <option.icon />
          {option.label ?? option.id}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
