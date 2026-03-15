import { getContext, setContext } from 'svelte'
import type { InitializedSettings } from './index.ts'
import type { Options } from './utils/options.js'
import type { buttonVariants } from './components/ui/button/index.js'

const settingsKey = {}

export function setSettingsContext(settings: InitializedSettings) {
  setContext(settingsKey, settings)
}

export function getSettingsContext() {
  return getContext(settingsKey) as InitializedSettings
}

const optionsKey = {}

export function setOptionsContext(options: Options<buttonVariants>) {
  setContext(optionsKey, options)
}

export function getOptionsContext() {
  return getContext(optionsKey) as Options<buttonVariants>
}
