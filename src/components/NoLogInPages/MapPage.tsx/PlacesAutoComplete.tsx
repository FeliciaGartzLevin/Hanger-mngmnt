import React from 'react'
import usePlacesAutoComplete, { getGeocode, getLatLng } from 'use-places-autocomplete'
// import Form from 'react-bootstrap/Form'
// import InputGroup from 'react-bootstrap/InputGroup'
// import Button from 'react-bootstrap/Button'
import useOnclickOutside from "react-cool-onclickoutside";

type Props = {
	onQuerySubmit: ({ lat, lng }: google.maps.LatLngLiteral) => void
}

const PlacesAutoComplete: React.FC<Props> = ({ onQuerySubmit }) => {
	const {
		ready,
		value,
		setValue,
		suggestions: { status, data },
		clearSuggestions,
	} = usePlacesAutoComplete()
	const ref = useOnclickOutside(() => {
		// When the user clicks outside of the component, we can dismiss
		// the searched suggestions by calling this method
		clearSuggestions()
	})

	// const handleSubmit = (e: React.FormEvent) => {
	// 	e.preventDefault()
	// }

	const handleSelect = ({ description }: { description: string }) =>
		async () => {
			// When the user selects a place, we can replace the keyword without request data from API
			// by setting the second parameter to "false"
			setValue(description, false);
			clearSuggestions();

			// Get latitude and longitude via utility functions
			const results = await getGeocode({ address: description })

			const { lat, lng } = getLatLng(results[0])
			// console.log("📍 Coordinates: ", { lat, lng })

			onQuerySubmit({ lat, lng })

		}

	const renderSuggestions = () =>
		data.map((suggestion) => {
			const {
				place_id,
				structured_formatting: { main_text, secondary_text },
			} = suggestion;

			return (
				<li key={place_id} onClick={handleSelect(suggestion)}>
					<strong>{main_text}</strong> <small>{secondary_text}</small>
				</li>
			)
		})


	return (
		<div ref={ref}>
			<input
				value={value}
				onChange={e => setValue(e.target.value)}
				disabled={!ready
				}
				placeholder="Select location"
			/>
			{/* We can use the "status" to decide whether we should display the dropdown or not */}
			{status === "OK" && <ul>{renderSuggestions()}</ul>}
		</div >


		// < Form
		// 	ref={ref}
		// 	onSubmit={handleSubmit}
		// >
		// 	<InputGroup>
		// 		<Form.Control
		// 			type='text'
		// 			onChange={e => setValue(e.target.value)}
		// 			disabled={!ready
		// 			}
		// 			placeholder="Select location"
		// 			value={value}
		// 		/>
		// 		{status === "OK" && <ul>{renderSuggestions()}</ul>}
		// 		<Button style={{
		// 			padding: '0.3rem',
		// 			background: 'rgb(134, 0, 85)',
		// 		}}
		// 			disabled={!queryInput.trim().length && !ready}
		// 			type='submit'
		// 		>
		// 			Search
		// 		</Button>
		// 	</InputGroup>
		// </ Form >

	)
}

export default PlacesAutoComplete
