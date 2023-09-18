import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow as LocationIcon } from '@fortawesome/free-solid-svg-icons'

type Props = {
	onQuerySubmit: (queryInput: string) => void
	handleFindLocation: (location: google.maps.LatLngLiteral) => void
}

const SearchBox: React.FC<Props> = ({ onQuerySubmit, handleFindLocation }) => {
	const [queryInput, setQueryInput] = useState("")
	const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!queryInput.trim().length) return

		// send the query string to parent function
		onQuerySubmit(queryInput)

		// reset input field
		setQueryInput("")
	}

	const findUsersLocation = (e: React.FormEvent) => {
		e.preventDefault()
		if (!currentLocation) return

		handleFindLocation(currentLocation)
	}

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
				<Form
					onSubmit={handleSubmit}
				>
					<InputGroup >
						<Form.Control
							type='text'
							placeholder='Search location'
							onChange={e => setQueryInput(e.target.value)}
							value={queryInput}
						/>
						<Button style={{
							padding: '0.3rem',
							background: 'rgb(134, 0, 85)',
						}}
							disabled={!queryInput.trim().length}
							type='submit'
						>
							Search
						</Button>
					</InputGroup>
				</Form>
				<Form onSubmit={findUsersLocation}>
					<Button
						aria-label='Use my location'
						className='mx-2 rounded-circle'
						style={{
							marginLeft: '2rem',
							background: 'rgb(134, 0, 85)',
						}}
						type='submit'
						onClick={() => setCurrentLocation({ lat: 55.6, lng: 13 })}
					>
						<FontAwesomeIcon icon={LocationIcon} />
					</Button>
				</Form>
			</Container>
		</Container>
	)
}

export default SearchBox
