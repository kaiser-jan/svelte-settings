<script lang="ts">
  import { CircleCheckIcon, CircleXIcon } from '@lucide/svelte'
  import type { ActionItem } from '$lib/types.js'
  import { toReadable } from '$lib/utils/stores.js'
  import { getOptionsContext } from '$lib/context.js'
  import SettingsItemContainer from '../ui/SettingsItemContainer.svelte'

  interface Props {
    item: ActionItem
  }

  let { item }: Props = $props()

  const options = getOptionsContext()
  const { Button, LoaderPulsatingRing } = options.components

  let disabled = $derived(toReadable(item.disabled))

  let promise = $state<Promise<unknown>>()
  let loading = $state(false)

  const STATE_RESET_TIMEOUT = 3000
  let promiseResetTimeout: ReturnType<typeof setTimeout> | undefined = undefined

  $effect(() => {
    if (promise) loading = true

    promise?.then((_) => {
      clearTimeout(promiseResetTimeout)
      loading = false

      setTimeout(() => {
        promise = undefined
      }, STATE_RESET_TIMEOUT)
    })
  })
</script>

<SettingsItemContainer
  {item}
  clickable
  hideLabel
  variant={item.variant ?? options.style.button.action}
  disabled={loading || $disabled}
  onclick={() => {
    promise = Promise.resolve(item.action()) as Promise<unknown>
  }}
>
  <span class="flex flex-row items-center gap-3">
    {#if promise}
      {#await promise}
        <LoaderPulsatingRing className="size-4" />
      {:then}
        <CircleCheckIcon />
      {:catch}
        <CircleXIcon />
      {/await}
    {:else}
      <item.icon />
    {/if}

    {item.label}
  </span>
</SettingsItemContainer>
