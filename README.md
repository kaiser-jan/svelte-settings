# WIP - Svelte Settings

> [!WARNING]
> This project is a work in progress. Do not use it in any of your projects yet.

Automatic user interface and reactive store for settings described in a single config object - all of that with full type support.
Based on [shadcn-svelte](https://www.shadcn-svelte.com/) with support for providing your own components which follow the same structure (for passing in your customized components).

## Features

- Single source of truth TypeScript config
- Automatic UI
- LocalStorage for persistence
- Reactive store for the setting values
- Support for subscribing only to a subset of settings (`.select`)
- Migration based on descriptive migration steps
- Type support for using the setting values

## Roadmap

- [ ] Desktop Support / Responsiveness
- [ ] More settings types
  - [ ] Nested objects
  - [ ] Date/Time
  - [ ] Duration
  - [ ] Color
  - [ ] Icons
- [ ] Search
- [ ] Support for custom storage adapters

## Usage

##### Tell TailwindCSS about svelte-settings

Add the following to your `.css` file, e.g. `tailwind.css`:

```css
@source "../../node_modules/svelte-settings";
```

Adapt the path to correctly point to the install of `svelte-settings`.

##### Define your settings

in e.g. `$lib/config/settings.ts`:

```typescript
import type { SettingsBlueprint } from 'svelte-settings'

export const settingsConfig = [
  {
    id: 'general',
    label: 'General',
    icon: SettingsIcon,
    type: 'page',
    children: [
      {
        id: 'language',
        label: 'Language',
        icon: LanguagesIcon,
        type: 'select',
        options: ['en', 'de'] as string[],
        default: 'en',
      },
      {
        id: 'highContrast',
        label: 'High Contrast',
        description: 'Use colors with higher contrast for better readability.',
        type: 'boolean',
        icon: ListOrderedIcon,
        default: false,
      },
    ],
  },
] as const satisfies SettingsBlueprint
```

##### Initialize svelte-settings

in e.g. `$lib/stores/settings.ts`:

```typescript
import { useSettings, type SettingsFromBlueprint } from 'svelte-settings'

import { settingsConfig } from '$lib/config/settings'

export const settings = useSettings(settingsConfig, {})
export type Settings = SettingsFromBlueprint<typeof settingsConfig>
```

##### Use the settings in your application

```typescript
import { settings } from `$lib/stores/settings`
const highContrast = $settings.general.highContrast
```

### Advanced Usage

#### Migration

##### Define the migration steps

in e.g. `$lib/config/settings-migrations.ts`:

```typescript
import { copy, renameArrayEntry, type SettingsMigrations } from 'svelte-settings/migration'

export const SETTINGS_MIGRATIONS: SettingsMigrations = [
  // each list represents a new version with multiple migration steps
  [],
  [
    {
      description: 'Copy general.highContrast to general.differentiateWithoutColor',
      callback: (settings) => copy(settings, ['general', 'highContrast'], ['general', 'differentiateWithoutColor']),
    },
    {
      description: 'Rename language codes to short form',
      callback: (settings) => {
        renameArrayEntry(settings, ['general', 'language'], 'english', 'en')
        renameArrayEntry(settings, ['general', 'language'], 'german', 'de')
      },
    },
  ],
]
```

##### Tell svelte-settings to perform the necessary migrations

in `hooks.client.ts`:

```typescript
import { performMigrations } from 'svelte-settings'
import { SETTINGS_MIGRATIONS } from '$lib/config/settings-migrations'

performMigrations({ migrations: SETTINGS_MIGRATIONS })
```
