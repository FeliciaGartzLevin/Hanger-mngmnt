// import { getGeocode } from "use-places-autocomplete"

/**
 * A function for extracting the locality name from the getGeocode()-results
 *
 * @param results @type google.maps.GeocoderResult[]
 * @returns The name of the city searched for
 */
export const findAdressComponent = (results: google.maps.GeocoderResult[]) => {

	const component = results[0]?.address_components.find((component) => {
		if (component.types.includes("postal_town") ||
			(component.types.includes("locality"))) {
			return true
		} else {
			return false
		}
	})

	if (!component) return
	return component.long_name
}

// CURRENTLY UNUSED FUNCTION
// /**
//  * Get current name of the city of the user by coordinates
//  *
//  * @param position The coordinates of the users position
//  * @returns The postal_town of the position the user is at, if it's found (should return an error if error, for ltr)
//  */
// export const getCurrentCity = async (position: google.maps.LatLngLiteral | undefined) => {
// 	if (!position) return
// 	try {
// 		// reversed geocoding to get the users address:
// 		const usersPositionResults = await getGeocode({ location: position })

// 		console.log('usersPositionResults', usersPositionResults)

// 		// getting the city ('postal_town' or 'locality') from the response
// 		const foundCity = findAdressComponent(usersPositionResults)

// 		if (!foundCity) return

// 		console.log('foundCity:', foundCity)
// 		return foundCity

// 	} catch (error) {
// 		console.log('No current city was found:', error)
// 	}

// }
