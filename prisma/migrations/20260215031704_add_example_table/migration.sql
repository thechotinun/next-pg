-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "example" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_by" VARCHAR(50) NOT NULL DEFAULT 'system',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(50) DEFAULT 'system',
    "updated_at" TIMESTAMP(3),
    "deleted_by" VARCHAR(50) DEFAULT 'system',
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "example_pkey" PRIMARY KEY ("id")
);
