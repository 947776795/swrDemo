// import { react } from 'react'
import { SWRConfig } from 'swr'
// import { ErrorContainer } from '@/containers/ErrorContainer'

export const SwrRoot= ({ children }) => {

  return (
    <SWRConfig value={{ dedupingInterval: 0 }}>{children}</SWRConfig>
  )
}
