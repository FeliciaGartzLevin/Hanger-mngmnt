import React from 'react'
import { Place } from '../../../types/Place.types'
import PlaceCards from './PlaceCards'
import useGetCurrentLocation from '../../../hooks/useGetCurrentLocation'
import { getDistanceInMetresOrKm, getHaversineDistance } from '../../../helpers/distances'

type Props = {
	places: Place[]
}

const SortAndMapPlaces: React.FC<Props> = ({ places }) => {
	// getting distance to my position and also send it to Placecard to be rendered
	const { position } = useGetCurrentLocation()

	if (!position) {
		return places.map((place) =>
		(
			<PlaceCards
				key={place._id}
				place={place}
			/>
		)
		)
	}

	const placesWithDistance = places
		.map((place) => {
			const distance = Math.round(getHaversineDistance(position, place.location))
			console.log('The distance to ' + place.name + ' is ' + distance + 'm')
			const distanceText = getDistanceInMetresOrKm(distance)
			return { ...place, distance, distanceText }
		})
		.sort((a, b) => a.distance - b.distance)

	console.log('New places array with distance added, and sorted by it: ', placesWithDistance)

	return placesWithDistance
		.map((place) =>
		(
			<PlaceCards
				key={place._id}
				place={place}
			/>
		)
		)
}

export default SortAndMapPlaces
