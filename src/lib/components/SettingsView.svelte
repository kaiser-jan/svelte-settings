<script lang="ts">
  import type { ConfigItem, SettingsPage } from '../types'
  import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js'
  import { useSwipe, type SwipeCustomEvent } from 'svelte-gestures'
  import { SettingsIcon } from '@lucide/svelte'
  import { onMount, setContext } from 'svelte'
  import { pushState, replaceState } from '$app/navigation'
  import { page } from '$app/state'
  import { getPageComponent, isWrapper } from '../registry'
  import { debounce, throttle } from '$lib/utils/common'
  import ItemPageRenderer from './pages/ItemPageRenderer.svelte'
  import type { InitializedSettings } from '..'
  import { setSettingsContext } from '../context'
  import { get } from 'svelte/store'
  import { queryParam, ssp } from 'sveltekit-search-params'
  import { setOptionsContext } from '$lib/context.js'

  interface Props {
    settings: InitializedSettings
  }

  let { settings }: Props = $props()

  setSettingsContext(settings)
  setOptionsContext(settings.options)

  const settingsPath = queryParam<string[]>('settings-path', ssp.array())

  type Page = SettingsPage & { path: readonly string[] }

  const BASE_PAGE = {
    id: 'settings',
    type: 'page',
    label: 'Settings',
    icon: SettingsIcon,
    children: settings.blueprint,
    path: [],
  } as const

  let pages: Page[] = $derived.by(() => {
    let _pages: Page[] = [BASE_PAGE]

    if (!$settingsPath) return []

    for (const [index, key] of $settingsPath.entries()) {
      const lastPage = _pages[_pages.length - 1]
      if (!('children' in lastPage)) {
        return _pages
      }

      // the childPage could also be part of a ListSetting, which has no children
      let childPage = lastPage.children.find((p) => p.id === key) as SettingsPage

      // HACK: this is a child of a nested setting (e.g. ListSetting) so we make it a page so it displays its properties given by the parent
      if (!childPage) {
        const values = settings.readSetting($settingsPath.slice(0, index)).value as Record<string, unknown>[]
        const hasName =
          values &&
          'nameProperty' in lastPage &&
          lastPage.nameProperty &&
          lastPage.nameProperty in values[parseInt(key)]
        let label = hasName ? (values[parseInt(key)][lastPage.nameProperty] as string) : key

        childPage = {
          ...lastPage,
          id: key,
          label,
          type: 'page',
        } as SettingsPage
      }

      _pages.push({ ...childPage, path: $settingsPath.slice(0, index + 1) })
    }

    return _pages
  })

  function navigateToPath(additionalPath: string[]) {
    console.log(additionalPath)
    const newPath = [...(get(settingsPath) ?? []), ...additionalPath]
    settingsPath.set(newPath)
    console.info(newPath)
  }

  const navigateToPathThrottled = throttle(navigateToPath, 200)

  let scrollContainer: HTMLDivElement
  let test = $state<string>()

  $effect(() => {
    if (pages.length) {
      updateScroll()
    }
  })

  function updateScroll() {
    let gap = parseInt(getComputedStyle(scrollContainer).gap, 10)
    if (isNaN(gap)) gap = 0
    scrollContainer.style.left =
      -1 * (pages.length - 1) * (scrollContainer.parentElement!.getBoundingClientRect().width + gap) + 'px'
    test = `${gap} ${scrollContainer.parentElement?.getBoundingClientRect().width}`
  }

  function handleSwipe(event: SwipeCustomEvent) {
    switch (event.detail.direction) {
      case 'right':
        history.back()
        break
      case 'left':
        history.forward()
        break
    }
  }

  onMount(() => {
    window.addEventListener('resize', updateScroll)

    return () => {
      window.removeEventListener('resize', updateScroll)
    }
  })
</script>

<!-- <FailSafeContainer name="Settings" class="flex min-h-0 grow flex-col gap-4 overflow-x-visible p-4 pb-0"> -->
<Breadcrumb.Root>
  <Breadcrumb.List>
    {#each pages as settingsPage, index (settingsPage.id)}
      {#if index !== 0}
        <Breadcrumb.Separator />
      {/if}
      <Breadcrumb.Item>
        <Breadcrumb.Link
          onclick={async () => {
            const currentLength = get(settingsPath)?.length ?? 0
            const targetLength = settingsPage.path.length
            let moveBackBy = currentLength - targetLength

            // NOTE: wrappers are not added to history
            for (let i = targetLength - 1; i <= currentLength - 1; i++) {
              if (pages[i] && isWrapper(pages[i]) && i !== targetLength) moveBackBy -= 1
            }

            // avoid reloading
            if (moveBackBy === 0) return
            history.go(-moveBackBy)
          }}>{settingsPage.label}</Breadcrumb.Link
        >
      </Breadcrumb.Item>
    {/each}
  </Breadcrumb.List>
</Breadcrumb.Root>

<!-- {path} -->
<!-- <br /> -->
<!-- {pages.map((p) => p.path).join(';')} -->

<div
  class="relative grow"
  {...useSwipe(handleSwipe, () => ({ timeframe: 300, minSwipeDistance: 30, touchAction: 'pan-y' }))}
>
  <div
    class="absolute flex h-full w-full flex-row gap-6 transition-all duration-300 ease-in-out"
    bind:this={scrollContainer}
  >
    {#each pages as settingsPage, i (settingsPage.id)}
      {@const PageComponent = getPageComponent(settingsPage.type) ?? ItemPageRenderer}
      <div
        class="flex h-full w-full shrink-0 flex-col gap-2 overflow-hidden overflow-y-auto"
        class:pointer-events-none={i !== pages.length - 1}
      >
        <PageComponent
          item={settingsPage}
          path={(get(settingsPath) ?? []).slice(0, i)}
          value={settings.readSetting(settingsPage.path).value as Record<string, unknown>[]}
          onnavigate={navigateToPathThrottled}
          onchange={(v) => {
            if ($settingsPath) settings.writeSetting($settingsPath, v)
          }}
        />
      </div>
    {/each}
  </div>
</div>
<!-- </FailSafeContainer> -->
