import React, { useState } from 'react'
import { Button, Modal, Toast } from 'react-bootstrap'
import { database, storage } from '../../firebase';
import { newFileDeleted } from '../SizeCalculator';
import { useAuth } from '../../contexts/AuthContext'



export default function File({ file }) {
    const { currentUser } = useAuth();
    const [open, setOpen] = useState(false);
    const [openD, setOpenD] = useState(false);
    const [openT, setOpenT] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    function openModal() {
        setOpen(true)
    }

    function closeModal() {
        setOpen(false)
    }
    function openModalD() {
        setOpenD(true)
    }

    function closeModalD() {
        setOpenD(false)
    }


    function deleteFolder(e) {
        e.preventDefault()
        storage.ref().child(file.path).delete()
            .then(database.files.doc(file.id).delete())
            .catch(() => {
                setError(true)
                setMessage("Error!! Can not delete file")
                setOpenT(true)
            }
            )
        newFileDeleted(currentUser.uid, file.size)
        setOpenD(false)
    }

    function downloadFile(e) {
        e.preventDefault()
        storage.ref().child(file.path).getDownloadURL()
            .then((url) => {
                navigator.clipboard.writeText(url)
                setMessage("Link Copied to clipboard!")
                setOpenT(true)
            })
    }

    return (
        <>


            <Button variant="outline-dark" className="d-flex align-items-center raw text-truncate w-100" onClick={openModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-file-earmark-check-fill me-1" viewBox="0 0 16 16">
                    <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm1.354 4.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
                </svg>

                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="col">{file.name}</div>

            </Button>

            <Modal show={open} onHide={closeModal}
                size="lg"
                centered
            >
                <Modal.Header className="container">
                    <Modal.Title className="text-truncate col">{file.name}</Modal.Title>
                    <div>
                        <Button variant="outline-dark" style={{ maxWidth: '120px' }} className="d-flex align-items-center text-truncate" onClick={downloadFile}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-share me-1" viewBox="0 0 16 16">

                                <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
                            </svg>

                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="col">Get Link</div>
                        </Button>
                    </div>
                    <div>
                        <Button variant="danger" style={{ maxWidth: '120px' }} className="d-flex align-items-center text-truncate ms-2" onClick={openModalD}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash-fill me-1" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                            </svg>
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="col">Delete</div>
                        </Button>
                    </div>

                </Modal.Header>

                <Modal.Body style={{
                    maxHeight: 'calc(100vh - 210px)',
                    overflowY: 'auto'
                    //maxWidth: '50vh'
                }}>
                    {file.type && file.type.slice(0, 5) === "image"
                        ? <img src={file.url} className="img-fluid" alt={file.name} />
                        : <iframe title={file.name} className="container-fluid" src={file.url} style={{ height: '500px' }} frameborder="0"></iframe>
                    }

                    <Modal show={openD} onHide={closeModalD}>
                        <Modal.Body className="m-2 text-center">
                            <h4>Are you Sure?</h4>
                        </Modal.Body>
                        <Modal.Footer className="justify-content-center">
                            <Button variant="secondary" className="m-2" onClick={closeModalD}>Cancel</Button>
                            <Button variant="danger" className="m-2" onClick={deleteFolder}>Delete</Button>
                        </Modal.Footer>
                    </Modal>
                    <div style={{
                        position: 'absolute',
                        bottom: '1rem',
                        right: '1rem',
                        maxWidth: '178px',

                    }}>
                        <Toast onClose={() => { setOpenT(false); setMessage(''); setError(false) }} show={openT} delay={error ? 15000 : 6000} autohide style={ error ? {backgroundColor: '#d9534f'} : {backgroundColor: '#22bb33' }}>
                            <Toast.Header closeButton={false} className="text-center">
                                {message}
                            </Toast.Header>
                        </Toast>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                    <a href={file.url} target="_blank">
                        <Button bsStyle="primary">Open In new Tab</Button>
                    </a>
                </Modal.Footer>
            </Modal>
        </>
    )
}