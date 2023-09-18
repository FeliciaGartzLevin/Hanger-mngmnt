import { useState } from 'react'

const useGetCurrentLocation = () => {
	const [position, setPosition] = useState<google.maps.LatLngLiteral | undefined>({ lat: 55.6, lng: 13 }) //Malmö as default
	const [error, setError] = useState<GeolocationPositionError | null>(null)

	// get and use the current position of user
	navigator.geolocation.getCurrentPosition((position) => {
		// getting current long and lat
		const { latitude, longitude } = position.coords;
		setPosition({ lat: latitude, lng: longitude });

	}, (error) => {
		console.error('Error getting user location:', error);
		setError
	})

	return {
		position,
		error
	}
}

export default useGetCurrentLocation
