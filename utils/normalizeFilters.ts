export function normalizeFilters(raw: Record<string, any>) {
    const normalized: Record<string, any> = {}

    for (const key in raw) {
        const value = raw[key]

        if (typeof value === 'string') {
            const trimmed = value.trim()
            normalized[key] = trimmed.length > 0 ? trimmed : null
        } else {
            normalized[key] = value ?? null
        }
    }

    return normalized
}
