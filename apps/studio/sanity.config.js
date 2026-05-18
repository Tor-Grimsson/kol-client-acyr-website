import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// redeploy trigger 2026-05-18
export default defineConfig({
  name: 'default',
  title: 'another-creation',

  projectId: 'ajbrqqhq',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
