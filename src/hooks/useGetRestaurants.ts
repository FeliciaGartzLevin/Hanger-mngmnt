// import { orderBy, where } from 'firebase/firestore'
import { restaurantsCol } from '../services/firebase'
import { Restaurant } from '../types/Restaurant.types'
import useStreamCollection from './useStreamCollection'

const useGetRestaurants = (/* uid: string */) => {
	return useStreamCollection<Restaurant>(restaurantsCol/* , where('uid', '==', uid), orderBy('completed'), orderBy('title') */)
}

export default useGetRestaurants
