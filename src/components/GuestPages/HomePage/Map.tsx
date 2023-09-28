import PlaceModal from "./PlaceModal"
import SearchBox from "./SearchBox"
import { findAdressComponent } from "../../../helpers/locations"
import useGetCurrentLocation from "../../../hooks/useGetCurrentLocation"
import {
	FirestoreError,
	QueryConstraint,
	onSnapshot,
	query,
	where,
} from "firebase/firestore"
import { useCallback, useEffect, useState } from "react"
import { GoogleMap, MarkerF } from "@react-google-maps/api"
import { getGeocode, getLatLng } from "use-places-autocomplete"
import { useSearchParams } from "react-router-dom"
import { placesCol } from "../../../services/firebase"
import { Place } from "../../../types/Place.types"
import {
	getDistanceInMetresOrKm,
	getHaversineDistance,
} from "../../../helpers/distances"
import { getIconForCategory } from "../../../helpers/icons"
import { Alert } from "react-bootstrap"
import userIcon from "../../../assets/images/hangry-face-map.png"
import { FirebaseError } from "firebase/app"

type Props = {
	placesFound: (places: Place[]) => void
}

const Map: React.FC<Props> = ({ placesFound }) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const locality = searchParams.get("locality") ?? "Malmö"
	const filter = searchParams.get("filter") ?? "All"
	const { position: usersPosition, error: currentPositionError } = useGetCurrentLocation()
	const [center, setCenter] = useState<google.maps.LatLngLiteral>({
		lat: 55.6,
		lng: 13,
	}) //Malmö as default
	const [errorMsg, setErrorMsg] = useState<string | null>(null)
	const [firestoreError, setFirestoreError] = useState<FirestoreError | null>(
		null
	)
	const [places, setPlaces] = useState<Place[] | null>(null)
	const [showPlaceModal, setShowPlaceModal] = useState(false)
	const [clickedPlace, setClickedPlace] = useState<Place | null>(null)
	const [, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null)



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
	const getCurrentCity = async (
		position: google.maps.LatLngLiteral | undefined
	) => {
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

	// handling pressing the crosshairs button for getting users location
	const handleFindLocation = async () => {
		if (!usersPosition) {
			return setErrorMsg("No position." + currentPositionError?.message)
		}

		try {
			await getCurrentCity(usersPosition)

			// Set the user's current location state variable.
			setUserLocation(usersPosition)

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			if (error instanceof FirebaseError) {

				return setErrorMsg("Position access denied. " + error.message)
			} else {

				return setErrorMsg("An unexpected error occurred." + error.message)
			}
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

	const setStates = (data: Place[]) => {
		setPlaces(data)
		placesFound(data)
	}

	// Getting city info by city name
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
			setErrorMsg("No  city was found: " + error.message)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const queryConstraints: QueryConstraint[] = [
		where("city", "==", locality),
		where("isApproved", "==", true),
		where(
			"category",
			"in",
			filter === "All"
				? [
					"Café",
					"Pub",
					"Restaurant",
					"Fast Food",
					"Kiosk/grill",
					"Food Truck",
				]
				: [filter]
		),
	]

	// Get info of city every time locality changes
	useEffect(() => {
		if (!locality) return
		queryCity(locality)
		// console.log("places", places)
	}, [locality, queryCity, places])

	// Querying the firestore db for all the places in current city
	useEffect(() => {
		const queryRef = query(placesCol, ...queryConstraints)
		const unsubscribe = onSnapshot(
			queryRef,
			(snapshot) => {
				const data: Place[] = snapshot.docs.map((doc) => {
					return {
						...doc.data(),
						_id: doc.id,
					}
				})
				setStates(data)
			},
			(error) => {
				setFirestoreError(error)
			}
		)

		return unsubscribe
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

			{firestoreError && (
				<Alert
					style={{
						position: "absolute",
						left: "50%",
						bottom: "4rem",
					}}
					variant="danger"
				>
					Places could not be loaded from the database.{" "}
					{firestoreError.message}
				</Alert>
			)}
		</GoogleMap>
	)
}

export default Map
