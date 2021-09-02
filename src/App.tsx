import { BrowserRouter } from 'react-router-dom'
import PrimaryLayout from './PrimaryLayout'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <BrowserRouter>
      <PrimaryLayout />
    </BrowserRouter>
  )
}

export default App
