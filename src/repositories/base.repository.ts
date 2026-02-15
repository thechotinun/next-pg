import { PrismaClient } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'

export interface BaseEntity {
  id: string
  created_at: Date
  updated_at: Date | null
  deleted_at?: Date | null
}

export class BaseRepository<T extends BaseEntity> {
  protected model: any
  protected prisma: PrismaClient

  constructor(modelName: string) {
    this.prisma = prisma
    this.model = (prisma as any)[modelName]
  }

  async findAll(options?: {
    where?: any
    orderBy?: any
    include?: any
    skip?: number
    take?: number
  }): Promise<T[]> {
    return this.model.findMany({
      where: {
        deleted_at: null,
        ...options?.where
      },
      orderBy: options?.orderBy || { created_at: 'desc' },
      include: options?.include,
      skip: options?.skip,
      take: options?.take
    })
  }

  async findById(id: string, include?: any): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
      include
    })
  }

  async findOne(where: any, include?: any): Promise<T | null> {
    return this.model.findFirst({
      where: {
        deleted_at: null,
        ...where
      },
      include
    })
  }

  async findMany(where: any, options?: {
    orderBy?: any
    include?: any
    skip?: number
    take?: number
  }): Promise<T[]> {
    return this.model.findMany({
      where: {
        deleted_at: null,
        ...where
      },
      orderBy: options?.orderBy || { createdAt: 'desc' },
      include: options?.include,
      skip: options?.skip,
      take: options?.take
    })
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data })
  }

  async createMany(data: any[]): Promise<{ count: number }> {
    return this.model.createMany({ data })
  }

  async update(id: string, data: any): Promise<T> {
    return this.model.update({
      where: { id },
      data
    })
  }

  async updateMany(where: any, data: any): Promise<{ count: number }> {
    return this.model.updateMany({
      where: {
        deleted_at: null,
        ...where
      },
      data
    })
  }

  async softDelete(id: string): Promise<T> {
    return this.model.update({
      where: { id },
      data: { deleted_at: new Date() }
    })
  }

  async softDeleteMany(where: any): Promise<{ count: number }> {
    return this.model.updateMany({
      where: {
        deleted_at: null,
        ...where
      },
      data: { deleted_at: new Date() }
    })
  }

  async hardDelete(id: string): Promise<T> {
    return this.model.delete({
      where: { id }
    })
  }

  async hardDeleteMany(where: any): Promise<{ count: number }> {
    return this.model.deleteMany({ where })
  }

  async restore(id: string): Promise<T> {
    return this.model.update({
      where: { id },
      data: { deleted_at: null }
    })
  }

  async restoreMany(where: any): Promise<{ count: number }> {
    return this.model.updateMany({
      where,
      data: { deletedAt: null }
    })
  }

  async count(where?: any): Promise<number> {
    return this.model.count({
      where: {
        deleted_at: null,
        ...where
      }
    })
  }

  async exists(where: any): Promise<boolean> {
    const count = await this.model.count({
      where: {
        deleted_at: null,
        ...where
      }
    })
    return count > 0
  }

  async paginate(options: {
    page: number
    pageSize: number
    where?: any
    orderBy?: any
    include?: any
  }) {
    const { page, pageSize, where, orderBy, include } = options
    const skip = (page - 1) * pageSize

    const [data, total] = await Promise.all([
      this.findMany(where || {}, {
        orderBy,
        include,
        skip,
        take: pageSize
      }),
      this.count(where)
    ])

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1
      }
    }
  }

  async upsert(where: any, create: any, update: any): Promise<T> {
    return this.model.upsert({
      where,
      create,
      update
    })
  }

  async transaction<R>(
    fn: (tx: any) => Promise<R>
  ): Promise<R> {
    return this.prisma.$transaction(fn)
  }
}
