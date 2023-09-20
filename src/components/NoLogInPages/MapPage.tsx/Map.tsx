import { useState, useMemo } from 'react'
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

const Map = () => {
	const { position, error } = useGetCurrentLocation()
	const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 55.6, lng: 13 }) //Malmö as default
	const mapOptions = useMemo<google.maps.MapOptions>(() => ({
		clickableIcons: false,
	}), [])

	// Finding and showing the location that user requested
	const handleSearchInput = (results: google.maps.GeocoderResult[]) => {

		console.log('results:', results)
		console.log('Address:', results[0].formatted_address)
		console.log('Ort:', results[0].address_components[0].long_name)

		const { lat, lng } = getLatLng(results[0])
		// console.log("📍 Coordinates: ", { lat, lng })
		setCenter({ lat, lng })
		console.log('Finding and showing the location that user requested:', { lat, lng })
	}

	// Finding users location by sending in their position by lat and long
	const handleFindLocation = () => {
		if (!position) return console.log('no position:', error)
		setCenter(position)

		console.log('Users current position is:', center)
	}

	return (
		<GoogleMap
			zoom={14}
			center={center}
			options={mapOptions}
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
