// ponytail: read at request time; Netlify doesn't expose this to the build.
export const indexingAllowed = () => (process.env.ALLOW_INDEXING ?? import.meta.env.ALLOW_INDEXING) === 'true'
