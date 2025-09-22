import { getContext, setContext } from 'svelte'
import type { InitializedSettings, Options } from './index.ts'

const settingsKey = {}

export function setSettingsContext(settings: InitializedSettings) {
  setContext(settingsKey, settings)
}

export function getSettingsContext() {
  return getContext(settingsKey) as InitializedSettings
}

const optionsKey = {}

export function setOptionsContext(options: Options) {
  setContext(optionsKey, options)
}

export function getOptionsContext() {
  return getContext(optionsKey) as Options
}
