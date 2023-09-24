// import { orderBy, where } from 'firebase/firestore'
import { placesCol } from "../services/firebase";
import { Place, Place_User } from "../types/Place.types";
import useStreamCollection from "./useStreamCollection";

const useGetPlaces = (/* uid: string */) => {
	return useStreamCollection<Place | Place_User>(
		placesCol /* , where('uid', '==', uid), orderBy('completed'), orderBy('title') */
	);
};

export default useGetPlaces;
