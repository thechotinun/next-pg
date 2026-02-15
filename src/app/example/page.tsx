import { getAllExamplesAction } from '@/actions/example'
import ExampleClient from './client'

export default async function ExamplePage() {
  const result = await getAllExamplesAction()
  const initialExamples = result.success && result.data ? result.data : []

  return <ExampleClient initialExamples={initialExamples} />
}
