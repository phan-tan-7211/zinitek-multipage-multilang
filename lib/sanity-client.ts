import { createClient } from "next-sanity"
import { runtimeConfig } from "@/lib/runtime-config"

const baseSanityConfig = {
  projectId: runtimeConfig.sanityProjectId,
  dataset: runtimeConfig.sanityDataset,
  apiVersion: runtimeConfig.sanityApiVersion,
}

export const sanityClient = createClient({
  ...baseSanityConfig,
  useCdn: false,
})

export const sanityCdnClient = createClient({
  ...baseSanityConfig,
  useCdn: true,
})
