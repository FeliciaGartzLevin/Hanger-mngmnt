import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'

type Props = {
	onSubmit: (queryInput: string) => void
}

const SearchBox: React.FC<Props> = ({ onSubmit }) => {
	const [queryInput, setQueryInput] = useState("")

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!queryInput.trim().length) {
			return
		}

		onSubmit(queryInput)

		setQueryInput("")
	}

	return (
		<Container style={{
			position: 'relative',
			top: '4rem',
			width: '15rem',
		}}>

			<Form
				className='rounded'
				onSubmit={handleSubmit}
				style={{
					background: 'white',
					padding: '0.5rem',
					boxShadow: ' 8px 8px 5px rgba(0, 0, 0, 0.56)',
				}}>
				<InputGroup className='d-flex justify-content-center'>
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
						type='submit'
					>
						Search
					</Button>
				</InputGroup>
			</Form>
		</Container>
	)
}

export default SearchBox
