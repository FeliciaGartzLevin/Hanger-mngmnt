import PlaceModal from './PlaceModal'
import SearchBox from './SearchBox'
import { findAdressComponent } from '../../../helpers/locations'
import useGetCurrentLocation from '../../../hooks/useGetCurrentLocation'
import { FirestoreError, QueryConstraint, onSnapshot, query, where } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'
import {
	GoogleMap,
	MarkerF,
} from '@react-google-maps/api'
import { getGeocode, getLatLng } from 'use-places-autocomplete'
import { useSearchParams } from 'react-router-dom'
import { placesCol } from '../../../services/firebase'
import { Place } from '../../../types/Place.types'

type Props = {
	placesFound: (places: Place[]) => void
}

const Map: React.FC<Props> = ({ placesFound }) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const locality = searchParams.get("locality") ?? ''
	const { position: usersPosition, error: currentPositionError } = useGetCurrentLocation()
	const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 55.6, lng: 13 }) //Malmö as default
	const [city, setCity] = useState('')
	const [/* error */, setError] = useState<FirestoreError | string | null>(null)
	const [places, setPlaces] = useState<Place[] | null>(null)
	const [/* isLoading */, setIsLoading] = useState<boolean>(false)
	const [showPlaceModal, setShowPlaceModal] = useState(false)
	const [clickedPlace, setClickedPlace] = useState<Place | null>(null)


	const basicActions = (results: google.maps.GeocoderResult[]) => {
		try {
			// getting coordinates
			const { lat, lng } = getLatLng(results[0])

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

	// Handling click on map marker
	const handleMarkerClick = (place: Place) => {
		setShowPlaceModal(true)
		setClickedPlace(place)
	}

	const handleClosePlaceModal = () => setShowPlaceModal(false)

	// Finding and showing the location that user requested in the queryinput autocomplete-form
	const handleSearchInput = (results: google.maps.GeocoderResult[]) => {
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

			// getting coordinates
			const { lat, lng } = getLatLng(results[0])

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
	}, [])

	const setStates = (data: Place[]) => {
		setPlaces(data)
		placesFound(data)
		setIsLoading(false)
	}

	const setErrorStates = (error: FirestoreError) => {
		setError(error)
		setIsLoading(false)
	}

	// Get info of city every time city changes
	useEffect(() => {
		if (!city) return
		queryCity(city)
	}, [city, queryCity])

	// Get info of city every time locality changes
	useEffect(() => {
		if (!locality) return
		queryCity(locality)
		console.log('places', places)
	}, [locality, queryCity, places])

	const queryConstraints: QueryConstraint[] = [
		where("city", "==", city)
		// add filters here
	]
	// Querying the firestore db for all the places in current city
	useEffect(() => {
		const queryRef = query(
			placesCol,
			...queryConstraints
		)
		const unsubscribe = onSnapshot(queryRef, (snapshot) => {
			const data: Place[] = snapshot.docs.map(doc => {
				return {
					...doc.data(),
					_id: doc.id,
				}
			})
			setStates(data)

		}, (error) => {
			setErrorStates(error)
		})

		return unsubscribe;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [locality, city, /* filter */])

	return (
		<GoogleMap

			zoom={14}
			center={center}
			options={{
				clickableIcons: true,
				mapTypeControl: false,
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
					title={place.name}
					onClick={() => handleMarkerClick(place)}
				/>
			))}
			<PlaceModal
				onClose={handleClosePlaceModal}
				place={clickedPlace}
				show={showPlaceModal}
			/>
		</GoogleMap>

	)
}

export default Map
