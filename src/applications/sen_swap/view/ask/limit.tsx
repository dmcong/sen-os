import { useState } from 'react'

import { Button } from '@senswap/sen-ui'

const Limit = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => {
  const [limit, setLimit] = useState('0')

  return (
    <Button type="text" size="small" style={{ fontSize: 11, marginRight: -7 }}>
      Limit
    </Button>
  )
}

export default Limit
