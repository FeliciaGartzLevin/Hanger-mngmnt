import { useState, useMemo } from 'react'
import {
	GoogleMap,
	Marker,
	// DirectionsRenderer,
	// Circle,
	// MarkerClusterer,
} from '@react-google-maps/api'
import SearchBox from './SearchBox'
import useGetCurrentLocation from '../../../hooks/useGetCurrentLocation'


const Map = () => {

	// this center must ltr be dynamic depending on
	// the city searched for ❌ or the users location✅
	const { position, error } = useGetCurrentLocation()
	const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 55.6, lng: 13 }) //Malmö as default
	const mapOptions = useMemo<google.maps.MapOptions>(() => ({
		clickableIcons: false,
	}), [])

	// Finding and showing the location that user requested
	const handleSearchInput = ({ lat, lng }: google.maps.LatLngLiteral) => {
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

			<Marker position={center} />
		</GoogleMap>

	)
}

export default Map
