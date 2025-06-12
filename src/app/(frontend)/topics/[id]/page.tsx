import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import TopicDetailClient from './TopicDetailClient'

interface PageProps {
  params: { id: string }
}

export default async function TopicDetail({ params }: PageProps) {
  const { id } = params
  const payloadConfigResolved = await config
  const payload = await getPayload({ config: payloadConfigResolved })

  const topic = await payload.findByID({
    collection: 'topics',
    id,
  })

  if (!topic) return notFound()

  return <TopicDetailClient topic={topic} />
}
