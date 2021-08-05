import { useSelector } from 'react-redux'
import Login from './login'
import ListCollection from './listCollection'


const View = () => {
  const deployID = useSelector((state) => state.main.deployID)
  return deployID ? <ListCollection /> : <Login></Login>
}

export default View
