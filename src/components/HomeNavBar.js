import React from 'react'
import { Navbar, Nav} from "react-bootstrap";

export default function HomeNavBar() {
    return (
        <>
            <Navbar bg="dark" variant="dark" className="p-2 d-flex">
                <Navbar.Brand href="/home" className=" flex-grow-1">Sud Cloud</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/signup">Sign Up</Nav.Link>
                    <Nav.Link href="/login">Log In</Nav.Link>
                </Nav>
            </Navbar>
        </>
    )
}
