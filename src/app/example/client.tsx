'use client'

import { useState } from 'react'
import {
  createExampleAction,
  deleteExampleAction,
  getAllExamplesAction,
  type Example
} from '@/actions/example'

interface Props {
  initialExamples: Example[]
}

export default function ExampleClient({ initialExamples }: Props) {
  const [examples, setExamples] = useState<Example[]>(initialExamples)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadExamples() {
    setLoading(true)
    const result = await getAllExamplesAction()
    if (result.success && result.data) {
      setExamples(result.data)
    }
    setLoading(false)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const result = await createExampleAction({
      name,
      status: true
    })

    if (result.success) {
      setName('')
      await loadExamples()
    } else {
      alert(result.error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this example?')) return

    const result = await deleteExampleAction(id)
    if (result.success) {
      await loadExamples()
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Examples</h1>

      <form onSubmit={handleCreate} className="mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="border px-4 py-2 rounded mr-2"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          Create
        </button>
      </form>

      <ul className="space-y-2">
        {examples.map((example) => (
          <li
            key={example.id}
            className="flex justify-between items-center border p-4 rounded"
          >
            <div>
              <span className="font-medium">{example.name}</span>
              <span className="ml-2 text-sm text-gray-500">
                ({example.status ? 'Active' : 'Inactive'})
              </span>
            </div>
            <button
              onClick={() => handleDelete(example.id)}
              className="text-red-500 hover:text-red-700 disabled:opacity-50"
              disabled={loading}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
