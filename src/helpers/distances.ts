const rad = function (x: number) {
	return x * Math.PI / 180;
};

export const getHaversineDistance = (p1: google.maps.LatLngLiteral, p2: google.maps.LatLngLiteral) => {
	const R = 6378137; // Earth’s mean radius in meter
	const dLat = rad(p2.lat - p1.lat);
	const dLong = rad(p2.lng - p1.lng);
	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
		Math.sin(dLong / 2) * Math.sin(dLong / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c;
	return d; // returns the distance in meter
};

export const getDistanceInKm = (distance: number) => {
	if (distance < 1000) return
	return distance / 1000
}
// Use this to render distance on the restaurant-cards ltr:
// // shortest distance (haversine_disctance) between userCurrentposition, and place
// if (usersPosition) {
// 	setDistance(getHaversineDistance(LatLngOfPlace, usersPosition))
// 	console.log('distance:', distance + ' meters')

// }
