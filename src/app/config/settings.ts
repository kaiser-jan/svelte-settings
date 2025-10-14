import type { SettingsBlueprint } from '$lib/index.js'
import type { ItemListSettingPage } from '$lib/types.js'
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
  GithubIcon,
  ChevronsDownIcon,
  ChevronsUpIcon,
  ListIcon,
  PencilLineIcon,
  SlidersVerticalIcon,
  SmileIcon,
  TagIcon,
  TextInitialIcon,
  ChartNoAxesGanttIcon,
  CloudSunIcon,
  UserIcon,
  PinIcon,
  BrainIcon,
  KeyIcon,
} from '@lucide/svelte'

export const settingsConfig = [
  {
    id: 'attributes',
    type: 'item-list',
    label: 'Attributes',
    icon: TagIcon,
    typeField: 'type',

    default: {
      project: {
        id: 'project',
        label: 'Project',
        icon: 'folder',
        type: 'select',
        options: [
          {
            id: 'task-track',
            label: 'Task Track',
            icon: 'chart-no-axes-gantt',
          },
          {
            id: 'weather-pwa',
            label: 'Weather PWA',
            icon: 'cloud-sun',
          },
          {
            id: 'svelte-settings',
            label: 'Svelte Settings',
            icon: 'settings',
          },
        ],
      },
      people: {
        id: 'people',
        label: 'With',
        icon: 'user',
        type: 'text',
      },
      location: {
        id: 'location',
        label: 'At',
        icon: 'pin',
        type: 'text',
      },
      'mental-load': {
        id: 'mental-load',
        label: 'Mental Load',
        icon: 'brain',
        type: 'ordinal',
      },
    },
    base: [
      {
        id: 'id',
        label: 'Unique ID',
        type: 'text',
        icon: KeyIcon,
      },
      {
        id: 'label',
        label: 'Label',
        type: 'text',
        icon: PencilLineIcon,
      },
      {
        id: 'icon',
        label: 'icon',
        type: 'text',
        icon: SmileIcon,
      },
    ],
    childItemsCallback: (page: ItemListSettingPage, value: any, id: string) => {
      if (!value || !value[page.typeField]) return undefined
      const option = page.options.find((i) => i.id === value[page.typeField])
      const optionItems = option?.items.find((i) => i.id === id)
      return optionItems
    },
    options: [
      {
        id: 'text',
        label: 'Text',
        icon: TextInitialIcon,
        items: [],
      },
      {
        id: 'scalar',
        label: 'Scalar Number',
        icon: HashIcon,
        items: [],
      },
      {
        id: 'ordinal',
        label: 'Ordinal Number',
        icon: SlidersVerticalIcon,
        items: [
          {
            id: 'min',
            label: 'Minimum',
            icon: ChevronsDownIcon,
            type: 'number',
          },
          {
            id: 'max',
            label: 'Maximum',
            icon: ChevronsUpIcon,
            type: 'number',
          },
        ],
      },
      {
        id: 'select',
        label: 'Select',
        icon: ListIcon,
        items: [
          {
            id: 'options',
            label: 'Options',
            icon: ListIcon,
            type: 'list',
            nameProperty: 'label',
            default: [],
            children: [
              {
                id: 'id',
                label: 'Unique ID',
                type: 'text',
                icon: KeyIcon,
              },
              {
                id: 'label',
                label: 'Label',
                type: 'text',
                icon: PencilLineIcon,
              },
              {
                id: 'icon',
                label: 'icon',
                type: 'text',
                icon: SmileIcon,
              },
            ],
          },
        ],
      },
    ],
  },
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
      {
        id: 'value',
        type: 'value',
        label: 'Repo',
        value: 'svelte-settings',
        icon: GithubIcon,
        description: 'A label value pair with an optional url.',
        url: 'https://github.com/kaiser-jan/svelte-settings',
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
        options: ['email', 'push', 'sms'],
        default: ['email', 'push'],
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
