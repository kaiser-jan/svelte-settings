import type { Icon } from '@lucide/svelte'
import type { Readable } from 'svelte/store'
import type { Changelog } from './types/changelog.js'

// TODO: pass the settings type as ctx
export type VisibilityCallback = (ctx: Record<string, unknown>) => boolean

type Base = {
  id: string
  label: string
  description?: string
  icon?: typeof Icon
  visible?: VisibilityCallback
  disabled?: boolean | Readable<boolean>
  inline?: boolean
  action?: () => any
}

type SettingRegistry = {
  text: {
    default: string
    placeholder?: string
  }

  select: {
    searchable?: boolean
    itemLabel?: string
    options: readonly {
      id: string
      label: string
      icon?: typeof Icon
    }[]
    default: string
  }

  'boolean-group': {
    options: readonly string[]
    labels?: Record<string, string>
    default: string[]
  }

  list: {
    options: readonly string[]
    labels?: Record<string, string>
    default: string[]
  }

  boolean: {
    default: boolean
  }

  number: {
    default: number
    min?: number
    max?: number
    step?: number
    unit?: string
  }

  icon: {
    default: string
  }

  description: {
    text: string
  }

  value: {
    value: string | undefined | Readable<string | undefined> | (() => Promise<string | undefined>)
    url?: string
  }

  action: {
    action: () => Promise<unknown> | unknown | void
    variant?: string
    enabled?: Readable<true>
  }

  'not-implemented': {
    default?: unknown
  }

  group: {
    children: SettingsBlueprintItem[]
  }

  page: {
    children: SettingsBlueprintItem[]
  }

  'item-list': {
    itemLabel?: string
    defaultToCopy?: Record<string, Record<string, unknown>>
    nameProperty: string
    iconProperty?: string
    children: OptionalProp<SettingsBlueprintItem, 'default'>[]
  }

  'variant-list': {
    defaultToCopy?: Record<string, Record<string, unknown>>
    typeField: string
    itemLabel?: string
    base: Omit<SettingsBlueprintItem, 'default'>[]
    options: (Base & { items: MakeDefaultOptional<SettingsBlueprintItem>[] })[]
  }

  changelog: {
    changelog: Changelog | Readable<Changelog> | (() => Promise<Changelog>)
  }
}

export type SettingType = keyof SettingRegistry

export type Setting<K extends keyof SettingRegistry> = Base & { type: K } & SettingRegistry[K]

export type SettingsBlueprintItem = {
  [K in keyof SettingRegistry]: Setting<K>
}[keyof SettingRegistry]

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
          : K extends { type: 'item-list'; children: infer C }
            ? Record<string, SettingsFromBlueprint<C & readonly SettingsBlueprintItem[]>>
            : K extends { default: infer D }
              ? D
              : never
}

type OptionalProp<T, K extends PropertyKey> = T extends Record<K, unknown> ? Omit<T, K> & Partial<Pick<T, K>> : T

// HACK: using just Omit<SettingsBlueprintItem, 'default'> causes ts to narrow down the type to BaseConfigItem,
// meaning all specific fields get lost
type MakeDefaultOptional<T> = T extends { default: any } ? Omit<T, 'default'> & { default?: T['default'] } : T
