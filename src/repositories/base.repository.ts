import { PrismaClient } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'

export interface BaseEntity {
  id: string
  created_at: Date
  updated_at: Date | null
  deleted_at?: Date | null
}

type ModelDelegate = {
  findMany: (args?: object) => Promise<object[]>
  findUnique: (args: object) => Promise<object | null>
  findFirst: (args?: object) => Promise<object | null>
  create: (args: object) => Promise<object>
  createMany: (args: object) => Promise<{ count: number }>
  update: (args: object) => Promise<object>
  updateMany: (args: object) => Promise<{ count: number }>
  delete: (args: object) => Promise<object>
  deleteMany: (args: object) => Promise<{ count: number }>
  count: (args?: object) => Promise<number>
  upsert: (args: object) => Promise<object>
}

type PrismaTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
>

type WhereInput = Record<string, unknown>
type OrderByInput = Record<string, unknown> | Record<string, unknown>[]

export interface FindOptions {
  where?: WhereInput
  orderBy?: OrderByInput
  include?: Record<string, unknown>
  skip?: number
  take?: number
}

export class BaseRepository<T extends BaseEntity> {
  protected model: ModelDelegate
  protected prisma: PrismaClient

  constructor(modelName: string) {
    this.prisma = prisma
    this.model = (prisma as unknown as Record<string, ModelDelegate>)[modelName]
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    return this.model.findMany({
      where: {
        deleted_at: null,
        ...options?.where,
      },
      orderBy: options?.orderBy ?? { created_at: 'desc' },
      include: options?.include,
      skip: options?.skip,
      take: options?.take,
    }) as Promise<T[]>
  }

  async findById(id: string, include?: Record<string, unknown>): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
      include,
    }) as Promise<T | null>
  }

  async findOne(where: WhereInput, include?: Record<string, unknown>): Promise<T | null> {
    return this.model.findFirst({
      where: {
        deleted_at: null,
        ...where,
      },
      include,
    }) as Promise<T | null>
  }

  async findMany(where: WhereInput, options?: Omit<FindOptions, 'where'>): Promise<T[]> {
    return this.model.findMany({
      where: {
        deleted_at: null,
        ...where,
      },
      orderBy: options?.orderBy ?? { created_at: 'desc' },
      include: options?.include,
      skip: options?.skip,
      take: options?.take,
    }) as Promise<T[]>
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create({ data }) as Promise<T>
  }

  async createMany(data: Partial<T>[]): Promise<{ count: number }> {
    return this.model.createMany({ data })
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    }) as Promise<T>
  }

  async updateMany(where: WhereInput, data: Partial<T>): Promise<{ count: number }> {
    return this.model.updateMany({
      where: {
        deleted_at: null,
        ...where,
      },
      data,
    })
  }

  async softDelete(id: string, deletedBy?: string): Promise<T> {
    return this.model.update({
      where: { id },
      data: { deleted_by: deletedBy, deleted_at: new Date() },
    }) as Promise<T>
  }

  async softDeleteMany(where: WhereInput, deletedBy?: string): Promise<{ count: number }> {
    return this.model.updateMany({
      where: {
        deleted_at: null,
        ...where,
      },
      data: { deleted_by: deletedBy, deleted_at: new Date() },
    })
  }

  async hardDelete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    }) as Promise<T>
  }

  async hardDeleteMany(where: WhereInput): Promise<{ count: number }> {
    return this.model.deleteMany({ where })
  }

  async restore(id: string): Promise<T> {
    return this.model.update({
      where: { id },
      data: { deleted_at: null },
    }) as Promise<T>
  }

  async restoreMany(where: WhereInput): Promise<{ count: number }> {
    return this.model.updateMany({
      where,
      data: { deleted_at: null },
    })
  }

  async count(where?: WhereInput): Promise<number> {
    return this.model.count({
      where: {
        deleted_at: null,
        ...where,
      },
    })
  }

  async exists(where: WhereInput): Promise<boolean> {
    const count = await this.model.count({
      where: {
        deleted_at: null,
        ...where,
      },
    })
    return count > 0
  }

  async paginate(options: {
    page: number
    pageSize: number
    where?: WhereInput
    orderBy?: OrderByInput
    include?: Record<string, unknown>
  }) {
    const { page, pageSize, where, orderBy, include } = options
    const skip = (page - 1) * pageSize

    const [data, total] = await Promise.all([
      this.findMany(where ?? {}, { orderBy, include, skip, take: pageSize }),
      this.count(where),
    ])

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1,
      },
    }
  }

  async upsert(where: WhereInput, create: Partial<T>, update: Partial<T>): Promise<T> {
    return this.model.upsert({ where, create, update }) as Promise<T>
  }

  async transaction<R>(fn: (tx: PrismaTransactionClient) => Promise<R>): Promise<R> {
    return this.prisma.$transaction(fn)
  }
}