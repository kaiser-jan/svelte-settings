import { settingsConfig } from '../config/settings.js'
import { useSettings, type SettingsFromBlueprint } from '$lib/index.js'

export const settings = useSettings(settingsConfig, {})
export type Settings = SettingsFromBlueprint<typeof settingsConfig>
