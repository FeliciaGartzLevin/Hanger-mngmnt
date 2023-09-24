import { Libraries, useLoadScript } from "@react-google-maps/api"
import Map from "../../components/GuestPages/HomePage/Map"
import Container from "react-bootstrap/Container"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Offcanvas from 'react-bootstrap/Offcanvas'
import { useState } from "react"
import { Place, Supply } from "../../types/Place.types"
import { MdMenuOpen } from "react-icons/md";
import { IoMailOutline } from "react-icons/io5";

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
		<Container>
			{/* add other loading animation here ltr */}
			<p>Loading...</p>
		</Container>
	)

	return (
		<>
			<Button
				className="d-md-none offcanvas-btn"
				onClick={() => setShow(true)}
			>
				<MdMenuOpen />
				{/* <span className="h4">&laquo;</span> Places */}
			</Button >
			<Container fluid id="App" className="py-3 center-y">
				<Row className='d-flex justify-content-center'>
					{/* Make the places an offcanvas ltr?
				Maybe only on small screens, or on all screens? */}
					<Col className="d-none d-md-block" md={{ span: 3 }} >
						<h2>Places</h2>
					</Col>

					<Offcanvas
						className="d-block d-md-none"
						md={{ span: 0 }}
						show={show}
						onHide={() => setShow(false)}>
						<Offcanvas.Header closeButton>
							<Offcanvas.Title>Places</Offcanvas.Title>
						</Offcanvas.Header>
						<Offcanvas.Body>
							{places && places.map((place) => (
								<Card className="mb-3">
									<Card.Body>
										<Card.Title>{place.name}</Card.Title>
										<hr />
										<Card.Subtitle className="mb-2 text-muted">{place.streetAddress}</Card.Subtitle>
										<Card.Text>
											{place.description}
										</Card.Text>
										{place.email || place.instagram || place.facebook &&
											<Card.Footer>
												<div className="d-flex justify-content-center">
													{place.email && <Card.Link target="_blank" href={place.email}><IoMailOutline /></Card.Link>}
													{place.instagram && <Card.Link target="_blank" href={place.instagram}>Card Link</Card.Link>}
													{place.facebook && <Card.Link target="_blank" href={place.facebook}>Card Link</Card.Link>}
												</div>
											</Card.Footer>}
									</Card.Body>
								</Card>
							))}
						</Offcanvas.Body>
					</ Offcanvas>

					<Col md={{ span: 9 }}>
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
