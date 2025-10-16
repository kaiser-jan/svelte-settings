import type { Icon } from '@lucide/svelte'

export type ItemSerialized = { id: string; label?: string; icon?: string }
export type Item = { id: string; label?: string; icon?: typeof Icon }
