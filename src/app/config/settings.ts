import type { SettingsBlueprint } from '$lib/index.js'
import {
  CheckSquareIcon,
  DatabaseIcon,
  EyeOffIcon,
  FolderIcon,
  GlobeIcon,
  GridIcon,
  HashIcon,
  HistoryIcon,
  InfoIcon,
  LayersIcon,
  LayoutIcon,
  RefreshCwIcon,
  SettingsIcon,
  SlidersHorizontalIcon,
  SunMoonIcon,
  ToggleLeftIcon,
  TypeIcon,
  ZapIcon,
} from '@lucide/svelte'

export const settingsConfig = [
  {
    id: 'primitives',
    label: 'Primitives',
    icon: SettingsIcon,
    type: 'page',
    children: [
      {
        id: 'boolean',
        type: 'boolean',
        label: 'boolean',
        icon: ToggleLeftIcon,
        default: false,
        description: 'Lorem ipsum dolor sit amet, just a loooong description',
      },
      {
        id: 'number_step',
        type: 'number',
        label: 'number_step',
        icon: HashIcon,
        unit: '×',
        min: 0.75,
        max: 1.5,
        step: 0.01,
        default: 1,
      },
      {
        id: 'number',
        type: 'number',
        label: 'number',
        icon: DatabaseIcon,
        unit: 'items',
        min: 0,
        max: 10000,
        default: 100,
      },
      {
        id: 'text',
        type: 'text',
        label: 'text',
        icon: TypeIcon,
        placeholder: 'https://api.example.com',
        default: '',
      },
      // { id: 'value', type: 'value', label: 'value', icon: SunMoonIcon, value: themeState },
      {
        id: 'action',
        type: 'action',
        label: 'action',
        icon: RefreshCwIcon,
        action: () => {},
        description: 'An action which completes instantly.',
      },
      // {
      // 	id: 'action_disabled',
      // 	type: 'action',
      // 	label: 'action_disabled',
      // 	icon: ZapIcon,
      // 	action: () => enableExperimentalFeatures(),
      // 	disabled: true
      // }
    ],
  },

  {
    id: 'advanced',
    label: 'Advanced',
    icon: SlidersHorizontalIcon,
    type: 'page',
    children: [
      {
        id: 'select',
        type: 'select',
        label: 'select',
        icon: GlobeIcon,
        options: ['en', 'de'] as string[],
        default: 'en',
      },
      {
        id: 'multiselect',
        type: 'multiselect',
        label: 'multiselect',
        icon: CheckSquareIcon,
        options: ['email', 'push', 'sms'] as string[],
        default: ['email', 'push'] as string[],
      },
      {
        id: 'changelog',
        type: 'changelog',
        label: 'Changelog',
        icon: HistoryIcon,
        changelog: async () => {
          const module = await import('changelog.json')
          return module.default
        },
      },
    ],
  },

  {
    id: 'layout',
    label: 'Layout',
    icon: LayoutIcon,
    type: 'page',
    children: [
      {
        id: 'description',
        type: 'description',
        label: 'description',
        icon: InfoIcon,
        text: 'Demo: primitives, advanced and layout groups.',
      },
      {
        id: 'group',
        type: 'group',
        label: 'group',
        icon: LayersIcon,
        children: [
          {
            id: 'number_columns',
            type: 'number',
            label: 'number',
            icon: GridIcon,
            min: 1,
            max: 4,
            default: 2,
          },
        ],
      },
      {
        id: 'nested_page',
        type: 'page',
        label: 'nested_page',
        icon: FolderIcon,
        children: [
          {
            id: 'telemetry',
            type: 'boolean',
            label: 'boolean',
            icon: EyeOffIcon,
            default: false,
            description: 'Anonymous usage metrics.',
          },
        ],
      },
    ],
  },
] as const satisfies SettingsBlueprint
