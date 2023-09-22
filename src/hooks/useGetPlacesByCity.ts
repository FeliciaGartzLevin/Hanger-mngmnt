import { Place } from "../types/Place.types";
import { where } from "firebase/firestore";
import useStreamCollection from "./useStreamCollection";
import { placesCol } from "../services/firebase";

const useGetPlacesByCity = (city: string | null) => {
	return useStreamCollection<Place>(
		placesCol,
		where("city", "==", city)
	);
};

export default useGetPlacesByCity;
