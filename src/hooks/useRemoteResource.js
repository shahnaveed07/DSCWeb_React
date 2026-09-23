import { useEffect, useState } from 'react'

export function useRemoteResource(loader, deps = [], options = {}) {
  const { enabled = true, initialData = null } = options
  const [data, setData] = useState(initialData)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(enabled)

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return undefined
    }

    const controller = new AbortController()
    let active = true

    setLoading(true)
    setError(null)

    Promise.resolve(loader(controller.signal))
      .then((result) => {
        if (!active) return
        setData(result)
      })
      .catch((nextError) => {
        if (!active || nextError?.name === 'AbortError') return
        setError(nextError)
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [enabled, ...deps])

  return { data, error, loading, setData }
}
