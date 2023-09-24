type Category = 'Café' | 'Pub' | 'Restaurant' | 'Fast Food' | 'Kiosk/grill' | 'Food Truck'

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
	isApproved: true
	location: google.maps.LatLngLiteral
	name: string
	streetAddress: string
	supply: Supply
	telephone?: string
	uid: string
	website?: string
}

type Supply = 'General Menu' | 'Lunch' | 'After Work' | 'Dinner' | 'Breakfast/Brunch'