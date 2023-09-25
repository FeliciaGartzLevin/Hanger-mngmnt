import { Libraries, useLoadScript } from "@react-google-maps/api"
import Map from "../../components/GuestPages/HomePage/Map"
import Container from "react-bootstrap/Container"
import Alert from "react-bootstrap/Alert"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas'
import { useState } from "react"
import { Place, Supply } from "../../types/Place.types"
import { MdMenuOpen } from "react-icons/md";
import PlaceCards from "../../components/GuestPages/HomePage/PlaceCards"

// defining used libraries outside page so
// it wont rerender and give a performance warning
const libraries: Libraries = ['places']

const HomePage = () => {
	const [filter, setFilter] = useState<Supply | null>(null)
	const [places, setPlaces] = useState<Place[] | null>(null)
	const [show, setShow] = useState(false);

	// connect to maps API
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: import.meta.env.VITE_GEOCODE_API_KEY,
		libraries: libraries,
	})

	if (!isLoaded) return (
		<Container className="justify-content-center">
			<Alert variant="warning">Loading...</Alert>
		</Container>
	)

	if (loadError) return (
		<Container className="justify-content-center">
			<Alert variant="warning">
				The was an error loading the page. Error: {loadError.message}
			</Alert>
		</Container>
	)

	return (
		<>
			{/* Offcanvas and button to launch it showing in all below large screens */}
			<Offcanvas
				className="d-block d-md-none offcanvas"
				lg={() => setShow(false)}
				show={show}
				onHide={() => setShow(false)}>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>Places</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					{places && places.map((place) =>
					(
						<PlaceCards
							key={place._id}
							place={place}
						/>
					)
					)}
				</Offcanvas.Body>
			</ Offcanvas>
			<Button
				className="d-lg-none offcanvas-btn"
				variant="secondary"
				onClick={() => setShow(true)}
			>
				<MdMenuOpen />
			</Button >

			{/* Sidebar showing in all above large screens */}
			<Container fluid id="App" className="py-3 center-y">
				<Row className='d-flex justify-content-center'>
					{/* Fix a scroll here for overflow */}
					<Col className="d-none d-lg-block" lg={{ span: 3 }} >
						<h2>Places</h2>
						{places && places.map((place) =>
						(
							<PlaceCards
								key={place._id}
								place={place}
							/>
						)
						)}
					</Col>
					<Col lg={{ span: 9 }}>
						<Map
							placesFound={(placesFound) => setPlaces(placesFound)}
						/>
					</Col>
				</Row>
			</Container >
		</>
	)
}

export default HomePage
