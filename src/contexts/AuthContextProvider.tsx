import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
	updateEmail,
	updatePassword,
	updateProfile,
	User
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { createContext, useEffect, useState } from 'react'
import PuffLoader from 'react-spinners/PuffLoader'
import { toast } from 'react-toastify'
import { auth, usersCol } from '../services/firebase'

type AuthContextType = {
	reloadUser: () => Promise<boolean>
	resetPassword: (email: string) => Promise<void>
	setDisplayName: (name: string) => void
	setEmail: (email: string) => void
	setPassword: (password: string) => void
	setPhotoUrl: (photoURL: string) => void
	signInUser: (email: string, password: string) => Promise<void>
	signOutUser: () => Promise<void>
	signUpUser: (email: string, name: string, password: string) => Promise<void>
	signedInUser: User|null
	signedInUserEmail: string|null
	signedInUserName: string|null
	signedInUserPhotoUrl: string|null
}

export const AuthContext = createContext<AuthContextType|null>(null)

type AuthContextProps = {
	children: React.ReactNode
}

const AuthContextProvider: React.FC<AuthContextProps> = ({ children }) => {
	const [signedInUser, setSignedInUser] = useState<User|null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [signedInUserEmail, setSignedInUserEmail] = useState<string|null>(null)
	const [signedInUserName, setSignedInUserName] = useState<string|null>(null)
	const [signedInUserPhotoUrl, setSignedInUserPhotoUrl] = useState<string|null>(null)

	const reloadUser = async () => {
		if (!auth.currentUser) {
			return false
		}

		setSignedInUserName(auth.currentUser.displayName)
		setSignedInUserEmail(auth.currentUser.email)
		setSignedInUserPhotoUrl(auth.currentUser.photoURL)

		return true
	}

	const resetPassword = (email: string) => {
		return sendPasswordResetEmail(auth, email, {
			url: window.location.origin + '/login',
		})
	}

	const setEmail = (email: string) => {
		if (!signedInUser) { throw new Error("No signed in user") }

		const docRef = doc(usersCol, signedInUser.uid)
		updateDoc(docRef, {
			email,
			updatedAt: serverTimestamp()
		})

		return updateEmail(signedInUser, email)
	}

	const setDisplayName = (displayName: string) => {
		if (!signedInUser) { throw new Error("No signed in user") }

		const docRef = doc(usersCol, signedInUser.uid)
		updateDoc(docRef, {
			displayName,
			updatedAt: serverTimestamp()
		})

		return updateProfile(signedInUser, {
			displayName
		})
	}

	const setPassword = (password: string) => {
		if (!signedInUser) { throw new Error("No signed in user") }

		return updatePassword(signedInUser, password)
	}

	const setPhotoUrl = (photoURL: string) => {
		if (!signedInUser) { throw new Error("No signed in user") }

		const docRef = doc(usersCol, signedInUser.uid)
		updateDoc(docRef, {
			photoURL,
			updatedAt: serverTimestamp()
		})

		setSignedInUserPhotoUrl(photoURL)

		toast.dark(photoURL ? "Photo updated" : "Photo deleted")

		return updateProfile(signedInUser, {
			photoURL
		})
	}

	const signInUser = async (email: string, password: string) => {
		const userCredential = await signInWithEmailAndPassword(auth, email, password)
		toast.dark("Welcome back, " + userCredential.user.displayName)
	}

	const signOutUser = () => {
		toast.dark("Welcome back anytime, " + signedInUserName)
		return signOut(auth)
	}

	const signUpUser = async (email: string, displayName: string, password: string) => {
		const newUserCredential = await createUserWithEmailAndPassword(auth, email, password)
		const newUser = newUserCredential.user

		const randomPhoto = 'https://picsum.photos/200'

		updateProfile(newUser, {
			displayName,
			photoURL: randomPhoto
		})
		setSignedInUserName(displayName)
		setSignedInUserPhotoUrl(randomPhoto)

		const docRef = doc(usersCol, newUser.uid)
		setDoc(docRef, {
			createdAt: serverTimestamp(),
			email,
			isAdmin: false,
			displayName,
			photoURL: randomPhoto,
			uid: newUser.uid,
			updatedAt: serverTimestamp()
		})

		toast.dark("Welcome, " + displayName)
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setSignedInUser(user)

			if (user) {
				setSignedInUserEmail(user.email)
				setSignedInUserName(user.displayName)
				setSignedInUserPhotoUrl(user.photoURL)
			} else {
				setSignedInUserEmail(null)
				setSignedInUserName(null)
				setSignedInUserPhotoUrl(null)
			}
			setIsLoading(false)
		})

		return unsubscribe
	}, [])

	return (
		<AuthContext.Provider value={{
			reloadUser,
			resetPassword,
			setDisplayName,
			setEmail,
			setPassword,
			setPhotoUrl,
			signInUser,
			signOutUser,
			signUpUser,
			signedInUser,
			signedInUserEmail,
			signedInUserName,
			signedInUserPhotoUrl
		}}>
			{isLoading ? (
				<div id="initial-loader">
					<PuffLoader color={'#888'} size={15} speedMultiplier={1.1} />
				</div>
			) : (
				<>{children}</>
			)}
		</AuthContext.Provider>
	)
}

export default AuthContextProvider
