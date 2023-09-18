import { useState, useMemo, useCallback, useRef } from 'react'
import {
	GoogleMap,
	Marker,
	DirectionsRenderer,
	Circle,
	MarkerClusterer,
} from '@react-google-maps/api'
import SearchBox from './SearchBox'



const Map = () => {
	// this center must ltr be dynamic depending on
	// the city searched for or the users location
	const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null)

	// { lat: 55.6, lng: 13 } //Malmö

	// Finding and showing the location that user requested
	const handleSearchInput = (queryInput: string) => {
		console.log('Finding and showing the location that user requested:', queryInput)
	}

	// Finding users location by sending in their position by lat and long
	const handleFindLocation = () => {
		console.log('Finding users location by sending in their position by lat and long...')
		if (!navigator.geolocation) return

		// MAKE CUSTOM HOOK LTR: get and use the current position of user
		navigator.geolocation.getCurrentPosition((position) => {
			// getting current long and lat
			const { latitude, longitude } = position.coords;
			setCenter({ lat: latitude, lng: longitude });

		}, (error) => {
			console.error('Error getting user location:', error);
		})
		console.log('Users current position is:', center)
	}

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
