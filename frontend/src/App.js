import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import LoginForm from './Components/LoginForm/LoginForm'
import HomeForm from './Components/HomeForm/HomeForm'

function App() {
    return (
        <div>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomeForm />} />
                    <Route path="/login" element={<LoginForm />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App
