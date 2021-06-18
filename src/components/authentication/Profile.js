import React, { useState } from 'react'
import { Link, useHistory } from "react-router-dom"
import { Button, Card, Alert } from "react-bootstrap";
import { useAuth } from '../../contexts/AuthContext'
import CentredCaontainer from './CentredCaontainer'
import Navbar from '../google-drive/Navbar'

export default function Profile() {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { currentUser, logout, verify } = useAuth();
    const history = useHistory();

    async function handleLogout() {
        setError('')

        try {
            await logout()
            history.pushState('/login')
        } catch {
            setError('Failed to Log Out')
        }
    }

    async function handleVerify() {
        setError('')
        setMessage('')
        try {
            await verify()
            setMessage('Verification sent, Check your Email for further instructions')
        } catch {
            setError('Failed to send verification')
        }
    }

    return (
        <>
            <Navbar />
            <CentredCaontainer>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-2">Profile</h2>
                        <div className="d-flex align-items-center justify-content-center m-2">
                            <img src={currentUser.photoURL} width="100" height="100" style={{ borderRadius: '50%', verticalAlign: 'middle' }} alt="avatar" //onError={()=>setimage()}
                            />
                        </div>

                        {error && <Alert variant="danger">{error}</Alert>}
                        {message && <Alert variant="success">{message}</Alert>}
                        <strong>Name: </strong>{currentUser.displayName}
                        <br />
                        <strong>Email: </strong>{currentUser.email}
                        <div className="d-flex align-items-center">
                            <strong>Is Your Email Verified?:  </strong>{currentUser.emailVerified ? "Yes" : <div className="d-flex align-items-center ms-1"> No.<Button variant="link" onClick={handleVerify}>Verify your Email!</Button></div>}
                        </div>
                        <Link to="/update-profile" className="btn btn-primary w-100 mt-3">Update Profile</Link>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    <Button variant="link" onClick={handleLogout}>Log out</Button>
                </div>
            </CentredCaontainer>
        </>
    )
}
