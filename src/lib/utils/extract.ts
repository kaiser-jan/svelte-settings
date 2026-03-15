import type { SettingsBlueprintItem } from '../types.js'
import { getDeep } from './deep.js'

function assign(obj: Record<string, any>, path: string[], value: unknown) {
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    obj = obj[key] ??= {}
  }
  obj[path.at(-1)!] = value
}

export function extractDefaults(items: SettingsBlueprintItem[]) {
  return extractProperty(items, 'default')
}

export function copyDefaultsTo(config: SettingsBlueprintItem[], target: object) {
  return extractProperty(config, 'defaultToCopy', target)
}

function extractProperty(
  config: SettingsBlueprintItem[],
  property: keyof SettingsBlueprintItem,
  target: Record<string, unknown> = {},
): Record<string, unknown> {
  function walk(config: SettingsBlueprintItem[], path: string[] = []) {
    for (const item of config) {
      const fullPath = [...path, item.id]
      const exists = getDeep(target, fullPath)
      if (property in item && !exists) {
        assign(target, fullPath, item[property])
      }
      if ('children' in item) {
        walk(
          // @ts-expect-error defaults not existing doesn't matter
          item.children,
          [...path, item.id],
        )
      }
    }
  }

  walk(config)
  return target
}
