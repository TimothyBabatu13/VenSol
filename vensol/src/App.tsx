import './App.css'
import { CivicProvider } from './context/CivicProvider'
import { Route } from './routes/route'

function App() {
  console.log('hi')
  return (
    <CivicProvider>
      <Route />
    </CivicProvider>
  )
}

export default App
