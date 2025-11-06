import { Button } from '@/components/ui/button'
import { Card } from '@/components/card'
import { useNavigate } from "react-router-dom";
export default function DefaultPage() {
    const navigate = useNavigate();
    return (
        <div className="App">
            <header className="App-header">
                <h1>Hello World</h1>
                <Card>
                    <h2>Card Title</h2>
                    <p>This is a card component.</p>
                    <Button onClick={() => alert('Button inside card clicked!')}>Click Me</Button>
                    <Button onClick={() => navigate("/login")}>To login</Button>
                </Card>
            </header>
        </div>
    )
}
