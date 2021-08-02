import { Card, Icon, Input, Button } from '@senswap/sen-ui'
import { SenTradeMark } from 'components/trademark'

const Search = ({
  value,
  onChange,
  disabled = false,
}: {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) => {
  return (
    <Card bodyStyle={{ padding: 8 }} bordered={false}>
      <Input
        placeholder="Search"
        value={value}
        size="small"
        bordered={false}
        prefix={
          <Button
            type="text"
            style={{ marginLeft: -7 }}
            size="small"
            onClick={value ? () => onChange('') : () => {}}
            icon={<Icon name={value ? 'close-outline' : 'search-outline'} />}
            disabled={disabled}
          />
        }
        suffix={<SenTradeMark style={{ marginRight: -7 }} />}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value || '')
        }
        disabled={disabled}
      />
    </Card>
  )
}

export default Search
