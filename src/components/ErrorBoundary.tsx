'use client'

import { useEffect } from 'react'

const ErrorBoundary = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <h2 className='text-2xl font-bold text-red-600'>Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
      >
        Try again
      </button>
    </div>
  )
}

export default ErrorBoundary 