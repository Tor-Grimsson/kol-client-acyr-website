import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanity = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: '2024-10-01',
  useCdn: true,
  perspective: 'published',
})

const builder = imageUrlBuilder(sanity)

export const urlFor = (source) => builder.image(source)
