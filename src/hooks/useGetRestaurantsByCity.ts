import { Restaurant } from '../types/Restaurant.types'
import { where } from 'firebase/firestore'
import useStreamCollection from './useStreamCollection'
import { restaurantsCol } from '../services/firebase'

const useGetRestaurantsByCity = (city: string | null) => {
	return useStreamCollection<Restaurant>(
		restaurantsCol,
		where("city", "==", city),
	)
}

export default useGetRestaurantsByCity
