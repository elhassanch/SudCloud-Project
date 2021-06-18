import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { useAuth } from '../../contexts/AuthContext'
import { storage, database } from '../../firebase'
import { ROOT_FOLDER } from '../../hooks/useFolder';
import { v4 as uuidV4 } from 'uuid'
import { ProgressBar, Toast } from 'react-bootstrap';
import { rtDatabase } from '../../firebase'
import { newFileAdded } from '../SizeCalculator';




export default function AddFileButton({ currentFolder }) {

    const { currentUser } = useAuth();
    const [uploadingFiles, setuploadingFiles] = useState([])
    const [openT, setOpenT] = useState(false);
    const [avSize, setAvSize] = useState(getAvSize());
    const [maxSize, setMaxSize] = useState(getMaxSize());

    function getAvSize() {
        rtDatabase.ref().child("users").child(currentUser.uid).get().then((snapshot) => {
            if (snapshot.exists()) {
                setAvSize(snapshot.val().availableSize)
            }
            
        })
    }
    function getMaxSize() {
        rtDatabase.ref().child("users").child(currentUser.uid).get().then((snapshot) => {
            if (snapshot.exists()) {
                setMaxSize(snapshot.val().maxSize)
            }
        
        })
    }

    function handleUpload(e) {

        const file = e.target.files[0]
        if (currentFolder == null || file == null) return

        rtDatabase.ref().child("users").child(currentUser.uid).get().then((snapshot) => {
            if (snapshot.exists()) {
                const availableSize = snapshot.val().availableSize;
                if (file.size <= availableSize) {

                    const id = uuidV4()
                    setuploadingFiles(prevUploadingFiles => [
                        ...prevUploadingFiles,
                        { id: id, name: file.name, progress: 0, error: false }
                    ])

                    const filePath = currentFolder === ROOT_FOLDER
                        ? `${currentFolder.path.join("/")}/${file.name}`
                        : `${currentFolder.path.join("/")}/${currentFolder.name}/${file.name}`


                    const uploadTask = storage.ref(`/files/${currentUser.uid}/${filePath}`).put(file)

                    uploadTask.on(
                        'state_changed',
                        snapshot => {
                            const progress = snapshot.bytesTransferred / snapshot.totalBytes
                            setuploadingFiles(prevUploadingFiles => {
                                return prevUploadingFiles.map(uploadFile => {
                                    if (uploadFile.id === id) {
                                        return { ...uploadFile, progress: progress }
                                    }
                                    return uploadFile
                                })
                            })
                        }, () => {
                            setuploadingFiles(prevUploadingFiles => {
                                return prevUploadingFiles.map(uploadFile => {
                                    if (uploadFile.id === id) {
                                        return { ...uploadFile, error: true }
                                    }
                                    return uploadFile
                                })
                            })

                        }, () => {

                            setuploadingFiles(prevUploadingFiles => {
                                return prevUploadingFiles.filter(uploadFile => {
                                    return uploadFile.id !== id
                                })
                            })

                            uploadTask.snapshot.ref.getDownloadURL().then(url => {
                                database.files.where("name", "==", file.name)
                                    .where("userId", "==", currentUser.uid)
                                    .where("folderId", "==", currentFolder.id)
                                    .get()
                                    .then(existingFiles => {
                                        const existingFile = existingFiles.docs[0]
                                        if (existingFile) {
                                            existingFile.ref.update({ url: url })
                                        } else {
                                            newFileAdded(currentUser.uid, file.size)
                                            database.files.add({
                                                url: url,
                                                name: file.name,
                                                createdAt: database.getCurrentTimestamp(),
                                                folderId: currentFolder.id,
                                                userId: currentUser.uid,
                                                size: file.size,
                                                type: file.type,
                                                path: `/files/${currentUser.uid}/${filePath}`,
                                            })
                                        }
                                    })

                            })
                        })
                }
                else { setOpenT(true) }
            }
        })

    }
    return (
        <>
            <div >

                <p style={{ position: "absolute", bottom: "3rem", left: "4.6rem" }}
                >
                    <small> Total Used Space </small>
                </p>
                <ProgressBar now={(maxSize - avSize) / 1000000} style={{ position: "absolute", bottom: "3rem", left: "2rem", minWidth: "200px" }}
                    variant={avSize < (maxSize * 20) / 100 ? 'danger' : 'primary'}
                />
                {
                    <small className="text-muted" style={{ position: "absolute", bottom: "1.5rem", left: "2.8rem" }}
                    >
                        {(((maxSize - avSize) / 1000000)).toFixed(2)} MB of {((maxSize / 1000000)).toFixed(2)} MB used
                    </small>
                }

            </div>

            <div style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                maxWidth: '178px',

            }}>
                <Toast onClose={() => setOpenT(false)} show={openT} delay={15000} autohide style={{ backgroundColor: '#d9534f' }}>
                    <Toast.Header closeButton={false} className="text-center">
                        {"Insufficient storage space!!"}
                    </Toast.Header>
                </Toast>
            </div>

            <label className="btn btn-outline-success btn-sm m-0 me-2 mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cloud-plus" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z" />
                    <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                </svg>
                <input type='file' onChange={handleUpload} style={{ opacity: 0, position: 'absolute', left: '-9999px' }}
                />
            </label>
            {uploadingFiles.length > 0 &&
                ReactDOM.createPortal(
                    <div style={{
                        position: 'absolute',
                        bottom: '1rem',
                        right: '1rem',
                        maxWidth: '250px'
                    }}>
                        {uploadingFiles.map(file => (
                            <Toast key={file.id} onClose={() => {
                                setuploadingFiles(prevUploadingFiles => {
                                    return prevUploadingFiles.filter(uploadFile => {
                                        return uploadFile.id !== file.id
                                    })
                                })
                            }}>
                                <Toast.Header
                                    closeButton={file.error}
                                    className="text-truncate w-100 d-block">
                                    {file.name}
                                </Toast.Header>
                                <Toast.Body>
                                    <ProgressBar
                                        animated={!file.error}
                                        variant={file.error ? 'danger' : 'primary'}
                                        now={file.error ? 100 : file.progress * 100}
                                        label={
                                            file.error ? "Error" : `${Math.round(file.progress * 100)}%`
                                        }
                                    />
                                </Toast.Body>
                            </Toast>
                        ))

                        }
                    </div>,
                    document.body
                )}
        </>
    )
}
