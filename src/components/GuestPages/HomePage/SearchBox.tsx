import React from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow as LocationIcon } from '@fortawesome/free-solid-svg-icons'
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
			width: '25rem',
		}}>

			<Container
				className='rounded d-flex flex-row align-items-center justify-content-between'
				style={{
					background: 'rgba(255,255,255,0.7)',
					padding: '0.5rem',
					boxShadow: ' 8px 8px 5px rgba(0, 0, 0, 0.56)'
				}}>
				<PlacesAutoComplete
					onClickedPlace={(results) => passOnResults(results)}
					searchPlacesOfTypes={['postal_town']}
				/>
				<Button
					onClick={handleFindLocation}
					aria-label="Use my location"
					className='rounded-circle'
					style={{
						background: 'rgb(134, 0, 85)',
						position: 'absolute',
						top: '8px',
						right: '18px'
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
