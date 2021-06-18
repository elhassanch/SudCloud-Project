import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { newUserSignedUp } from "../components/SizeCalculator";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext)
};

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading]=useState(true)

    

    function signup(email, password, name) {
        return auth.createUserWithEmailAndPassword(email, password).then((user) => {
            return auth.currentUser.updateProfile({ displayName: name,
                                                    photoURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1024px-Circle-icons-profile.svg.png' })
        });
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }

    function socialMediaAuth(provider) {
        return auth.signInWithPopup(provider);
    }

    function logout() {
        return auth.signOut();
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email);
    }

    function verify() {
        return currentUser.sendEmailVerification();
    }

    function updateName(name) {
        return currentUser.updateProfile({displayName: name})
    }

    function updateImage(imageURL) {
        return currentUser.updateProfile({photoURL: imageURL})
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email);
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
            newUserSignedUp(user.uid)
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateName,
        updateEmail,
        updatePassword,
        socialMediaAuth,
        verify,
        updateImage
    };
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
};

