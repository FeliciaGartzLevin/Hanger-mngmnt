import PlaceModal from "./PlaceModal"
import SearchBox from "./SearchBox"
import { findAdressComponent } from "../../../helpers/locations"
import useGetCurrentLocation from "../../../hooks/useGetCurrentLocation"
import { useCallback, useEffect, useState } from "react"
import { GoogleMap, MarkerF } from "@react-google-maps/api"
import { getGeocode, getLatLng } from "use-places-autocomplete"
import { useSearchParams } from "react-router-dom"
import { Place } from "../../../types/Place.types"
import {
	getDistanceInMetresOrKm,
	getHaversineDistance,
} from "../../../helpers/distances"
import { getIconForCategory } from "../../../helpers/icons"
import { Alert } from "react-bootstrap"
import userIcon from "../../../assets/images/hangry-face-map.png"
import useStreamPlacesByLocality from "../../../hooks/useStreamPlacesByLocality"

type Props = {
	placesFound: (places: Place[]) => void
}

const Map: React.FC<Props> = ({ placesFound }) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const locality = searchParams.get("locality") ?? "Malmö"
	const filter = searchParams.get("filter") ?? "All"
	const { position: usersPosition, error: currentPositionError } = useGetCurrentLocation()
	const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 55.6, lng: 13, }) //Malmö as default
	const [errorMsg, setErrorMsg] = useState<string | null>(null)
	const [showPlaceModal, setShowPlaceModal] = useState(false)
	const [clickedPlace, setClickedPlace] = useState<Place | null>(null)

	const { data: places, getCollection, error } = useStreamPlacesByLocality(locality, filter)

	const basicActions = (results: google.maps.GeocoderResult[]) => {
		try {
			// getting coordinates
			const { lat, lng } = getLatLng(results[0])

			// center the map on the searched city
			setCenter({ lat, lng })

			// getting the city ('postal_town' or 'locality') from the response
			const foundCity = findAdressComponent(results)

			if (!foundCity) return
			// setCity(foundCity)
			setSearchParams({ locality: foundCity, filter: filter })
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			setErrorMsg(error.message)
		}
	}

	// Getting users position by reverse geocoding (by coordinates)
	const getCurrentCity = async (position: google.maps.LatLngLiteral | undefined) => {
		if (!position) return
		try {
			// reversed geocoding to get the users address:
			const results = await getGeocode({ location: position })

			basicActions(results)

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			setErrorMsg(error.message)
		}
	}

	// Handling choice of filter
	const handleFilterChoice = (passedFilter: string) => {
		setSearchParams({ locality: locality, filter: passedFilter })
	}

	// Handling clicking the crosshairs button for getting users location
	const handleFindLocation = async () => {
		if (!usersPosition) return setErrorMsg("Position not accessible. " + currentPositionError?.message)

		try {
			await getCurrentCity(usersPosition)

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			return setErrorMsg("An unexpected error occurred. " + error.message)
		}
	}

	// Handling click on map marker
	const handleMarkerClick = (place: Place) => {
		setShowPlaceModal(true)
		if (!usersPosition) return setClickedPlace(place)
		const distance = Math.round(
			getHaversineDistance(usersPosition, place.location)
		)
		const distanceText = getDistanceInMetresOrKm(distance)
		setClickedPlace({ ...place, distance, distanceText })
	}

	// Finding and showing the location that user requested in the queryinput autocomplete-form
	const handleSearchInput = (results: google.maps.GeocoderResult[]) => {
		try {
			basicActions(results)

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			setErrorMsg(error.message)
		}
	}

	// Getting city info by city name for Google Maps API
	const queryCity = useCallback(async (city: string) => {
		try {
			// querying the geocoding API in order to get the users address
			const results = await getGeocode({ address: city + ", Sverige" })

			// getting coordinates
			const { lat, lng } = getLatLng(results[0])

			// center the map on the searched city
			setCenter({ lat, lng })

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			setErrorMsg("No  city was found. " + error.message)
		}
	}, [])

	// Get info of city every time locality changes
	useEffect(() => {
		if (!locality) return
		queryCity(locality)

	}, [locality, queryCity])

	// Passing places to parent component
	useEffect(() => {
		if (places) {
			placesFound(places)
		}
	}, [places, placesFound])

	// Getting places for current locality
	useEffect(() => {
		if (locality) {
			getCollection()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [locality, filter])

	return (
		<GoogleMap
			zoom={14}
			center={center}
			options={{
				clickableIcons: true,
				mapTypeControl: false,
			}}
			mapContainerClassName="map-container"
			mapContainerStyle={{
				width: "100%",
				height: "100vh",
				// style away the tiny scroll
				// check johans video about it
			}}
		>
			{usersPosition && (
				<MarkerF
					position={usersPosition}
					icon={{
						url: userIcon,
						scaledSize: new window.google.maps.Size(32, 32),
					}}
					animation={google.maps.Animation.BOUNCE}
				/>
			)}
			<SearchBox
				passOnResults={handleSearchInput}
				handleFindLocation={handleFindLocation}
				passFilter={handleFilterChoice}
				filter={filter}
			/>
			{places &&
				places.map((place) => (
					<MarkerF
						key={place._id}
						position={place.location}
						clickable={true}
						title={place.name}
						onClick={() => handleMarkerClick(place)}
						icon={{
							url: getIconForCategory(place.category) ?? "", // Set the icon based on the category
							scaledSize: new window.google.maps.Size(32, 32), // Adjust the icon size
						}}
					/>
				))}
			{clickedPlace && (
				<PlaceModal
					onClose={() => setShowPlaceModal(false)}
					place={clickedPlace}
					show={showPlaceModal}
				/>
			)}

			{errorMsg && (
				<Alert
					style={{
						position: "absolute",
						left: "50%",
						bottom: "4rem",
					}}
					variant="danger"
				>
					An error occured. {errorMsg}
				</Alert>
			)}

			{error && (
				<Alert
					style={{
						position: "absolute",
						left: "50%",
						bottom: "4rem",
					}}
					variant="danger"
				>
					Places could not be loaded from the database.{" "}
					{error}
				</Alert>
			)}
		</GoogleMap>
	)
}

export default Map
