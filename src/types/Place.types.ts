export type Place = {
	_id: string;
	name: string;
	streetAddress: string;
	city: string;
	description: string;
	category: Category;
	supply: Supply
	email?: string;
	telephone?: string;
	website?: string;
	facebook?: string;
	instagram?: string;
	location: google.maps.LatLngLiteral;
}

export type Category = 'Café' | 'Restaurant' | 'Fast food' | 'Kiosk/grill' | 'Food truck'

export type Supply = 'Lunch' | 'After Work' | 'Middag/Á la carte'


export type Location = {
	latitude: number;
	longitude: number;
}

export type Recomendation = {
	_id: string
	userId: string // ID of the user who made the recommendation
	restaurantId: string; // ID of the recommended restaurant
	recommendationText: string;
}
