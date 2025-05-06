import './App.css'
import { CivicAuthProvider } from './context/auth-provider'
import { CivicProvider } from './context/CivicProvider'
import { Route } from './routes/route'

function App() {
  console.log('hi')

  return (
    <CivicProvider>
      <CivicAuthProvider>
        <Route />
      </CivicAuthProvider>
    </CivicProvider>
  )
}

export default App
