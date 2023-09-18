import { useState, useMemo, useCallback, useRef } from 'react'
import {
	GoogleMap,
	Marker,
	DirectionsRenderer,
	Circle,
	MarkerClusterer,
} from '@react-google-maps/api'
import SearchBox from './SearchBox'

// this center must ltr be dynamic depending on
// the city searched for or the users location
const center = { lat: 55.6, lng: 13 } //Malmö


const handleSearchInput = (queryInput: string) => {
	console.log('queryInput:', queryInput)
}

const handleFindLocation = (location: google.maps.LatLngLiteral) => {
	console.log('Users location:', location)
}

const Map = () => {

	return (
		<GoogleMap
			zoom={14}
			center={center}
			mapContainerStyle={{
				width: '100%',
				height: '100vh',
				// style away the tiny scroll
				// check johans video about it
			}}
		>
			<SearchBox
				onQuerySubmit={handleSearchInput}
				handleFindLocation={handleFindLocation}
			/>
			<Marker position={center} />
		</GoogleMap>

	)
}

export default Map
