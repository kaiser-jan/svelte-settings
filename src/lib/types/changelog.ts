export interface Changelog {
  releases: Release[]
}

export interface Release {
  version: string
  date: string // ISO YYYY-MM-DD
  commitGroups: CommitGroup[]
}

export interface CommitGroup {
  title: string | boolean
  type: string | null // e.g. reverts
  commits: Commit[]
}

export interface Commit {
  hash: string
  subject: string | null // e.g. reverts
  scope?: string | undefined
  commitUrl: string
}
