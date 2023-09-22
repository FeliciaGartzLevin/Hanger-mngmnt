// import { orderBy, where } from 'firebase/firestore'
import { placesCol } from "../services/firebase";
import { Place } from "../types/Place.types";
import useStreamCollection from "./useStreamCollection";

const useGetPlaces = (/* uid: string */) => {
	return useStreamCollection<Place>(
		placesCol /* , where('uid', '==', uid), orderBy('completed'), orderBy('title') */
	);
};

export default useGetPlaces;
