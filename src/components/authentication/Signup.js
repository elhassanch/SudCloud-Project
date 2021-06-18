import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import CentredCaontainer from './CentredCaontainer'
import HomeNavBar from '../HomeNavBar'


export default function Signup() {
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match")
        }

        try {
            setError("")
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value, nameRef.current.value)
            history.push("/")
        } catch {
            setError("Failed to create an account")
        }

        setLoading(false)
    }

    return (
        <div style={{ backgroundImage: 'url(https://cdn.hipwallpaper.com/i/13/17/fPyOia.png)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed', backgroundPosition: 'center' }}>
            <HomeNavBar />
            <CentredCaontainer>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Sign Up</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" ref={nameRef} required />
                            </Form.Group>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} required />
                            </Form.Group>
                            <Form.Group id="password-confirm">
                                <Form.Label>Password Confirmation</Form.Label>
                                <Form.Control type="password" ref={passwordConfirmRef} required />
                            </Form.Group>
                            <Button disabled={loading} className="w-100 mt-3" type="submit">Sign Up</Button>
                        </Form>
                    </Card.Body>
                </Card>
                <Card className="mt-2">
                    <div className="w-100 text-center p-2">
                        Already have an account? <Link to="/login">Log In</Link>
                    </div>
                </Card>
            </CentredCaontainer>
        </div>
    )
}