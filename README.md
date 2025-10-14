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

- [ ] Consistent Styling (e.g. `text-text-muted`, `bg-foreground`)
- [ ] Desktop Support / Responsiveness
- [ ] Conditional Visibility (only show setting if other settings allow)
- [ ] More settings types
  - [ ] Nested objects
  - [ ] Date/Time
  - [ ] Duration
  - [ ] Color
  - [ ] Icons
- [ ] Search
- [ ] Support for custom storage adapters
- [ ] Setting Insert (show setting inputs outside of SettingsView)

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

## Writeup

### Settings

#### Variant List

A dynamic list where each item's structure depends on its selected type.
The type is chosen via `typeField` and determines the item's properties.
TODO: should typeField even be configurable?

##### Internal Structure

As the name `Variant List` implies, the settings is visually represented by a reorderable list.
But using an array internally has a few drawbacks:
Nearly all settings are stored in a Record format, which makes the (partial) actual values easily traversable. Introducing an array would mean either accessing by index (which gets mixed up by reordering) or using `.find` on the `id` field, which would require adaptation of the deep read and write.
In the long run this calls for trouble, as the value-accessing methods do not know if they are accessing a record or an array. E.g. when writing a property for a list item which is not yet written to the settings.
TODO: should the same logic be applied to the regular List Setting?

However, this means that we need to store items under a key, which makes it hard to make this key/id user-configurable.
This leads to the next question: Should the unique id be user-editable?
While it would allow for easier manual referencing, it introduces a lot of complexity and potential problems when a user changes the id: We would need to change the id references in all existing entries. Also, a uniqueness check would be necessary.
Therefore, using a UUID with a label (and possibly an alias-id) seems more future-proof.
