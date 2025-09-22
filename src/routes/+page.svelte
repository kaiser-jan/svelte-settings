<script>
	import { SettingsView } from '$lib/index.js';
	import { settings } from '../app/stores/settings.js';
</script>


<div class="flex min-h-0 grow flex-col gap-4 overflow-x-visible p-4 pb-0 h-dvh">
	<SettingsView {settings} />
</div>
