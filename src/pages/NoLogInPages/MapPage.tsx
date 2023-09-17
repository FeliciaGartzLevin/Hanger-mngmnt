import { useLoadScript } from "@react-google-maps/api"
import Map from "../../components/NoLogInPages/MapPage.tsx/Map"
import Container from "react-bootstrap/Container"

const MapPage = () => {
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: import.meta.env.VITE_GEOCODE_API_KEY,
		// libraries: ['places']
	})

	//add other loading animation here ltr
	if (!isLoaded) return (
		<Container>
			<p>Loading...</p>
		</Container>
	)

	return (
		<Map />
	)
}

export default MapPage
