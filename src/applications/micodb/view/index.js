import { useSelector } from 'react-redux'
import Login from './login'
import Sheets from './sheets'
const View = () => {
  const deployID = useSelector((state) => state.main.deployID)
  return deployID ? <Sheets /> : <Login></Login>
}

export default View
