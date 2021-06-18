import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link } from "react-router-dom"
import CentredCaontainer from './CentredCaontainer'
import HomeNavBar from '../HomeNavBar'

export default function ForgotPassword() {
    const emailRef = useRef();
    const { resetPassword } = useAuth();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setMessage('')
            setError("")
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Check your inbox for further instructions')
        } catch {
            setError("Failed to reset password")//Email not found in DB
        }

        setLoading(false)
    }

    return (
        <div style={{ backgroundImage: 'url(https://cdn.hipwallpaper.com/i/13/17/fPyOia.png)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed', backgroundPosition: 'center' }}>
            <HomeNavBar />
            <CentredCaontainer>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Password Reset</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {message && <Alert variant="success">{message}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required />
                            </Form.Group>
                            <Button disabled={loading} className="w-100 mt-3" type="submit">Reset Password</Button>
                        </Form>
                        <div className="w-100 text-center mt-3">
                            <Link to="/login">Log In</Link>
                        </div>
                    </Card.Body>
                </Card>

                <Card className="mt-2">
                    <div className="w-100 text-center p-2">
                        Need an account? <Link to="/signup">Sign up</Link>
                    </div>
                </Card>
            </CentredCaontainer>
        </div>
    )
}