import {
	UserCredential,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	User,
	signOut,
	sendPasswordResetEmail,
	updateProfile,
	updateEmail,
	updatePassword,
} from 'firebase/auth'
import { createContext, useEffect, useState } from 'react'
import PuffLoader from 'react-spinners/PuffLoader'
import { auth, usersCol } from '../services/firebase'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'

type AuthContextType = {
	currentUser: User|null
	login: (email: string, password: string) => Promise<UserCredential>
	logout: () => Promise<void>
	reloadUser: () => Promise<boolean>
	resetPassword: (email: string) => Promise<void>
	setEmail: (email: string) => Promise<void>
	setDisplayName: (displayName: string) => Promise<void>
	setPassword: (password: string) => Promise<void>
	setPhotoUrl: (photoURL: string) => Promise<void>
	signup: (email: string, name: string, password: string) => Promise<User>
	userEmail: string|null
	userName: string|null
	userPhotoUrl: string|null
}

export const AuthContext = createContext<AuthContextType|null>(null)

type AuthContextProps = {
	children: React.ReactNode
}

const AuthContextProvider: React.FC<AuthContextProps> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<User|null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [userEmail, setUserEmail] = useState<string|null>(null)
	const [userName, setUserName] = useState<string|null>(null)
	const [userPhotoUrl, setUserPhotoUrl] = useState<string|null>(null)

	const login = (email: string, password: string) => {
		return signInWithEmailAndPassword(auth, email, password)
	}

	const logout = () => {
		return signOut(auth)
	}

	const reloadUser = async () => {
		if (!auth.currentUser) {
			return false
		}

		setUserName(auth.currentUser.displayName)
		setUserEmail(auth.currentUser.email)
		setUserPhotoUrl(auth.currentUser.photoURL)

		return true
	}

	const resetPassword = (email: string) => {
		return sendPasswordResetEmail(auth, email, {
			url: window.location.origin + "/login",
		})
	}

	const setEmail = (email: string) => {
		if (!currentUser) { throw new Error("Current User is null!") }
		return updateEmail(currentUser, email)
	}

	const setPassword = (password: string) => {
		if (!currentUser) { throw new Error("Current User is null!") }
		return updatePassword(currentUser, password)
	}

	const setDisplayName = (displayName: string) => {
		if (!currentUser) { throw new Error("Current User is null!") }
		return updateProfile(currentUser, { displayName })
	}

	const setPhotoUrl = (photoURL: string) => {
		if (!currentUser) { throw new Error("Current User is null!") }
		setUserPhotoUrl(photoURL)
		return updateProfile(currentUser, { photoURL })
	}

	const signup = async (email: string, name: string, password: string) => {
		const newUserCredential = await createUserWithEmailAndPassword(auth, email, password)
		const newUser = newUserCredential.user

		const randomPhoto = 'https://picsum.photos/200'

		updateProfile(newUser, {
			displayName: name,
			photoURL: randomPhoto
		})
		setUserName(name)
		setPhotoUrl(randomPhoto)

		const docRef = doc(usersCol)
		setDoc(docRef, {
			createdAt: serverTimestamp(),
			email,
			isAdmin: false,
			name,
			photoUrl: randomPhoto,
			uid: newUser.uid,
			updatedAt: serverTimestamp()
		})

		return newUser
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user)

			if (user) {
				setUserEmail(user.email)
				setUserName(user.displayName)
				setUserPhotoUrl(user.photoURL)
			} else {
				setUserEmail(null)
				setUserName(null)
				setUserPhotoUrl(null)
			}
			setIsLoading(false)
		})

		return unsubscribe
	}, [])

	return (
		<AuthContext.Provider value={{
			currentUser,
			login,
			logout,
			reloadUser,
			resetPassword,
			setDisplayName,
			setEmail,
			setPassword,
			setPhotoUrl,
			signup,
			userEmail,
			userName,
			userPhotoUrl,
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
