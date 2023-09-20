import { useEffect, useState } from 'react'
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
import useGetRestaurantsByCity from '../../../hooks/useGetRestaurantsByCity'

const Map = () => {
	const { position: usersPosition, error } = useGetCurrentLocation()
	const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 55.6, lng: 13 }) //Malmö as default
	const [address, setAddress] = useState<string | null>(null)
	const [city, setCity] = useState<string | null>(null)

	// Finding and showing the location that user requested
	const handleSearchInput = (results: google.maps.GeocoderResult[]) => {
		// console logs for the clarity for now
		console.log('results:', results)
		console.log('Address:', results[0].formatted_address)
		console.log('Ort:', results[0].address_components[0].long_name)

		// setting states
		setAddress(results[0].formatted_address)
		setCity(results[0].address_components[0].long_name)
		const { lat, lng } = getLatLng(results[0])
		setCenter({ lat, lng })

		// console logging again :PpPpPpPpP
		console.log('Finding and showing the location that user requested:', { lat, lng })
	}

	// Finding users location by sending in their position by lat and long
	const handleFindLocation = () => {
		if (!usersPosition) return console.log('no position:', error)
		setCenter(usersPosition)

		console.log('Users current position is:', center)
	}

	// useEffect(() => {
	// 	const {
	// 		data: restaurants,
	// 		loading
	// 	} = useGetRestaurantsByCity(city)
	// }, [city])

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
				handleLatLng={handleSearchInput}
				handleFindLocation={handleFindLocation}
			/>

			<MarkerF position={center} />
		</GoogleMap>

	)
}

export default Map
