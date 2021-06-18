import { rtDatabase } from '../firebase'
import firebase from "firebase/app";
import 'firebase/database'

export function newUserSignedUp(userId) {
    rtDatabase.ref().child("users").child(userId).get().then((snapshot) => {
        if (snapshot.exists()) {
            return
        } else {
            rtDatabase.ref('users/' + userId).set({
                maxSize: 100000000, //100 Mo
                availableSize: 100000000, //100Mo
            });
        }
    });
}

export function newFileAdded(userId, fileSize) {
    const updates = {};
    updates[`users/${userId}/availableSize`] = firebase.database.ServerValue.increment(-fileSize);
    rtDatabase.ref().update(updates);
}

export function newFileDeleted(userId, fileSize) {
    const updates = {};
    updates[`users/${userId}/availableSize`] = firebase.database.ServerValue.increment(fileSize);
    rtDatabase.ref().update(updates);
}