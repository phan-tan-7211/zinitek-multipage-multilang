import { NextRequest, NextResponse } from "next/server"
import { createClient } from "next-sanity"

const sanityClient = createClient({
  projectId: "g4o3uumy",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})

const googleLanguage: Record<string, string> = {
  vi: "vi",
  en: "en",
  jp: "ja",
  kr: "ko",
  cn: "zh-CN",
}

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang") || "vi"
  const languageCode = googleLanguage[lang] || "vi"
  const apiKey = process.env.GOOGLE_PLACES_API_KEY

  const settings = await sanityClient.fetch(
    `*[_type == "siteSettings" && !(_id in path("drafts.**"))][0]{googlePlaceId,googleMapsUrl}`,
  )

  if (!settings?.googlePlaceId || !apiKey) {
    return NextResponse.json({ configured: false, reviews: [] })
  }

  try {
    const endpoint = new URL(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(settings.googlePlaceId)}`,
    )
    endpoint.searchParams.set("languageCode", languageCode)

    const response = await fetch(endpoint, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "displayName,rating,userRatingCount,reviews,googleMapsUri",
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error("Google Places reviews error:", response.status, detail)
      return NextResponse.json(
        { configured: true, error: "GOOGLE_PLACES_ERROR", reviews: [] },
        { status: 502 },
      )
    }

    const place = await response.json()
    const reviews = Array.isArray(place.reviews)
      ? place.reviews.map((review: any) => ({
          name: review.name,
          rating: review.rating,
          text: review.text,
          originalText: review.originalText,
          relativePublishTimeDescription: review.relativePublishTimeDescription,
          publishTime: review.publishTime,
          googleMapsUri: review.googleMapsUri,
          author: review.authorAttribution
            ? {
                displayName: review.authorAttribution.displayName,
                uri: review.authorAttribution.uri,
                photoUri: review.authorAttribution.photoUri,
              }
            : null,
        }))
      : []

    return NextResponse.json({
      configured: true,
      displayName: place.displayName,
      rating: place.rating,
      userRatingCount: place.userRatingCount,
      googleMapsUri: settings.googleMapsUrl || place.googleMapsUri,
      reviews,
    })
  } catch (error) {
    console.error("Google Places reviews request failed:", error)
    return NextResponse.json(
      { configured: true, error: "GOOGLE_PLACES_REQUEST_FAILED", reviews: [] },
      { status: 502 },
    )
  }
}
