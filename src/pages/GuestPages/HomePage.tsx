import { Libraries, useLoadScript } from "@react-google-maps/api"
import Map from "../../components/GuestPages/HomePage/Map"
import Container from "react-bootstrap/Container"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// defining used libraries outside page so
// it wont rerender and give a performance warning
const libraries: Libraries = ['places']

const MapPage = () => {

	// connect to maps API
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: import.meta.env.VITE_GEOCODE_API_KEY,
		libraries: libraries,
	})

	if (!isLoaded) return (
		<Container>
			{/* add other loading animation here ltr */}
			<p>Loading...</p>
		</Container>
	)

	return (

		<Container fluid id='App'>
			<Row className='d-flex justify-content center'>
				{/* Make the places an offcanvas ltr?
				Maybe only on small screens, or on all screens? */}
				<Col sm={{ span: 3 }} >
					<h1>Places</h1>
				</Col>
				<Col sm={{ span: 9 }}>
					<Map />
				</Col>
			</Row>
		</Container >
	)
}

export default MapPage
