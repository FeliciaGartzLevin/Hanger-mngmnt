import { useLoadScript } from "@react-google-maps/api"
import Map from "../../components/NoLogInPages/MapPage.tsx/Map"
import Container from "react-bootstrap/Container"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

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
		<Container fluid id='Map'>
			<Row className='d-flex justify-content center'>
				{/* Make the restaurants an offcanvas ltr?
				Maybe only on small screens, or on all screens? */}
				<Col sm={{ span: 3 }} >
					<h1>Restaurants</h1>
				</Col>
				<Col sm={{ span: 9 }}>
					<Map />
				</Col>
			</Row>
		</Container >
	)
}

export default MapPage
