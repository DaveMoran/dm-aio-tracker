import { useEffect, useState } from 'react'

/**
 * Subscribe to a CSS media query from JS so component logic can branch on the
 * same breakpoints used by Tailwind's `md:` etc. utilities. Initialised
 * synchronously to avoid a first-paint flash.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** Shared tablet/desktop breakpoint — matches Tailwind's default `md` (768px). */
export const TABLET_QUERY = '(min-width: 768px)'
