import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import TopicDetailClient from './TopicDetailClient'

export default async function TopicDetail({ params }: { params: { id: string } }) {
  const { id } = params
  const payload = await getPayload({ config })

  const topic = await payload.findByID({
    collection: 'topics',
    id,
  })

  if (!topic) return notFound()

  return <TopicDetailClient topic={topic} />
}
