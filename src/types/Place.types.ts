export type Location = {
	latitude: number
	longitude: number
}

export type Place = {
	_id: string
	category: Category
	city: string
	description: string
	email?: string
	facebook?: string
	instagram?: string
	isApproved: boolean
	location: google.maps.LatLngLiteral
	name: string
	streetAddress: string
	supply: Supply
	telephone?: string
	uid: string
	website?: string
}

export type Category = 'Café' | 'Pub' | 'Restaurant' | 'Fast Food' | 'Kiosk/grill' | 'Food Truck'

export type Supply = 'General Menu' | 'Lunch' | 'After Work' | 'Dinner' | 'Breakfast/Brunch'

export type PlaceWithDistance = Place & {
	distance?: number
	distanceText?: string
}

export type SelectCategory = Category | 'All'
