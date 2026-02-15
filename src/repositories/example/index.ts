import { BaseRepository } from '@/repositories/base.repository'
import type { exampleModel } from '@/generated/prisma/models/example'

export class ExampleRepository extends BaseRepository<exampleModel> {
  constructor() {
    super('example')
  }

  async findByStatus(status: boolean): Promise<exampleModel[]> {
    return this.findMany({ status })
  }

  async findByName(name: string): Promise<exampleModel | null> {
    return this.findOne({
      name: {
        equals: name,
        mode: 'insensitive'
      }
    })
  }

  async searchByName(searchTerm: string): Promise<exampleModel[]> {
    return this.findMany({
      name: {
        contains: searchTerm,
        mode: 'insensitive'
      }
    })
  }

  async findAllActive(): Promise<exampleModel[]> {
    return this.findMany({ status: true })
  }

  async findCreatedAfter(date: Date): Promise<exampleModel[]> {
    return this.findMany({
      created_at: {
        gte: date
      }
    })
  }

  async updateStatusBulk(ids: string[], status: boolean): Promise<{ count: number }> {
    return this.updateMany(
      { id: { in: ids } },
      { status }
    )
  }

  async getStatsByStatus(): Promise<Record<string, number>> {
    const stats = await this.prisma.example.groupBy({
      by: ['status'],
      where: { deleted_at: null },
      _count: true
    })

    return stats.reduce((acc, stat) => {
      acc[stat.status ? 'ACTIVE' : 'INACTIVE'] = stat._count
      return acc
    }, {} as Record<string, number>)
  }
}

export const exampleRepository = new ExampleRepository()
