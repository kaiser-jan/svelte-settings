<script lang="ts">
  import { useSwipe, type SwipeCustomEvent } from 'svelte-gestures'
  import { ChevronRightIcon, SettingsIcon } from '@lucide/svelte'
  import { onMount } from 'svelte'
  import {
    getPageComponent,
    getSubpageComponent,
    isSubpage as hasSubpage,
    isWrapper,
    type SettingWith,
  } from '$lib/registry.js'
  import { throttle } from '$lib/utils/common.js'
  import type { InitializedSettings } from '$lib/index.js'
  import { setSettingsContext } from '$lib/context.js'
  import { get } from 'svelte/store'
  import { queryParam, ssp } from 'sveltekit-search-params'
  import { setOptionsContext } from '$lib/context.js'
  import type { Setting } from '$lib/types.js'
  import { lucideIcons } from '$lib/utils/icons.js'

  interface Props {
    settings: InitializedSettings
  }

  let { settings }: Props = $props()

  const settingsPath = queryParam<string[]>('settings-path', ssp.array())

  setSettingsContext(settings)
  setOptionsContext(settings.options)

  const { Breadcrumb } = settings.options.components

  type Page = SettingWith<'page'> & { path: readonly string[]; isSubpage?: boolean }

  const BASE_PAGE = {
    id: 'settings',
    type: 'page',
    label: 'Settings',
    icon: SettingsIcon,
    children: settings.blueprint,
    path: [],
  } as const

  /**
   * For a variant-list, the subpage needs to be overridden.
   * The items depend on the `type` selected in the parent.
   * Based on that, the corresponding items are derived for the subpage.
   */
  function getVariantListSubpageOverride(parentPage: Page, path: string[]) {
    const id = path[path.length - 1]
    const parentPath = path.slice(0, -1)
    const parentValue = settings.readSetting(parentPath).value as Record<string, unknown>

    if (parentPage.type !== 'variant-list' || !parentValue || !parentValue[parentPage.typeField]) return {}

    // find the item with the matching type
    const item = parentPage.options.find((i) => i.id === parentValue[parentPage.typeField])

    // from it, get the item we are looking for
    const child = item?.items.find((i) => i.id === id)

    return { ...child, isSubpage: false }
  }

  let pages: Page[] = $derived.by(() => {
    let _pages: Page[] = [BASE_PAGE]

    // rerender on settings change
    // TODO: this is meant for the breadcrumbs, should we split them from pages?
    if (!$settings) return []

    if (!$settingsPath) return []

    for (const [index, key] of $settingsPath.entries()) {
      const parentPage = _pages[_pages.length - 1]
      const path = $settingsPath.slice(0, index + 1)

      /*
       * Handle nested settings (like variant-list and list), which do not have a direct `items` property:
       * The initial page is rendered just fine, but the child-pages need to be contructed manually.
       * The child page derives e.g. its label from the value (list item "ABC" should have this as its title).
       * For a list, no further intervention is required.
       * For a variant-list, even the items of the subpage deped on the value (on the selected type).
       */
      if (hasSubpage(parentPage)) {
        // the page partially depends on the value
        const value = settings.readSetting(path).value

        const page = {
          ...parentPage,
          id: key,
          label: value?.['label'] ?? key,
          icon: value?.['icon'] ? lucideIcons[value.icon] : parentPage.icon,
          isSubpage: true,
          defaultToCopy: undefined,
          ...getVariantListSubpageOverride(parentPage, path),
          path,
        }

        _pages.push(page)
        continue
      }

      // this should not happen, as items without children should be handled above
      if (!('children' in parentPage)) {
        settingsPath.set($settingsPath.slice(0, index))
        return _pages
      }

      let childPage = parentPage.children.find((p) => p.id === key) as Setting<'page'>

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
      if (pages[i] && (isWrapper(pages[i]) || pages[i].inline) && i !== targetLength) moveBackBy -= 1
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
  <Breadcrumb.List class="-mb-2 min-h-5">
    {#each pages.slice(0, -1) as settingsPage, index (settingsPage.id)}
      {#if index !== 0}
        <Breadcrumb.Separator />
      {/if}
      <Breadcrumb.Item>
        <Breadcrumb.Link onclick={() => navigateToPage(settingsPage)} class="inline-flex items-center gap-1">
          {#if settingsPage.icon}
            <!-- svelte-ignore svelte_component_deprecated -->
            <svelte:component this={settingsPage.icon} />
          {/if}
          {settingsPage.label}
        </Breadcrumb.Link>
      </Breadcrumb.Item>
    {/each}
    {#if pages.length > 1}
      <Breadcrumb.Separator />
    {/if}
  </Breadcrumb.List>
</Breadcrumb.Root>

{#snippet header()}
  <h3 class="inline-flex items-center gap-2 text-lg font-bold">
    {#if pages[pages.length - 1].icon}
      <!-- svelte-ignore svelte_component_deprecated -->
      <svelte:component this={pages[pages.length - 1].icon} />
    {/if}
    {pages[pages.length - 1].label}
  </h3>
{/snippet}

<div
  class="relative grow"
  {...useSwipe(handleSwipe, () => ({ timeframe: 300, minSwipeDistance: 30, touchAction: 'pan-y' }))}
>
  <div
    class="absolute flex h-full w-full shrink-0 flex-row gap-6 transition-all duration-250 ease-in-out"
    bind:this={scrollContainer}
  >
    {#each pages as settingsPage, i (settingsPage.id)}
      {@const value = settings.readSetting(settingsPage.path)}
      {@const PageComponent = settingsPage.isSubpage
        ? getSubpageComponent(settingsPage.type)
        : getPageComponent(settingsPage.type)}
      <div
        class="flex h-full w-full shrink-0 flex-col gap-2 overflow-hidden overflow-y-auto"
        class:pointer-events-none={i !== pages.length - 1}
      >
        <PageComponent
          item={settingsPage}
          path={settingsPage.path}
          value={value.value}
          wasChanged={value.changed}
          onnavigate={openSubpathThrottled}
          onchange={(v) => {
            if ($settingsPath) {
              settings.writeSetting(settingsPage.path, v)
            }
          }}
          {header}
        />
      </div>
    {/each}
  </div>
</div>
