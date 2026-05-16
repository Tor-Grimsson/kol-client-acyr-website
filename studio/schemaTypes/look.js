import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'look',
  title: 'Look',
  type: 'object',
  fields: [
    defineField({
      name: 'number',
      title: 'Number',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'e.g. "Look 01". Optional — falls back to "Look {number}".',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'family',
      title: 'Family',
      type: 'string',
      description: 'Optional grouping label (e.g. "Tailoring", "Daywear", "Evening").',
    }),
    defineField({
      name: 'fabric',
      title: 'Fabric',
      type: 'string',
      description: 'Optional fabric note shown beside the image.',
    }),
  ],
  preview: {
    select: {title: 'name', number: 'number', media: 'image'},
    prepare({title, number, media}) {
      return {
        title: title || `Look ${String(number).padStart(2, '0')}`,
        media,
      }
    },
  },
})
