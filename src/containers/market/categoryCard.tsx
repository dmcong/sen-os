import { Row, Col, Card, Typography, Avatar } from '@senswap/sen-ui'

const CategoryCard = ({
  category,
  onClick = () => {},
}: {
  category: string
  onClick?: () => void
}) => {
  const src = `https://source.unsplash.com/random/?${category},abstract`
  return (
    <Card className="shadowed" style={{ cursor: 'pointer' }} onClick={onClick}>
      <Row gutter={[16, 16]} align="middle" wrap={false}>
        <Col flex="auto">
          <Typography.Text type="secondary">Click to explore</Typography.Text>
          <Typography.Title level={3} style={{ margin: 0 }}>
            {category}
          </Typography.Title>
        </Col>
        <Col>
          <Avatar src={src} size={72} />
        </Col>
      </Row>
    </Card>
  )
}

export default CategoryCard
