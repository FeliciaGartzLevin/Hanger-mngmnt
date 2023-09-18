import React from 'react'
import { useState, useMemo, useCallback, useRef } from 'react'
import {
	GoogleMap,
	Marker,
	DirectionsRenderer,
	Circle,
	MarkerClusterer,
} from '@react-google-maps/api'
import SearchBox from './SearchBox'

// type Props = {}

const handleSearchInput = (queryInput: string) => {
	console.log('queryInput:', queryInput)

}

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
				// check johans video about it
			}}
		>
			<SearchBox
				onSubmit={handleSearchInput}
			/>
			<Marker position={center} />
		</GoogleMap>

	)
}

export default Map
