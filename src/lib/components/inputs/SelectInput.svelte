<script lang="ts">
  import type { SelectSetting } from '$lib/types.js'
  import { toReadable } from '$lib/utils/stores.js'
  import { getOptionsContext } from '$lib/context.js'

  interface Props {
    item: SelectSetting
    value: string | undefined
    onchange: (v: string) => void
  }

  let { item, value, onchange }: Props = $props()
  const options = getOptionsContext()
  const { Select } = options.components

  let disabled = toReadable(item.disabled)

  let selectedOption = $derived(item.options.find((o) => o.id === value))
</script>

<Select.Root
  type="single"
  {value}
  onValueChange={(v) => {
    const selectedOption = item.options.find((o) => o.id === v)
    if (!selectedOption) return
    value = selectedOption.id
    onchange(value)
  }}
  disabled={$disabled}
>
  <Select.Trigger>
    {#if selectedOption}
      {#if selectedOption.icon}
        <selectedOption.icon />
      {/if}
      {selectedOption.label ?? selectedOption.id}
    {:else}
      Click to select
    {/if}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      {#each item.options as option (option)}
        <Select.Item value={option.id} label={option.label}>
          <option.icon />
          {option.label ?? option.id}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
