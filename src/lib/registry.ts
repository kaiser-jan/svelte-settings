import type { Component } from 'svelte'

import type { SettingsBlueprintItem, SettingsInput, SettingsItem, SettingsPage, SettingsWrapper } from './types.js'

import PageRenderer from './components/pages/PageRenderer.svelte'
import ChangelogPage from './components/pages/ChangelogPage.svelte'
import MultiselectReorderSettingPage from './components/pages/MultiselectReorderSettingPage.svelte'
import ListSettingPage from './components/pages/ListSettingPage.svelte'
import ListSubPage from './components/pages/ListSubPage.svelte'
// import VariantListSettingPage from './components/pages/VariantListSettingPage.svelte'
import VariantListSubPage from './components/pages/VariantListSubPage.svelte'

import BasicItemRenderer from './components/items/BasicItemRenderer.svelte'
import ActionItem from './components/items/ActionItem.svelte'
import DescriptionItem from './components/items/DescriptionItem.svelte'
import PageItem from './components/items/PageItem.svelte'
import NotImplementedItem from './components/items/NotImplementedItem.svelte'
import ValueDisplayItem from './components/items/ValueDisplayItem.svelte'

import GroupWrapper from './components/wrappers/GroupWrapper.svelte'

import BooleanInput from './components/inputs/BooleanInput.svelte'
import IconInput from './components/inputs/IconInput.svelte'
import SelectInput from './components/inputs/SelectInput.svelte'
import NumberInput from './components/inputs/NumberInput.svelte'
import MultiSelectInput from './components/inputs/MultiSelectInput.svelte'
import MultiSelectReorderInput from './components/inputs/MultiSelectReorderInput.svelte'
import TextInput from './components/inputs/TextInput.svelte'

// TODO: refine this type; derive from the settings types
type SettingComponentPage = Component<
  {
    item: any
    onnavigate: (path: string[]) => void
    path: readonly string[]
  },
  {},
  ''
>
type SettingComponentInput = Component<
  {
    item: any
    value: any
    wasChanged: boolean
    onchange: (v: any) => void
    onnavigate: (path: string[]) => void
    path: readonly string[]
  },
  {},
  ''
>

// TODO: consider making this a real one-source-of-truth registry, where each component is registered, e.g.
// { key: 'changelog', type: 'page', component: ChangelogPage }

const inputs: Record<SettingsInput['type'], SettingComponentInput> = {
  icon: IconInput,
  select: SelectInput,
  multiselect: MultiSelectInput,
  'multiselect-reorder': MultiSelectReorderInput,
  boolean: BooleanInput,
  number: NumberInput,
  text: TextInput,
}
export function getInputComponent(type: SettingsInput['type']): SettingComponentInput {
  return inputs[type]
}
export function isInput(item: SettingsBlueprintItem): item is SettingsInput {
  return item.type in inputs
}

const pages: Record<SettingsPage['type'], SettingComponentPage> = {
  changelog: ChangelogPage,
  list: ListSettingPage,
  'variant-list': ListSettingPage,
  'multiselect-reorder': MultiselectReorderSettingPage,
  page: PageRenderer,
}
export function getPageComponent(type: SettingsPage['type']): SettingComponentPage {
  return pages[type]
}
export function isPage(item: SettingsBlueprintItem): item is SettingsPage {
  return item.type in pages
}

const subpages: Record<string, SettingComponentPage> = {
  list: ListSubPage,
  'variant-list': VariantListSubPage,
}
export function getSubpageComponent(type: SettingsPage['type']): SettingComponentPage {
  return subpages[type]
}
export function isSubpage(item: SettingsBlueprintItem): boolean {
  return item.type in subpages
}

const items: Record<SettingsItem['type'], SettingComponentInput> = {
  action: ActionItem,
  description: DescriptionItem,
  value: ValueDisplayItem,
  'not-implemented': NotImplementedItem,
}
export function getItemComponent(item: SettingsBlueprintItem): SettingComponentInput | SettingComponentPage {
  if (isInput(item)) return BasicItemRenderer
  if (isItem(item)) return items[item.type]
  if (isWrapper(item)) return wrappers[item.type]
  return PageItem

  console.error('Settings item with unknown type: ', item)
  return NotImplementedItem
}
export function isItem(item: SettingsBlueprintItem): item is SettingsItem {
  return item.type in items
}

const wrappers: Record<SettingsWrapper['type'], SettingComponentPage> = {
  group: GroupWrapper,
}
export function isWrapper(item: SettingsBlueprintItem): item is SettingsWrapper {
  return item.type in wrappers
}
