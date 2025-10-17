import { Button, buttonVariants } from './components/ui/button/index.js'
import Label from '$lib/components/ui/label/label.svelte'
import Input from '$lib/components/ui/input/input.svelte'
import Switch from '$lib/components/ui/switch/switch.svelte'
import LoaderPulsatingRing from '$lib/components/ui/LoaderPulsatingRing.svelte'
import { Checkbox } from '$lib/components/ui/checkbox/index.js'
import * as Popover from '$lib/components/ui/popover/index.js'
import * as Accordion from '$lib/components/ui/accordion/index.js'
import * as Select from '$lib/components/ui/select/index.js'
import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js'
import type { DeepPartial } from './utils.js'
import { mergeDeep } from './deep.js'

export type Options = {
  components: {
    Accordion: typeof Accordion
    Breadcrumb: typeof Breadcrumb
    Button: typeof Button
    Checkbox: typeof Checkbox
    Input: typeof Input
    Label: typeof Label
    Popover: typeof Popover
    Select: typeof Select
    Switch: typeof Switch
    LoaderPulsatingRing: typeof LoaderPulsatingRing
  }
  style: {
    button: {
      category: string
      action: string
    }
    category: {
      classes: string
    }
    container: {
      classes: string
    }
  }
}

export const defaultOptions: Options = {
  components: {
    Accordion,
    Breadcrumb,
    Button,
    Checkbox,
    Input,
    Label,
    Popover,
    Select,
    Switch,
    LoaderPulsatingRing,
  },
  style: {
    button: {
      category: 'outline',
      action: 'default',
    },
    category: {
      classes: buttonVariants({ variant: 'outline', class: 'text-base whitespace-wrap' }),
    },
    container: {
      classes:
        'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all [&_svg]:shrink-0 bg-background shadow-xs dark:bg-input/30 dark:border-input border',
    },
  },
}

// HACK: deep merge the options but not the components
// TODO: consider splitting components off of options
export function mergeOptions(userOptions: DeepPartial<Options> | undefined) {
  const userComponents = userOptions?.components
  if (userOptions?.components) delete userOptions.components
  const options = mergeDeep(defaultOptions, userOptions) as Options
  // Error: type instantiation is excessively deep and possibly infinite. typescript (2589)
  // options.components = { ...defaultOptions.components, ...userComponents } as Options['components']
  options.components = { ...defaultOptions.components }

  if (userComponents) {
    for (const [componentKey, component] of Object.entries(userComponents as Partial<Options['components']>)) {
      options.components[componentKey as keyof typeof options.components] = component as any
    }
  }
  return options
}
