import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {Metadata} from "next"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path
  // Use the current host instead of hardcoding Vercel
  const host = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${host}${path}`
}

export function constructMetadata({
  title = "Quill - the SaaS for students",
  description = "Quill is an open-source software to make chatting to your PDF files easy.",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  // Use the current host for metadataBase
  const host = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@joshtriedcoding"
    },
    icons,
    metadataBase: new URL(host),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  }
}