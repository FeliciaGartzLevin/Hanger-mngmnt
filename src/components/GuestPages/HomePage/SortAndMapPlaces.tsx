import React from 'react'
import { FilterPlacesType, Place } from '../../../types/Place.types'
import PlaceCards from './PlaceCards'
import useGetCurrentLocation from '../../../hooks/useGetCurrentLocation'
import { getPlacesWithDistances } from '../../../helpers/distances'

type Props = {
	places: Place[]
	filter: FilterPlacesType
}

const SortAndMapPlaces: React.FC<Props> = ({ places, filter }) => {
	const { position } = useGetCurrentLocation()

	if (!position) {
		return places
			.sort((a, b) => a.name.localeCompare(b.name))
			.map((place) =>
			(
				<PlaceCards
					key={place._id}
					place={place}
				/>
			))

	}

	const placesWithDistance = getPlacesWithDistances(position, places)
	const sortedPlaces = filter === 'distance'
		? placesWithDistance
		: placesWithDistance
			.sort((a, b) => a.name.localeCompare(b.name))

	return sortedPlaces
		.map((place) =>
		(
			<PlaceCards
				key={place._id}
				place={place}
			/>
		))
}

export default SortAndMapPlaces
