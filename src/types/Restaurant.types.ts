type BaseRestaurant = {
	_id: string;
	uid: string;
	isAdmin: boolean;
	name: string;
	streetAddress: string;
	city: string;
	description: string;
	category: Category;
	supply: Supply;
	location: google.maps.LatLngLiteral;
  };

  export type Restaurant = BaseRestaurant & {
	email: string;
	telephone: string;
	website: string;
	facebook: string;
	instagram: string;
  };

  export type Restaurant_User = BaseRestaurant & {
	email?: string;
	telephone?: string;
	website?: string;
	facebook?: string;
	instagram?: string;
  };

export type Category = 'Café' | 'Restaurant' | 'Fast food' | 'Kiosk/grill' | 'Food truck';

export type Supply = 'General Menu'|'Lunch' | 'After Work' | 'Middag/Á la carte'


export type Location = {
	latitude: number;
	longitude: number;
};
