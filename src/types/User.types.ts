import { Timestamp } from "firebase/firestore"

export type User = {
	createdAt: Timestamp
	email: string,
	isAdmin: boolean
	name: string
	photoUrl: string
	uid: string
	updatedAt: Timestamp
}

export type UserSignUp = {
	email: string,
	name: string,
	password: string,
	passwordConfirm: string
}
