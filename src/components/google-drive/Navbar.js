import React,{useState} from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button, Alert } from "react-bootstrap";

export default function NavbarComponent() {
    const { logout} = useAuth();
    const history = useHistory();
    const [error, setError] = useState('');
    async function handleLogout() {
        setError('')

        try {
            await logout()
            history.pushState('/login')
        } catch {
            setError('Failed to Log Out')
        }
    }
    const { currentUser } = useAuth()
    return (
        <Navbar bg="dark" variant="dark" className="pe-3 ps-3">
            <Navbar.Brand href="/" className="flex-grow-1">
                SUD Drive
            </Navbar.Brand>
            {error && <Alert variant="danger">{error}</Alert>}
            <Nav className="">
                <Nav.Link as={Link} to="/user">
                    {currentUser.displayName}
                    <img src={currentUser.photoURL} className="rounded-circle m-2" width="40" height="40" style={{ borderRadius: '50%', verticalAlign: 'middle' }} alt="avatar" />
                </Nav.Link>
                <Button variant="link" onClick={handleLogout}>Log out</Button>
            </Nav>
        </Navbar>
    )
}

