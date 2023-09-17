import React from 'react'
import { useState, useMemo, useCallback, useRef } from 'react'
import {
	GoogleMap,
	Marker,
	DirectionsRenderer,
	Circle,
	MarkerClusterer,
} from '@react-google-maps/api'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// type Props = {}

const Map /* : React.FC<Props> */ = (/* {} */) => {
	// this center must ltr be dynamic depending on the city searched for
	const center = useMemo(() => ({ lat: 55.6, lng: 13 }), []) //Malmö

	return (
		<Container fluid id='Map'>
			<Row className='d-flex justify-content center'>
				{/* Make the restaurants an offcanvas ltr?
				Maybe only on small screens, or on all screens? */}
				<Col sm={{ span: 3 }} >
					<h1>Restaurants</h1>
				</Col>
				<Col sm={{ span: 9 }}>
					<GoogleMap
						zoom={14}
						center={center}
						mapContainerStyle={{
							width: '100%',
							height: '100vh'
						}}
					>

					</GoogleMap>
				</Col>
			</Row>
		</Container >
	)
}

export default Map
