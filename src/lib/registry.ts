import type { Component, Snippet } from 'svelte'

import type { Setting, SettingsBlueprintItem, SettingType } from './types.js'

import Page from './components/Page.svelte'

import ChangelogPage from './components/pages/ChangelogPage.svelte'
import ListPage from './components/pages/ListPage.svelte'
import ItemListSettingPage from './components/pages/ItemListPage.svelte'
import ItemListSubPage from './components/pages/ItemListSubPage.svelte'
import VariantListSubPage from './components/pages/VariantListSubPage.svelte'

import InputItem from './components/items/InputItem.svelte'
import ActionItem from './components/items/ActionItem.svelte'
import DescriptionItem from './components/items/DescriptionItem.svelte'
import PageItem from './components/items/PageItem.svelte'
import NotImplementedItem from './components/items/NotImplementedItem.svelte'
import ValueDisplayItem from './components/items/ValueDisplayItem.svelte'

import GroupWrapper from './components/wrappers/GroupWrapper.svelte'

import BooleanInput from './components/inputs/BooleanInput.svelte'
import IconInput from './components/inputs/IconInput.svelte'
import ColorInput from './components/inputs/ColorInput.svelte'
import SelectInput from './components/inputs/SelectInput.svelte'
import NumberInput from './components/inputs/NumberInput.svelte'
import BooleanGroupInput from './components/inputs/BooleanGroupInput.svelte'
import ListInput from './components/inputs/ListInput.svelte'
import TextInput from './components/inputs/TextInput.svelte'

const components = {
  input: {
    boolean: BooleanInput,
    'boolean-group': BooleanGroupInput,
    number: NumberInput,
    text: TextInput,
    icon: IconInput,
    color: ColorInput,
    select: SelectInput,
    list: ListInput,
  },

  page: {
    changelog: ChangelogPage,
    list: ListPage,
    'item-list': ItemListSettingPage,
    'variant-list': ItemListSettingPage,
    page: Page,
  },

  subpage: {
    'item-list': ItemListSubPage,
    'variant-list': VariantListSubPage,
  },

  item: {
    action: ActionItem,
    description: DescriptionItem,
    value: ValueDisplayItem,
    'not-implemented': NotImplementedItem,
  },

  wrapper: {
    group: GroupWrapper,
  },
} as const satisfies Record<string, Partial<Record<SettingType, SettingComponent>>>

export function getInputComponent(type: keyof (typeof components)['input']): SettingComponent {
  return components.input[type]
}
export function getPageComponent(type: keyof (typeof components)['page']): SettingComponent {
  return components.page[type]
}
export function getSubpageComponent(type: keyof (typeof components)['subpage']): SettingComponent {
  return components.subpage[type]
}
export function getItemComponent(item: SettingsBlueprintItem): SettingComponent {
  if (item.type in components.input) return InputItem
  if (item.type in components.item) return components.item[item.type as keyof typeof components.item]
  if (isWrapper(item)) return components.wrapper[item.type as keyof typeof components.wrapper]
  return PageItem
}

export function isPage(item: SettingsBlueprintItem): item is SettingWith<'page'> {
  return item.type in components.page
}
export function isSubpage(item: SettingsBlueprintItem): item is SettingWith<'subpage'> {
  return item.type in components.subpage
}
export function isWrapper(item: SettingsBlueprintItem): boolean {
  return item.type in components.wrapper
}

type SettingComponent = Component<PropsFor<Setting<any>>, {}, ''>

export type SettingHaving<K extends keyof typeof components> = keyof (typeof components)[K] & SettingType

export type SettingWith<K extends keyof typeof components> =
  SettingHaving<K> extends infer T ? (T extends SettingType ? Setting<T> : never) : never

export type PropsFor<S extends Setting<SettingType>, F = unknown> = {
  item: S
  value: S extends { default: infer D } ? D : F
  wasChanged: boolean
  header: Snippet
  onchange: (v: S extends { default: infer D } ? D : F) => void
  onnavigate: (path: string[]) => void
  path: readonly string[]
}
