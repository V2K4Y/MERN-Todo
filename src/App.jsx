import LoginReg from './LoginReg'
import {UserContext} from './UserContext'

function App() {

  return (
    <UserContext>
      <LoginReg />
    </UserContext> 
  )
}

export default App
