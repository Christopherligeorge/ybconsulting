//lib folder files--> prepares libraries to be used within our projects, such as uploadthing in this one

import { generateReactHelpers } from '@uploadthing/react/hooks'

import type { OurFileRouter } from '@/app/api/uploadthing/core'

export const { useUploadThing } =
  generateReactHelpers<OurFileRouter>()