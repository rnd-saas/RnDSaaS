import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import { Card } from './components/card'

function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello World</h1>
        <Card>
          <h2>Card Title</h2>
          <p>This is a card component.</p>
          <Button onClick={() => alert('Button inside card clicked!')}>Click Me</Button>
        </Card>
      </header>
    </div>
  )
}

export default App;