import JsonViewer from '@/micodb/components/JsonViewer'
import { useSelector } from 'react-redux'

export default function Schema(props) {
  const { collectionName } = props
  const schema = useSelector(
    (state) => state.collection[collectionName]?.schema,
  )
  if (!schema) return null
  return <JsonViewer jsonData={schema}></JsonViewer>
}
