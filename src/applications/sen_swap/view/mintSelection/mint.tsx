import { Space, Avatar, Icon, Typography, Card, Divider } from '@senswap/sen-ui'

const Mint = ({
  logoURI,
  symbol,
  name,
  onClick,
}: {
  logoURI: string | undefined
  symbol: string
  name: string
  onClick: () => void
}) => {
  return (
    <Card
      bodyStyle={{ padding: `8px 16px`, cursor: 'pointer' }}
      bordered={false}
      onClick={onClick}
      hoverable
    >
      <Space size={12} style={{ marginLeft: -4 }}>
        <Avatar src={logoURI} size={32}>
          <Icon name="diamon-outline" />
        </Avatar>
        <Typography.Text style={{ margin: 0 }}>{symbol}</Typography.Text>
        <Divider type="vertical" style={{ margin: 0 }} />
        <Typography.Text type="secondary" style={{ margin: 0, fontSize: 11 }}>
          {name}
        </Typography.Text>
      </Space>
    </Card>
  )
}

export default Mint
