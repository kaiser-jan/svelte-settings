import type { SettingsBlueprintItem } from '../types.js'

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

export function extractDefaultsToCopy(items: SettingsBlueprintItem[]) {
  return extractProperty(items, 'defaultToCopy')
}

function extractProperty(
  items: SettingsBlueprintItem[],
  property: keyof SettingsBlueprintItem,
): Record<string, unknown> {
  const result: Record<string, any> = {}

  function walk(config: SettingsBlueprintItem[], path: string[] = []) {
    for (const item of config) {
      if (property in item) {
        assign(result, [...path, item.id], item[property])
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

  walk(items)
  return result
}
