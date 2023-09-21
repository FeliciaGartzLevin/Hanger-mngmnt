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
import useGetRestaurantsByCity from '../../../hooks/useGetRestaurantsByCity'

const Map = () => {
	const { position: usersPosition, error } = useGetCurrentLocation()
	const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 55.6, lng: 13 }) //Malmö as default
	const [, setAddress] = useState<string | null>(null)
	const [city, setCity] = useState('')
	const {
		data: restaurants,
		// loading
	} = useGetRestaurantsByCity(city)

	// Finding and showing the location that user requested
	const handleSearchInput = (results: google.maps.GeocoderResult[]) => {
		// console logs for the clarity for now
		console.log('results:', results)
		console.log('Address:', results[0].formatted_address)

		// setting states
		setAddress(results[0].formatted_address)
		const { lat, lng } = getLatLng(results[0])
		setCenter({ lat, lng })

		const component = results[0]?.address_components.find((component) => {
			if (component.types.includes("postal_town") ||
				(component.types.includes("locality"))) {
				console.log("did contain 'postal_town' or 'locality' ")
				return true
			} else {
				console.log("didn't contain 'postal_town' or 'locality' ")
				return false
			}

		})
		if (!component) return

		setCity(component.long_name)
		console.log('component:', component)
	}

	// Finding users location by sending in their position by lat and long
	const handleFindLocation = () => {
		if (!usersPosition) return console.log('no position:', error)
		setCenter(usersPosition)

		console.log('Users current position is:', center)
	}

	// useEffect(() => {

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
			{restaurants && restaurants.map((restaurant) => (
				<MarkerF
					key={restaurant._id}
					position={restaurant.location} />
			))}
		</GoogleMap>

	)
}

export default Map
