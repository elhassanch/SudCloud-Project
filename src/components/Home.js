import React from "react";
import HomeNavBar from "./HomeNavBar";
import { Container } from "react-bootstrap";
import { Button} from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div style={{backgroundImage:'url(https://cdn.hipwallpaper.com/i/13/17/fPyOia.png)', backgroundSize: 'cover', backgroundRepeat:'no-repeat', backgroundAttachment:'fixed', backgroundPosition:'center'}}>
            <HomeNavBar />
            <div style={{  height: '86vh'}}>
                <div className="text-center">
                    <Container fluid>
                        <h1 className="mt-5 lg">Easy and secure access to all of your content</h1>
                        <h3 fluid className="m-5" >Store, share, and collaborate on files and folders from any mobile device, tablet, or computer</h3>
                    </Container>
                    <Button className="btn btn-dark bg" as={Link} to="/signup">Get Started</Button>
                </div>
            </div>
        </div>
    )
}