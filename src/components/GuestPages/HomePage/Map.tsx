import { useState } from 'react'
import {
	GoogleMap,
	MarkerF,
	// DirectionsRenderer,
	// Circle,
	// MarkerClusterer,
} from '@react-google-maps/api'
import SearchBox from './SearchBox'
import useGetCurrentLocation from '../../../hooks/useGetCurrentLocation'
import { getLatLng } from 'use-places-autocomplete'
import useGetPlacesByCity from '../../../hooks/useGetPlacesByCity'
import { findAdressComponent, getCurrentCity } from '../../../helpers/locations'

const Map = () => {
	const { position: usersPosition, error: currentPositionError } = useGetCurrentLocation()
	const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 55.6, lng: 13 }) //Malmö as default
	const [, setAddress] = useState<string | null>(null)
	const [city, setCity] = useState('')
	const {
		data: places,
		// loading
	} = useGetPlacesByCity(city)

	// Finding and showing the location that user requested
	const handleSearchInput = (results: google.maps.GeocoderResult[]) => {
		// console logs for the clarity for now
		console.log('googleMapAPIresults:', results)

		// setting states
		setAddress(results[0].formatted_address)
		const { lat, lng } = getLatLng(results[0])

		setCenter({ lat, lng })

		const foundCity = findAdressComponent(results)

		if (!foundCity) return //error here but how to get it from the function?

		setCity(foundCity)
		console.log('foundCity:', foundCity)
	}

	// Finding users location by sending in their position by lat and long
	const handleFindLocation = async () => {
		if (!usersPosition) return console.log('no position:', currentPositionError)

		// send in users coordinates in order to get the name of the city they're in
		const foundCity = await getCurrentCity(usersPosition)

		if (!foundCity) return

		setCity(foundCity)

		// Set the center of the map to users position
		setCenter(usersPosition)
	}

	return (
		<GoogleMap
			zoom={14}
			center={center}
			options={{
				clickableIcons: true,
			}}
			mapContainerClassName='map-container'
			mapContainerStyle={{
				width: '100%',
				height: '100vh',
				// style away the tiny scroll
				// check johans video about it
			}}
		>
			<SearchBox
				passOnResults={handleSearchInput}
				handleFindLocation={handleFindLocation}
			/>
			{places && places.map((place) => (
				<MarkerF
					key={place._id}
					position={place.location}
					clickable={true}
					opacity={0.8}
					title={place.name}

				/>
			))}
		</GoogleMap>

	)
}

export default Map
