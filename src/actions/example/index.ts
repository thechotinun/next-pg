'use server'

import { exampleService } from '@/services/example'
import { revalidatePath } from 'next/cache'

export type { exampleModel as Example } from '@/generated/prisma/models/example'

export async function getAllExamplesAction() {
  return await exampleService.getAllExamples()
}

export async function getExampleByIdAction(id: string) {
  return await exampleService.getExampleById(id)
}

export async function createExampleAction(data: {
  name: string
  status?: boolean
}) {
  const result = await exampleService.createExample(data)

  if (result.success) {
    revalidatePath('/example')
  }

  return result
}

export async function updateExampleAction(
  id: string,
  data: { name?: string; status?: boolean }
) {
  const result = await exampleService.updateExample(id, data)

  if (result.success) {
    revalidatePath('/example')
  }

  return result
}

export async function deleteExampleAction(id: string) {
  const result = await exampleService.deleteExample(id)

  if (result.success) {
    revalidatePath('/example')
  }

  return result
}

export async function searchExamplesAction(searchTerm: string) {
  return await exampleService.searchExamples(searchTerm)
}

export async function getExamplesByStatusAction(status: boolean) {
  return await exampleService.getExamplesByStatus(status)
}

export async function paginateExamplesAction(page: number, pageSize: number) {
  return await exampleService.paginateExamples(page, pageSize)
}
