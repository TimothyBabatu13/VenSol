import './App.css'
import { CivicProvider } from './context/CivicProvider'
import { Route } from './routes/route'

function App() {

  return (
    <div className='w-[98%] mx-auto'>
    <CivicProvider>
      <Route />
    </CivicProvider>
    </div>
  )
}

export default App
