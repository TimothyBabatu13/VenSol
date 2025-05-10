import './App.css'
import { CivicAuthProvider } from './context/auth-provider'
import { CivicProvider } from './context/CivicProvider'
import { Route } from './routes/route'

function App() {

  return (
    <div className='w-[98%] mx-auto'>
    <CivicProvider>
      <CivicAuthProvider>
        <Route />
      </CivicAuthProvider>
    </CivicProvider>
    </div>
  )
}

export default App
