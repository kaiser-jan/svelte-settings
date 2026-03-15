import { performMigrations } from './lib/index.js'
import { SETTINGS_MIGRATIONS } from './app/config/settings-migrations.js'

performMigrations({ migrations: SETTINGS_MIGRATIONS })
