import { useCallback, useEffect, useState } from 'react'

export function useLocalList(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : fallback
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  const update = useCallback((next) => {
    setValue(next)
  }, [])

  return [value, update]
}
