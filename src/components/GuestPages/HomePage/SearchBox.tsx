import React from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faLocationArrow as LocationIcon } from '@fortawesome/free-solid-svg-icons'
import { FaLocationArrow } from 'react-icons/fa'
import PlacesAutoComplete from './PlacesAutoComplete'

type Props = {
	handleFindLocation: () => void
	passOnResults: (results: google.maps.GeocoderResult[]) => void
}

const SearchBox: React.FC<Props> = ({ handleFindLocation, passOnResults }) => {

	return (
		<Container style={{
			position: 'relative',
			top: '4rem',
			maxWidth: '25em'
		}}>

			<Container
				className='rounded d-flex flex-row align-items-center justify-content-between'
				style={{
					background: 'white',
					padding: '0.5rem',
					boxShadow: '8px 8px 5px rgba(0, 0, 0, 0.56)'
				}}>
				<PlacesAutoComplete
					onClickedPlace={(results) => passOnResults(results)}
					searchPlacesOfTypes={['postal_town']}
				/>
				<Button
					onClick={handleFindLocation}
					aria-label="Use my location"
					variant='secondary'
					className='rounded-circle'
					style={{
						position: 'absolute',
						top: '8px',
						right: '18px'
					}}
					type='submit'
				>
					<FaLocationArrow />
				</Button>
			</Container>
		</Container>
	)
}

export default SearchBox
