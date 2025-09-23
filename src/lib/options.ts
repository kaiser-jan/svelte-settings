import { Button, buttonVariants } from './components/ui/button'
import Label from '$lib/components/ui/label/label.svelte'
import * as Popover from '$lib/components/ui/popover'
import * as Accordion from '$lib/components/ui/accordion/index.js'
import LoaderPulsatingRing from '$lib/components/ui/LoaderPulsatingRing.svelte'
import Input from '$lib/components/ui/input/input.svelte'
import * as Select from '$lib/components/ui/select'
import { Checkbox } from '$lib/components/ui/checkbox'
import Switch from '$lib/components/ui/switch/switch.svelte'
import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js'

export type Options = {
  components: {
    Button: typeof Button
    Label: typeof Label
    Popover: typeof Popover
    Accordion: typeof Accordion
    LoaderPulsatingRing: typeof LoaderPulsatingRing
    Input: typeof Input
    Select: typeof Select
    Checkbox: typeof Checkbox
    Switch: typeof Switch
    Breadcrumb: typeof Breadcrumb
  }
  style: {
    button: {
      category: string
      action: string
    }
    category: {
      classes: string
    }
  }
}

export const defaultOptions: Options = {
  components: {
    Button,
    Label,
    Popover,
    Accordion,
    LoaderPulsatingRing,
    Input,
    Select,
    Checkbox,
    Switch,
    Breadcrumb,
  },
  style: {
    button: {
      category: 'outline',
      action: 'default',
    },
    category: {
      classes: buttonVariants({ variant: 'outline', class: 'text-base whitespace-wrap' }),
    },
  },
}
