<script lang="ts">
  import { getOptionsContext } from '$lib/context.js'
  import { CheckIcon, ChevronsUpDownIcon } from '@lucide/svelte'
  import { cn } from '$lib/utils.js'
  import { tick } from 'svelte'
  import type { Item } from '$lib/types/ui.js'

  interface Props {
    options: readonly Item[]
    value: string | undefined
    itemLabel?: string
    disabled?: boolean
    onchange: (v: string) => void
  }

  let { options: itemOptions, disabled, itemLabel, value, onchange }: Props = $props()
  const options = getOptionsContext()
  const { Popover, Button, Command } = options.components

  const ensuredItemLabel = itemLabel?.toLowerCase() ?? 'item'
  let selectedOption = $derived(itemOptions.find((o) => o.id === value))

  let open = $state(false)
  let triggerRef = $state<HTMLButtonElement>(null!)

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger() {
    open = false
    tick().then(() => {
      triggerRef.focus()
    })
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="outline"
        class="w-[200px] justify-between"
        role="combobox"
        aria-expanded={open}
        {disabled}
      >
        {#if selectedOption}
          {#if selectedOption.icon}
            <selectedOption.icon />
          {/if}
          {selectedOption.label ?? selectedOption.id}
        {:else}
          Select {ensuredItemLabel}...
        {/if}
        <ChevronsUpDownIcon class="ml-auto opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input placeholder={`Search for ${ensuredItemLabel}...`} />
      <Command.List>
        <Command.Empty>No {ensuredItemLabel} found.</Command.Empty>
        <Command.Group value="frameworks">
          {#each itemOptions as option (option.id)}
            <Command.Item
              value={option.id}
              onSelect={() => {
                value = option.id
                onchange(value)
                closeAndFocusTrigger()
              }}
            >
              <option.icon class="mr-0" />
              {option.label ?? option.id}

              <CheckIcon class={cn(value !== option.id && 'text-transparent', 'ml-auto')} />
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
