import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'number',
      title: 'Number',
      type: 'number',
      description: 'Sequential collection number (1, 2, 3, …).',
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Display year (e.g. "2026"). Free-form, not a date — collections sometimes span seasons.',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cover',
      title: 'Cover (listing)',
      type: 'image',
      options: {hotspot: true},
      description: 'Used on the /collections index card. Usually the first look.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: {hotspot: true},
      description: 'Used on the detail page when no hero video is set.',
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero video',
      type: 'file',
      options: {accept: 'video/*'},
      description: 'Optional. If set, the detail page uses this instead of the hero image.',
    }),
    defineField({
      name: 'heroVideoPoster',
      title: 'Hero video poster',
      type: 'image',
      options: {hotspot: true},
      description: 'Still frame shown before the hero video plays.',
      hidden: ({document}) => !document?.heroVideo,
    }),
    defineField({
      name: 'show',
      title: 'Show details',
      type: 'object',
      fields: [
        {name: 'venue', type: 'string', title: 'Venue'},
        {name: 'event', type: 'string', title: 'Event'},
        {name: 'date', type: 'datetime', title: 'Date'},
        {name: 'music', type: 'string', title: 'Music'},
        {name: 'film', type: 'string', title: 'Film'},
        {name: 'lighting', type: 'string', title: 'Lighting'},
      ],
      options: {collapsible: true, collapsed: true},
    }),
    defineField({
      name: 'collaborators',
      title: 'Collaborators',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'collaborator',
          fields: [
            {name: 'name', type: 'string', title: 'Name'},
            {name: 'role', type: 'string', title: 'Role'},
            {name: 'href', type: 'url', title: 'Link'},
          ],
          preview: {select: {title: 'name', subtitle: 'role'}},
        },
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Paragraph', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Emphasis', value: 'em'},
              {title: 'Strong', value: 'strong'},
            ],
            annotations: [
              {
                name: 'cite',
                type: 'object',
                title: 'Citation (for blockquote)',
                fields: [{name: 'source', type: 'string', title: 'Source'}],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'looks',
      title: 'Looks',
      type: 'array',
      of: [{type: 'look'}],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'press',
      title: 'Press',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'pressItem',
          fields: [
            {name: 'outlet', type: 'string', title: 'Outlet'},
            {name: 'date', type: 'date', title: 'Date'},
            {name: 'quote', type: 'text', title: 'Quote', rows: 2},
            {name: 'href', type: 'url', title: 'Link'},
          ],
          preview: {select: {title: 'outlet', subtitle: 'quote'}},
        },
      ],
    }),
  ],
  orderings: [
    {
      title: 'Published, newest first',
      name: 'publishedDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Number, ascending',
      name: 'numberAsc',
      by: [{field: 'number', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'year', media: 'cover'},
  },
})
