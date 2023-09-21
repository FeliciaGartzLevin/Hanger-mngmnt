export const getPostalTown = (results: google.maps.GeocoderResult[]) => {
	let postal_town = ''
	// Find the city component in the address_components array
	results[0]?.address_components.find((component) => {
		if (component.types[0] !== ("postal_town")) return 'none'
		postal_town = component.long_name
	})
	return postal_town
}
