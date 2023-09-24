import useStreamCollection from './useStreamCollection'
import { placesCol } from '../services/firebase'
import { Place } from '../types/Place.types'

const useGetPlaces = () => {
	return useStreamCollection<Place>(
		placesCol
	)
}

export default useGetPlaces
