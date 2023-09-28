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
			className='rounded search-box'
			style={{
				position: 'relative',
				top: '3rem',
				maxWidth: '30rem',
				background: 'white',
				padding: '0.5rem',
				boxShadow: '8px 8px 5px rgba(0, 0, 0, 0.56)'
			}}>
			<Row className='d-flex align-items-center justify-content-center rounded'>
				<Col xs={12} md={4} className='searchbox-col'>
					<PlacesAutoComplete
						placeHolderText={'Search location'}
						onClickedPlace={(results) => passOnResults(results)}
						searchPlacesOfTypes={['postal_town']}
					/>
				</Col>
				<Col xs={5} md={3} className='searchbox-col'>
					<FormSelect
						id='select'
						name='select'
						onChange={e => passFilter(e.target.value)}
						value={filter}
						title="select"
						aria-label="Select a place">

						{categoriesArr.map(category => {
							return <option
								key={category}
								value={category}>
								{category}
							</option>
						})}

					</FormSelect>
				</Col>
				<Col xs={5} md={3} className='searchbox-col'>
					<FormSelect
						id='supply'
						name='select'
					// onChange={e => passFilter(e.target.value)}
					// value={filter}
					// title="select"
					// aria-label="Select a place"
					>
						Supply
						{/* {categoriesArr.map(category => {
							return <option
								key={category}
								value={category}>
								{category}
							</option>
						})} */}

					</FormSelect>
				</Col>
				<Col xs={2} md={2} className='searchbox-col'>
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
