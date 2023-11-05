import React from 'react'
import { FilterPlacesType, Place } from '../../../types/Place.types'
import NoPlacesToShow from './NoPlacesToShow'
import SortAndMapPlaces from './SortAndMapPlaces'

type Props = {
	places: Place[]
	filter: FilterPlacesType
}

const SidebarContent: React.FC<Props> = ({ places, filter }) => {
	return places &&
		<>
			<NoPlacesToShow
				places={places}
			/>

			<SortAndMapPlaces
				places={places}
				filter={filter}
			/>
		</>
}

export default SidebarContent
