import { exampleRepository } from '@/repositories/example'

export class ExampleService {
  async getAllExamples() {
    try {
      const examples = await exampleRepository.findAll()
      return { success: true, data: examples }
    } catch (error) {
      console.error('Failed to fetch examples:', error)
      return { success: false, error: 'Failed to fetch examples' }
    }
  }

  async getExampleById(id: string) {
    try {
      const example = await exampleRepository.findById(id)

      if (!example) {
        return { success: false, error: 'Example not found' }
      }

      return { success: true, data: example }
    } catch (error) {
      console.error('Failed to fetch example:', error)
      return { success: false, error: 'Failed to fetch example' }
    }
  }

  async createExample(data: {
    name: string
    status?: boolean
  }) {
    try {
      // Validation
      if (!data.name || data.name.trim().length === 0) {
        return { success: false, error: 'Name is required' }
      }

      if (data.name.length > 100) {
        return { success: false, error: 'Name is too long (max 100 characters)' }
      }

      const existingExample = await exampleRepository.findByName(data.name)
      if (existingExample) {
        return { success: false, error: 'Name already exists' }
      }

      const example = await exampleRepository.create({
        name: data.name,
        status: data.status || true
      })

      return { success: true, data: example }
    } catch (error) {
      console.error('Failed to create example:', error)
      return { success: false, error: 'Failed to create example' }
    }
  }

  async updateExample(
    id: string,
    data: {
      name?: string
      status?: boolean
    }
  ) {
    try {
      const existing = await exampleRepository.findById(id)
      if (!existing) {
        return { success: false, error: 'Example not found' }
      }

      if (data.name !== undefined) {
        if (data.name.trim().length === 0) {
          return { success: false, error: 'Name cannot be empty' }
        }
        if (data.name.length > 100) {
          return { success: false, error: 'Name is too long (max 100 characters)' }
        }

        const duplicate = await exampleRepository.findByName(data.name)
        if (duplicate && duplicate.id !== id) {
          return { success: false, error: 'Name already exists' }
        }
      }

      const example = await exampleRepository.update(id, data)
      return { success: true, data: example }
    } catch (error) {
      console.error('Failed to update example:', error)
      return { success: false, error: 'Failed to update example' }
    }
  }

  async deleteExample(id: string) {
    try {
      const existing = await exampleRepository.findById(id)
      if (!existing) {
        return { success: false, error: 'Example not found' }
      }

      const example = await exampleRepository.softDelete(id, 'system_example_service')
      return { success: true, data: example }
    } catch (error) {
      console.error('Failed to delete example:', error)
      return { success: false, error: 'Failed to delete example' }
    }
  }

  async restoreExample(id: string) {
    try {
      const example = await exampleRepository.restore(id)
      return { success: true, data: example }
    } catch (error) {
      console.error('Failed to restore example:', error)
      return { success: false, error: 'Failed to restore example' }
    }
  }

  async searchExamples(searchTerm: string) {
    try {
      const examples = await exampleRepository.searchByName(searchTerm)
      return { success: true, data: examples }
    } catch (error) {
      console.error('Failed to search examples:', error)
      return { success: false, error: 'Failed to search examples' }
    }
  }

  async getExamplesByStatus(status: boolean) {
    try {
      const examples = await exampleRepository.findByStatus(status)
      return { success: true, data: examples }
    } catch (error) {
      console.error('Failed to fetch examples by status:', error)
      return { success: false, error: 'Failed to fetch examples by status' }
    }
  }

  async getStatistics() {
    try {
      const stats = await exampleRepository.getStatsByStatus()
      const total = await exampleRepository.count()

      return {
        success: true,
        data: {
          total,
          byStatus: stats
        }
      }
    } catch (error) {
      console.error('Failed to get statistics:', error)
      return { success: false, error: 'Failed to get statistics' }
    }
  }

  async paginateExamples(page: number = 1, pageSize: number = 10) {
    try {
      const result = await exampleRepository.paginate({
        page,
        pageSize,
        orderBy: { createdAt: 'desc' }
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('Failed to paginate examples:', error)
      return { success: false, error: 'Failed to paginate examples' }
    }
  }

  async bulkUpdateStatus(ids: string[], status: boolean) {
    try {
      const result = await exampleRepository.updateStatusBulk(ids, status)
      return { success: true, data: result }
    } catch (error) {
      console.error('Failed to bulk update:', error)
      return { success: false, error: 'Failed to bulk update' }
    }
  }
}

export const exampleService = new ExampleService()
