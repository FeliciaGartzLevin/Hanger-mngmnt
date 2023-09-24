import { Place } from '../types/Place.types'
import { where } from 'firebase/firestore'
import useStreamCollection from './useStreamCollection'
import { placesOnlyCol } from '../services/firebase'

const useGetPlacesByCity = (city: string | null) => {
	return useStreamCollection<Place>(
		placesOnlyCol,
		where("city", "==", city),
	)
}

export default useGetPlacesByCity
