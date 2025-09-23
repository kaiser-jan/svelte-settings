<script lang="ts">
  import { getOptionsContext } from '$lib/context'
  import type { ChangelogPage } from '$lib/types'
  import { toReadable } from '$lib/utils/stores'
  import { DateTime } from 'luxon'

  interface Props {
    item: ChangelogPage
  }

  let { item }: Props = $props()

  const options = getOptionsContext()
  const { Accordion } = options.components

  const changelog = toReadable(item.changelog)
</script>

<Accordion.Root type="single">
  {#each $changelog?.releases ?? [] as release, index (index)}
    <Accordion.Item value={release.version} class="">
      <Accordion.Trigger>
        <h1 class="inline-flex grow items-center text-2xl font-bold">
          {release.version}
          <span class="text-text-muted ml-auto text-sm italic">
            {DateTime.fromISO(release.date).toLocaleString()}
          </span>
        </h1>
      </Accordion.Trigger>
      <Accordion.Content class="flex flex-col gap-3">
        {#each release.commitGroups as commitGroup, j (j)}
          <div class="flex flex-col">
            <h2 class="text-lg font-bold">
              <!-- e.g. Bug Fixes, Features -->
              {commitGroup.title}
              <!-- {commitGroup.type} -->
            </h2>
            <div class="text-text-muted flex flex-col gap-0.5">
              {#each commitGroup.commits as commit, k (k)}
                {#if commit.scope !== commitGroup.commits[k - 1]?.scope}
                  <b class="text-text mt-1">{commit.scope}</b>
                {/if}
                <a href={commit.commitUrl} target="_blank" class="flex text-sm">
                  {commit.subject?.trim()}
                  <!-- {commit.hash} -->
                </a>
              {/each}
            </div>
          </div>
        {/each}
      </Accordion.Content>
    </Accordion.Item>
  {/each}
</Accordion.Root>
