import type { Icon } from '@lucide/svelte'
import type { Readable } from 'svelte/store'
import type { Changelog } from './types/changelog.js'

// TODO: pass the settings type as ctx
export type VisibilityCallback = (ctx: Record<string, unknown>) => boolean

type BaseConfigItem = {
  id: string
  label: string
  description?: string
  icon?: typeof Icon
  visible?: VisibilityCallback
  disabled?: boolean | Readable<boolean>
  inline?: boolean
  action?: () => any
}

export type TextSetting = BaseConfigItem & {
  type: 'text'
  default: string
  placeholder?: string
}

export type SelectSetting = BaseConfigItem & {
  type: 'select'
  searchable?: boolean
  itemLabel?: string
  options: readonly {
    id: string
    label: string
    icon?: typeof Icon
  }[]
  default: string
}

export type MultiSelectSetting = BaseConfigItem & {
  type: 'boolean-group'
  options: readonly string[]
  labels?: Record<string, string>
  default: string[]
}

export type MultiSelectReorderSetting = BaseConfigItem & {
  type: 'multiselect-reorder'
  options: readonly string[]
  labels?: Record<string, string>
  default: string[]
}

export type BooleanSetting = BaseConfigItem & {
  type: 'boolean'
  default: boolean
}

export type NumberSetting = BaseConfigItem & {
  type: 'number'
  default: number
  min?: number
  max?: number
  step?: number
  unit?: string
}

export type IconSetting = BaseConfigItem & {
  type: 'icon'
}

export type DescriptionItem = BaseConfigItem & {
  type: 'description'
  text: string
}
export type ValueDisplayItem = BaseConfigItem & {
  type: 'value'
  value: string | undefined | Readable<string | undefined> | (() => Promise<string | undefined>)
  url?: string
}
export type ActionItem = BaseConfigItem & {
  type: 'action'
  action: () => Promise<unknown> | unknown | void
  variant?: string
  enabled?: Readable<true>
}

export type NotImplementedSetting = BaseConfigItem & {
  type: 'not-implemented'
  default?: unknown
}

type OptionalProp<T, K extends PropertyKey> = T extends Record<K, unknown> ? Omit<T, K> & Partial<Pick<T, K>> : T

// HACK: using just Omit<SettingsBlueprintItem, 'default'> causes ts to narrow down the type to BaseConfigItem,
// meaning all specific fields get lost
type MakeDefaultOptional<T> = T extends { default: any } ? Omit<T, 'default'> & { default?: T['default'] } : T

export type GroupWrapper = BaseConfigItem & {
  type: 'group'
  children: SettingsBlueprintItem[]
}
export type BasePage = BaseConfigItem & {
  type: 'page'
  children: SettingsBlueprintItem[]
}
export type ItemListPage = BaseConfigItem & {
  type: 'item-list'
  itemLabel?: string
  defaultToCopy?: Record<string, Record<string, unknown>>
  nameProperty: string
  iconProperty?: string
  children: OptionalProp<SettingsBlueprintItem, 'default'>[]
}
export type VariantListSettingPage = BaseConfigItem & {
  type: 'variant-list'
  // having a default value leads to problems when merging with the overrides
  // e.g. items cannot be reordered
  defaultToCopy?: Record<string, Record<string, unknown>>
  typeField: string
  itemLabel?: string
  base: Omit<SettingsBlueprintItem, 'default'>[]
  options: (BaseConfigItem & { items: MakeDefaultOptional<SettingsBlueprintItem>[] })[]
}
export type ChangelogPage = BaseConfigItem & {
  type: 'changelog'
  changelog: Changelog | Readable<Changelog> | (() => Promise<Changelog>)
}

// TODO: combine with registry
export type SettingsPage =
  | BasePage //
  | ItemListPage
  | VariantListSettingPage
  | ChangelogPage
  | MultiSelectReorderSetting
export type SettingsItem =
  | DescriptionItem //
  | ValueDisplayItem
  | ActionItem
  | NotImplementedSetting
export type SettingsInput =
  | TextSetting //
  | SelectSetting
  | MultiSelectSetting
  | MultiSelectReorderSetting
  | BooleanSetting
  | NumberSetting
  | IconSetting

export type SettingsWrapper = GroupWrapper

export type SettingsNested = BasePage | SettingsWrapper

export type SettingsBlueprintItem = SettingsPage | SettingsWrapper | SettingsItem | SettingsInput
export type SettingsBlueprint = SettingsBlueprintItem[]

//

export type SettingsFromBlueprint<T extends readonly SettingsBlueprintItem[]> = {
  [K in T[number] as K['id']]: K extends { type: 'group' | 'page'; children: infer C }
    ? SettingsFromBlueprint<C & readonly SettingsBlueprintItem[]>
    : K extends { type: 'select'; options: infer O }
      ? O extends readonly { id: string }[]
        ? O[number]['id']
        : never
      : K extends { type: 'boolean-group'; options: infer O }
        ? O extends readonly { id: infer I }[]
          ? I[]
          : never
        : K extends { type: 'variant-list' }
          ? Record<string, unknown>
          : K extends { default: infer D }
            ? D
            : never
}
