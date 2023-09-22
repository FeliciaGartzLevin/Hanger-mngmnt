import { useCallback, useEffect, useState } from 'react'
import {
	GoogleMap,
	MarkerF,
	// DirectionsRenderer,
	// Circle,
	// MarkerClusterer,
} from '@react-google-maps/api'
import SearchBox from './SearchBox'
import useGetCurrentLocation from '../../../hooks/useGetCurrentLocation'
import { getGeocode, getLatLng } from 'use-places-autocomplete'
import useGetPlacesByCity from '../../../hooks/useGetPlacesByCity'
import { findAdressComponent } from '../../../helpers/locations'

const getCurrentCity = async (position: google.maps.LatLngLiteral | undefined) => {
	if (!position) return
	try {
		// reversed geocoding to get the users address:
		const usersPositionResults = await getGeocode({ location: position })

		console.log('usersPositionResults', usersPositionResults)

		// getting the city ('postal_town' or 'locality') from the response
		const foundCity = findAdressComponent(usersPositionResults)

		if (!foundCity) return

		console.log('foundCity:', foundCity)
		return foundCity

	} catch (error) {
		console.log('No current city was found:', error)
	}
}

const Map = () => {
	const { position: usersPosition, error } = useGetCurrentLocation()
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

		if (!foundCity) return

		setCity(foundCity)
		console.log('foundCity:', foundCity)
	}

	// Finding users location by sending in their position by lat and long
	const handleFindLocation = () => {
		if (!usersPosition) return console.log('no position:', error)
		setCenter(usersPosition)
		console.log('Users current position is:', center)
	}

	// useEffect(() => {

	// 	console.log('city:', city)
	// }, [city])

	const getCity = useCallback(async () => {
		// const foundCity = await getCurrentCity(usersPosition)
		// if (!foundCity) return
		// setCity(foundCity)
		// console.log('foundCity', foundCity)
		console.log('running getCity function')

	}, [])

	useEffect(() => {
		getCity()
	}, [getCity])

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
