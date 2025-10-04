'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Application Error</h2>
            <p className="mb-4">A critical error occurred.</p>
            <button 
              onClick={reset}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
            >
              Try again
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Refresh page
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
