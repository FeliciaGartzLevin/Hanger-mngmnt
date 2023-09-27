import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import FormSelect from 'react-bootstrap/FormSelect'
import { BiCurrentLocation as FaLocationArrow } from 'react-icons/bi'
import PlacesAutoComplete from './PlacesAutoComplete'
import { SelectCategory } from '../../../types/Place.types'

type Props = {
	handleFindLocation: () => void
	passOnResults: (results: google.maps.GeocoderResult[]) => void
	passFilter: (filter: string) => void
	filter: string
}

const categoriesArr: SelectCategory[] = ['All', 'Café', 'Pub', 'Restaurant', 'Fast Food', 'Kiosk/grill', 'Food Truck']

const SearchBox: React.FC<Props> = ({ handleFindLocation, passOnResults, passFilter, filter }) => {

	return (
		<Container
			className='rounded'
			style={{
				position: 'relative',
				top: '3rem',
				maxWidth: '30rem',
				background: 'white',
				padding: '0.5rem',
				boxShadow: '8px 8px 5px rgba(0, 0, 0, 0.56)'
			}}>
			<Row className='d-flex align-items-center justify-content-between'>
				<Col xs={6}>
					<PlacesAutoComplete
						placeHolderText={'Search location'}
						onClickedPlace={(results) => passOnResults(results)}
						searchPlacesOfTypes={['postal_town']}
					/>
				</Col>
				<Col xs={4}>
					<FormSelect
						id='select'
						name='select'
						onChange={e => passFilter(e.target.value)}
						value={filter}
						title="select"
						aria-label="Choose a genre">

						{categoriesArr.map(category => {
							return <option
								key={category}
								value={category}>
								{category}
							</option>
						})}

					</FormSelect>
				</Col>
				<Col xs={2}>
					<Button
						onClick={handleFindLocation}
						aria-label="Use my location"
						variant='dark'
						type='submit'
					>
						<FaLocationArrow style={{ fontSize: '1.5rem' }} />
					</Button>
				</Col>
			</Row>
		</Container>
	)
}

export default SearchBox
