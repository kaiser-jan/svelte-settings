<script lang="ts">
  import { SettingsView } from '$lib/index.js'
  import { settings } from '../app/stores/settings.js'
  import { onMount } from 'svelte'
  import { page } from '$app/state'
  import { goto } from '$app/navigation'
  import { get } from 'svelte/store'

  onMount(() => {
    if (page.url.searchParams.get('settings-path') === null) {
      const target = page.url
      target.searchParams.set('settings-path', '[]')
      goto(target.toString())
    }
  })
</script>

<div class="flex h-dvh min-h-0 grow flex-col gap-4 overflow-x-visible p-4">
  <SettingsView {settings} />
</div>
