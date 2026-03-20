'use client'

import { useTransition } from 'react'
import { deleteTopicAction } from '../actions'

export default function TopicDeleteButton({ id }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this Topic?')) return
    startTransition(async () => {
      await deleteTopicAction(id)
    })
  }

  return (
    <button onClick={handleDelete} disabled={isPending} className="btn btn-xs btn-error">
      {isPending ? <span className="loading loading-spinner loading-xs" /> : 'Delete'}
    </button>
  )
}
