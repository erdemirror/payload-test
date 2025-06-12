import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import TopicDetailClient from './TopicDetailClient'

interface PageProps {
  params: { id: string }
}

export default async function TopicDetail({ params }: PageProps) {
  const { id } = params
  const payload = await getPayload({ config }) // ✅ just pass config directly

  const topic = await payload.findByID({
    collection: 'topics',
    id,
  })

  if (!topic) return notFound()

  return <TopicDetailClient topic={topic} />
}
