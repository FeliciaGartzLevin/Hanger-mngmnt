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
import { useSearchParams } from 'react-router-dom'

const Map = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const locality = searchParams.get("locality") ?? ''
	const { position: usersPosition, error: currentPositionError } = useGetCurrentLocation()
	const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 55.6, lng: 13 }) //Malmö as default
	// const [address, setAddress] = useState<string | null>(null)
	const [city, setCity] = useState('')
	const [/* error */, setError] = useState<string | null>(null)
	const {
		data: places,
		// isLoading: isLoadingPlaces,
	} = useGetPlacesByCity(city)

	const basicActions = (results: google.maps.GeocoderResult[]) => {
		try {
			// getting coordinates
			const { lat, lng } = getLatLng(results[0])

			// setAddress(results[0].formatted_address)
			// center the map on the searched city
			setCenter({ lat, lng })

			// getting the city ('postal_town' or 'locality') from the response
			const foundCity = findAdressComponent(results)

			if (!foundCity) return
			console.log('foundCity:', foundCity)
			setCity(foundCity)
			setSearchParams({ locality: foundCity })
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			setError(error.message)
		}
	}

	// Getting users position by reverse geocoding (by coordinates)
	const getCurrentCity = async (position: google.maps.LatLngLiteral | undefined) => {
		if (!position) return
		try {
			// reversed geocoding to get the users address:
			const results = await getGeocode({ location: position })
			console.log('usersPositionResults', results)

			basicActions(results)

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			setError(error.message)
			console.log('No current city was found:', error)
		}
	}

	// Handling click on localisation button
	const handleFindLocation = async () => {
		if (!usersPosition) return console.log('no position:', currentPositionError)
		try {
			getCurrentCity(usersPosition)

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			setError(error.message)
		}
	}

	// Finding and showing the location that user requested in the queryinput autocomplete-form
	const handleSearchInput = (results: google.maps.GeocoderResult[]) => {
		// console logs for the clarity for now
		console.log('googleMapAPIresults:', results)
		try {
			basicActions(results)

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			setError(error.message)
		}
	}

	// Getting city info by city name
	const queryCity = useCallback(async (city: string) => {
		try {
			// querying the geocoding API in order to get the users address
			const results = await getGeocode({ address: city + ', Sverige' })
			console.log('results', results)

			// getting coordinates
			const { lat, lng } = getLatLng(results[0])

			// setAddress(results[0].formatted_address)
			// center the map on the searched city
			setCenter({ lat, lng })

			// getting the city ('postal_town' or 'locality') from the response
			const foundCity = findAdressComponent(results)

			if (!foundCity) return
			console.log('foundCity:', foundCity)
			setCity(foundCity)

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.log('No city was found:', error.message)
			setError('No  city was found: ' + error.message)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []
	)

	useEffect(() => {
		if (!city) return
		queryCity(city)
		console.log('places', places)
	}, [city, queryCity])

	useEffect(() => {
		if (!locality) return
		queryCity(locality)
	}, [locality, queryCity])

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
