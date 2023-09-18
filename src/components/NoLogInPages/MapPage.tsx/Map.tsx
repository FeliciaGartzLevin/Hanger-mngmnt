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
		<GoogleMap
			zoom={14}
			center={center}
			mapContainerStyle={{
				width: '100%',
				height: '100vh',
				// style away the tiny scroll
				// check johans vid about it
			}}
		>

			<Marker position={center} />
		</GoogleMap>

	)
}

export default Map
