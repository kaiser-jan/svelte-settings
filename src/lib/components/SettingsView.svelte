<script lang="ts">
  import type { SettingsPage } from '$lib/types.js'
  import { useSwipe, type SwipeCustomEvent } from 'svelte-gestures'
  import { SettingsIcon } from '@lucide/svelte'
  import { onMount } from 'svelte'
  import { getPageComponent, getSubpageComponent, isSubpage, isWrapper } from '$lib/registry.js'
  import { throttle } from '$lib/utils/common.js'
  import ItemPageRenderer from './pages/ItemPageRenderer.svelte'
  import type { InitializedSettings } from '$lib/index.js'
  import { setSettingsContext } from '$lib/context.js'
  import { get } from 'svelte/store'
  import { queryParam, ssp } from 'sveltekit-search-params'
  import { setOptionsContext } from '$lib/context.js'

  interface Props {
    settings: InitializedSettings
  }

  let { settings }: Props = $props()

  const settingsPath = queryParam<string[]>('settings-path', ssp.array())

  setSettingsContext(settings)
  setOptionsContext(settings.options)
  const { Breadcrumb } = settings.options.components

  type Page = SettingsPage & { path: readonly string[]; isSubpage?: boolean }

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

      // TODO: unify with list setting; make more readable
      if (isSubpage(lastPage)) {
        const parentValue = settings.readSetting($settingsPath.slice(0, index)).value as Record<string, unknown>
        const value = parentValue[$settingsPath[index]] as Record<string, unknown>
        let page = {
          ...lastPage,
          id: key,
          label: value?.['label'] ?? key,
          isSubpage: true,
          path: $settingsPath.slice(0, index + 1),
        }

        const override = lastPage.childItemsCallback(lastPage, parentValue, key)
        if (override) {
          page = {
            ...page,
            ...override,
            // type: 'page',
            isSubpage: false,
          }
        }
        _pages.push(page)
        continue
      }

      if (!('children' in lastPage)) {
        settingsPath.set($settingsPath.slice(0, index))
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

  function openSubpath(additionalPath: string[]) {
    const newPath = [...(get(settingsPath) ?? []), ...additionalPath]
    settingsPath.set(newPath)
  }

  /** Disable navigation while animating to the next page */
  const openSubpathThrottled = throttle(openSubpath, 200)

  let scrollContainer: HTMLDivElement

  $effect(() => {
    if (pages.length) {
      updateScroll()
    }
  })

  function updateScroll() {
    const gap = parseInt(getComputedStyle(scrollContainer).gap, 10) || 0
    const pageWidth = scrollContainer.parentElement!.getBoundingClientRect().width + gap
    scrollContainer.style.left = `${-1 * (pages.length - 1) * pageWidth}px`
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

  async function navigateToPage(page: Page) {
    const currentLength = get(settingsPath)?.length ?? 0
    const targetLength = page.path.length
    let moveBackBy = currentLength - targetLength

    // NOTE: wrappers are not added to history
    for (let i = targetLength - 1; i <= currentLength - 1; i++) {
      if (pages[i] && isWrapper(pages[i]) && i !== targetLength) moveBackBy -= 1
    }

    // avoid reloading
    if (moveBackBy === 0) return
    history.go(-moveBackBy)
  }

  onMount(() => {
    window.addEventListener('resize', updateScroll)

    return () => {
      window.removeEventListener('resize', updateScroll)
    }
  })
</script>

<Breadcrumb.Root>
  <Breadcrumb.List>
    {#each pages as settingsPage, index (settingsPage.id)}
      {#if index !== 0}
        <Breadcrumb.Separator />
      {/if}
      <Breadcrumb.Item>
        <Breadcrumb.Link onclick={() => navigateToPage(settingsPage)}>
          {settingsPage.label}
        </Breadcrumb.Link>
      </Breadcrumb.Item>
    {/each}
  </Breadcrumb.List>
</Breadcrumb.Root>

<div
  class="relative grow"
  {...useSwipe(handleSwipe, () => ({ timeframe: 300, minSwipeDistance: 30, touchAction: 'pan-y' }))}
>
  <div
    class="absolute flex h-full w-full flex-row gap-6 transition-all duration-300 ease-in-out"
    bind:this={scrollContainer}
  >
    {#each pages as settingsPage, i (settingsPage.id)}
      {@const value = settings.readSetting(settingsPage.path)}
      {@const PageComponent =
        (settingsPage.isSubpage ? getSubpageComponent(settingsPage.type) : getPageComponent(settingsPage.type)) ??
        ItemPageRenderer}
      <div
        class="flex h-full w-full shrink-0 flex-col gap-2 overflow-hidden overflow-y-auto"
        class:pointer-events-none={i !== pages.length - 1}
      >
        <PageComponent
          item={settingsPage}
          path={(get(settingsPath) ?? []).slice(0, i)}
          value={value.value}
          wasChanged={value.changed}
          onnavigate={openSubpathThrottled}
          onchange={(v) => {
            if ($settingsPath) settings.writeSetting($settingsPath, v)
          }}
        />
      </div>
    {/each}
  </div>
</div>
