import { useState } from 'react'

/**
 * A hook for getting the current location of the device
 *
 * @returns the current position of the device, and error
 */
const useGetCurrentLocation = () => {
	const [position, setPosition] = useState<google.maps.LatLngLiteral | undefined>(undefined)
	const [error, setError] = useState<GeolocationPositionError | null>(null)

	// get and use the current position of user
	navigator.geolocation.getCurrentPosition((position) => {
		// getting current long and lat
		const { latitude, longitude } = position.coords;
		setPosition({ lat: latitude, lng: longitude });

	}, (error) => {
		console.error('Error getting user location:', error);
		setError(error)
	})


	return {
		position,
		error
	}
}

export default useGetCurrentLocation
