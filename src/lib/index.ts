import { extractDefaults, extractDefaultsToCopy } from './extractDefaults.js'
import type { SettingsBlueprint, SettingsFromBlueprint } from './types.js'
import { select } from '$lib/utils/stores.js'
import { getDeep, mergeDeep, setDeep } from './deep.js'
import { writable, get } from 'svelte/store'
import { persisted } from 'svelte-persisted-store'
import { mergeOptions, type Options } from './options.js'
import type { DeepPartial } from './utils.js'
import { lucideIcons } from './icons.js'

export type { SettingsFromBlueprint, SettingsBlueprint, SettingsBlueprintItem } from './types.js'

export type InitializedSettings = ReturnType<typeof useSettings>

export { default as SettingsView } from './components/SettingsView.svelte'

export * as migration from './utils/migration.js'

export { performMigrations } from './migrate.js'

/**
 * Creates an instance of svelte-settings following the given blueprint.
 * Should only be called once, as this initializes the settings and creates a store for it.
 * Having multiple instances would break reactivity.
 * You can re-export the initialized settings for use in your app.
 */
export function useSettings<T extends SettingsBlueprint>(blueprint: T, options: DeepPartial<Options>) {
  type Settings = SettingsFromBlueprint<T>

  // TODO: the defaults for added settings will not be copied -> migration
  const settingsOverrides = persisted('settings', extractDefaultsToCopy(blueprint))

  const settingsDefaults = extractDefaults(blueprint) as Settings
  const settingsStore = writable<Settings>(mergeDeep(structuredClone(settingsDefaults), get(settingsOverrides)))

  const settings = {
    subscribe: settingsStore.subscribe,
    // set: settingsWritable.set,
    // update: settingsWritable.update,
    select: <U>(selector: (s: Settings) => U, isEqual?: (a: U, b: U) => boolean) =>
      select(settingsStore, selector, isEqual),
    readSetting,
    writeSetting,
    resetSetting,
    defaults: settingsDefaults,
    // TODO: store version in overrides, apply necessary migrations
    export: () => get(settingsOverrides),
    import: (o: object) => settingsOverrides.set(o),
    blueprint,
    options: mergeOptions(options),
    icons: lucideIcons,
  }

  return settings

  function writeSetting(path: readonly string[], value: unknown) {
    console.info(`Writing setting: ${path} = ${JSON.stringify(value)}`)
    settingsStore.update((s) => {
      setDeep(s, path, value)
      return s
    })

    setDeep(settingsOverrides, path, value)

    settingsOverrides.update((s) => {
      setDeep(s, path, value)
      return s
    })
  }

  function readSetting(path: readonly string[]) {
    console.debug(`Reading setting: ${path}`)
    const valueOverride = getDeep(get(settingsOverrides), path)
    const valueDefault = getDeep(settingsDefaults, path)

    if (valueOverride !== undefined) {
      // get from the merged settings
      // NOTE: this might only be required because item lists are not handled properly (merging default and overrides)
      const value = getDeep(get(settingsStore), path)
      console.debug(`Read changed setting: ${path} = ${JSON.stringify(value)}`)
      // only mark as changed if it exists in the default config (do not mark for lists etc.)
      return { value, changed: valueDefault !== undefined }
    }

    console.debug(`Read default setting: ${path} = ${JSON.stringify(valueDefault)}`)

    return { value: valueDefault, changed: false }
  }

  function resetSetting(path: string[]) {
    console.debug(`Resetting setting: ${path}`)

    const defaultValue = getDeep(settingsDefaults, path)

    console.log(defaultValue)
    if (defaultValue === undefined) {
      console.debug(`No default setting, ignoring.`)
      return
    }

    settingsStore.update((s) => {
      setDeep(s, path, defaultValue)
      return s
    })

    settingsOverrides.update((s) => {
      // deleteDeep(s, path)
      setDeep(s, path, undefined)
      return s
    })

    console.info(`Reset setting: ${path} to ${JSON.stringify(defaultValue)}`)

    return defaultValue
  }

  // NOTE: building an object where every setting is a Writable would not help:
  // it can neither be accessed as $settings.a nor as settings.$a,
  // so creating a variable for it is necessary anyways
}
