import { Space, TweenOne } from 'sen-kit'

const Dot = ({
  active = false,
  onClick = () => {},
}: {
  active: boolean
  onClick: () => void
}) => {
  return (
    <TweenOne animation={{ scale: active ? 1.65 : 1, duration: 250 }}>
      <div
        style={{
          width: 15,
          height: 4,
          borderRadius: 2,
          backgroundColor: 'white',
          cursor: 'pointer',
        }}
        className={active ? 'neon' : ''}
        onClick={onClick}
      />
    </TweenOne>
  )
}

const DotPagination = ({
  total = 0,
  page = 0,
  onClick = () => {},
}: {
  total: number
  page: number
  onClick: (page: number) => void
}) => {
  let counter = []
  while (counter.length < total) counter.push(counter.length)
  return (
    <Space align="center" size="middle">
      {counter.map((i) => (
        <Dot key={i} active={page === i} onClick={() => onClick(i)} />
      ))}
    </Space>
  )
}

export default DotPagination
