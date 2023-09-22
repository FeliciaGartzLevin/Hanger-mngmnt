import React from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow as LocationIcon } from '@fortawesome/free-solid-svg-icons'
import PlacesAutoComplete from './PlacesAutoComplete'

type Props = {
	handleFindLocation: () => void
	handleLatLng: (results: google.maps.GeocoderResult[]) => void
}

const SearchBox: React.FC<Props> = ({ handleFindLocation, handleLatLng }) => {

	return (
		<Container style={{
			position: 'relative',
			top: '4rem',
			width: '20rem',
		}}>

			<Container
				className='rounded d-flex flex-row align-items-center justify-content-between'
				style={{
					background: 'white',
					padding: '0.5rem',
					boxShadow: ' 8px 8px 5px rgba(0, 0, 0, 0.56)',
				}}>
				<PlacesAutoComplete
					onClickedPlace={(results) => handleLatLng(results)}
					searchPlacesOfTypes={['postal_town']}
				/>
				<Button
					onClick={handleFindLocation}
					aria-label='Use my location'
					className='mx-2 rounded-circle'
					style={{
						marginLeft: '2rem',
						background: 'rgb(134, 0, 85)',
					}}
					type='submit'
				>
					<FontAwesomeIcon icon={LocationIcon} />
				</Button>
			</Container>
		</Container>
	)
}

export default SearchBox
