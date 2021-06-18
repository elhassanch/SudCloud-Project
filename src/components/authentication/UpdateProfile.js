import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import CentredCaontainer from './CentredCaontainer'
import Navbar from '../google-drive/Navbar'

export default function UpdateProfile() {
    const imageRef = useRef()
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { currentUser, updatePassword, updateEmail, updateName, updateImage } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match")
        }

        const promises = [];
        setLoading(true)
        setError("")


        if (imageRef.current.value !== currentUser.photoURL) {
            fetch(imageRef.current.value).then(response => {
                if (response.headers.get("content-type").slice(0, 5) == "image") {
                    promises.push(updateImage(imageRef.current.value))
                }
            })

        }

        if (nameRef.current.value !== currentUser.displayName) {
            promises.push(updateName(nameRef.current.value))
        }

        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value))
        }

        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }



        Promise.all(promises).then(() => {
            history.push("/user");
        }).catch(() => {
            setError("Failed to update account")
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <>
            <Navbar />
            <CentredCaontainer>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Update Profile</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="input" ref={nameRef} required defaultValue={currentUser.displayName} placeholder="Enter your name" />
                            </Form.Group>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required defaultValue={currentUser.email} />
                            </Form.Group>
                            <Form.Group id="image">
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control type="input" ref={imageRef} defaultValue={currentUser.photoURL} placeholder="Enter the URL of your Image" />
                            </Form.Group>

                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} placeholder="Leave blank to keep the same" />
                            </Form.Group>
                            <Form.Group id="password-confirm">
                                <Form.Label>Password Confirmation</Form.Label>
                                <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same" />
                            </Form.Group>
                            <Button disabled={loading} className="w-100 mt-3" type="submit">Update</Button>
                        </Form>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    <Link to="/user">Cancel</Link>
                </div>
            </CentredCaontainer>
        </>
    )
}