import { forwardRef } from 'react'

import { Badge } from 'sen-kit'
import { DynamicLogo } from 'helpers/loader'

const LogoInMarket = forwardRef<
  HTMLElement,
  { installed?: boolean; onClick: () => void }
>(({ installed = false, ...rest }, ref) => {
  if (installed)
    return (
      <Badge.Ribbon text="Installed">
        <DynamicLogo {...rest} ref={ref} />
      </Badge.Ribbon>
    )
  return <DynamicLogo {...rest} ref={ref} />
})

export default LogoInMarket
