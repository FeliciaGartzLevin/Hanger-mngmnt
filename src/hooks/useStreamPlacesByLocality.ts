import { where } from 'firebase/firestore'
import useStreamCollection from './useStreamCollection'
import { placesCol } from '../services/firebase'
import { Place } from '../types/Place.types'

const useStreamPlacesByLocality = (locality: string, filter: string) => {
	return useStreamCollection<Place>(
		placesCol,
		where("city", "==", locality),
		where("isApproved", "==", true),
		where(
			"category",
			"in",
			filter === "All"
				? [
					"Café",
					"Pub",
					"Restaurant",
					"Fast Food",
					"Kiosk/grill",
					"Food Truck",
				]
				: [filter]
		),
	)
}

export default useStreamPlacesByLocality
