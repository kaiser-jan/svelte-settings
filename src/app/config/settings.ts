import type { SettingsBlueprint } from '$lib/index.js'
import type { VariantListSettingPage } from '$lib/types.js'
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
    type: 'variant-list',
    label: 'Attributes',
    icon: TagIcon,
    typeField: 'type',
    itemLabel: 'Attribute',
    default: {
      '87da052f-5ed2-4199-8689-b819d903c407': {
        id: 'project',
        label: 'Project',
        icon: 'folder',
        type: 'select',
        options: [
          {
            uuid: '12137092-f527-4f65-b642-a0ff7d9bd489',
            id: 'task-track',
            label: 'Task Track',
            icon: 'chart-no-axes-gantt',
          },
          {
            uuid: '09cf1ba7-eb85-4f6a-b6c1-0bfebcbcb267',
            id: 'weather-pwa',
            label: 'Weather PWA',
            icon: 'cloud-sun',
          },
          {
            uuid: '2e7650a7-66ad-4841-8c98-1ce296f5c4ef',
            id: 'svelte-settings',
            label: 'Svelte Settings',
            icon: 'settings',
          },
        ],
      },
      '4164793a-8a75-4467-a2f5-a9bf500cf55b': {
        id: 'people',
        label: 'With',
        icon: 'user',
        type: 'text',
      },
      '2b88a78c-aee6-49e5-8484-cef73b7c2b17': {
        id: 'location',
        label: 'At',
        icon: 'pin',
        type: 'text',
      },
      '20f3d304-3ad7-48cc-9db6-c7b75da56664': {
        id: 'mental-load',
        label: 'Mental Load',
        icon: 'brain',
        type: 'ordinal',
      },
    },
    base: [
      {
        id: 'id',
        label: 'Alias ID',
        description: 'This id is not used for internal storage, just as an alternative to the label in the UI.',
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
    childItemsCallback: (page: VariantListSettingPage, value: any, id: string) => {
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
