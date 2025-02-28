function parsePath(path: string) {
  const hashIndex = path.indexOf('#')
  const queryIndex = path.indexOf('?')
  const hasQuery = queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex)

  if (hasQuery || hashIndex > -1) {
    return {
      pathname: path.substring(0, hasQuery ? queryIndex : hashIndex),
      query: hasQuery
        ? path.substring(queryIndex, hashIndex > -1 ? hashIndex : undefined)
        : '',
      hash: hashIndex > -1 ? path.slice(hashIndex) : '',
    }
  }

  return { pathname: path, query: '', hash: '' }
}

function addPathPrefix(path: string, prefix?: string) {
  if (!path.startsWith('/') || !prefix) {
    return path
  }

  const { pathname, query, hash } = parsePath(path)
  return `${prefix}${pathname}${query}${hash}`
}

export function getAnchorProperty<
  T extends HTMLAnchorElement | SVGAElement,
  K extends keyof T,
  P extends T[K]
>(a: T, key: K): P extends SVGAnimatedString ? string : P {
  const prop = a[key]

  if (prop instanceof SVGAnimatedString) {
    const value = prop.baseVal as unknown

    if (key === 'href') {
      return addPathPrefix(value as string, location.origin) as any
    }

    return value as any
  }

  return prop as any
}
