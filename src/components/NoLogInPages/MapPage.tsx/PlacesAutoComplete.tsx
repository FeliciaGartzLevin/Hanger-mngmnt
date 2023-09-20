import React from 'react'
import usePlacesAutoComplete, { getGeocode } from 'use-places-autocomplete'
import useOnclickOutside from "react-cool-onclickoutside";

type Props = {
	onClickedPlace: (results: google.maps.GeocoderResult[]) => void
}

const PlacesAutoComplete: React.FC<Props> = ({ onClickedPlace }) => {
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

	const handleSelect = ({ description }: { description: string }) =>
		async () => {
			// When the user selects a place, we can replace the keyword without request data from API
			// by setting the second parameter to "false"
			setValue(description, false);
			clearSuggestions();

			// Get latitude and longitude via utility functions
			const results = await getGeocode({ address: description })

			// console.log('results:', results)
			// console.log('Address:', results[0].formatted_address)
			// console.log('Ort:', results[0].address_components[0].long_name)

			// const { lat, lng } = getLatLng(results[0])
			// // console.log("📍 Coordinates: ", { lat, lng })

			onClickedPlace(results)

		}

	const renderSuggestions = () =>
		data.map((suggestion) => {
			const {
				place_id,
				structured_formatting: { main_text, secondary_text },
			} = suggestion

			return (
				<>
					<li
						key={place_id}
						className='autoComplete-options'
						onClick={handleSelect(suggestion)}>
						<strong>{main_text}</strong> <small>{secondary_text}</small>
					</li>
					<hr />
				</>
			)
		})

	return (
		<div ref={ref}>
			<input
				style={{
					padding: '0.2rem 0.5rem',
				}}
				onClick={() => setValue('')}
				value={value}
				onChange={e => setValue(e.target.value)}
				disabled={!ready
				}
				placeholder="Search location"
			/>
			{status === "OK" &&
				<ul style={{
					listStyle: 'none',
					padding: '0 0.5rem',
					backgroundColor: 'black',
				}}>
					{renderSuggestions()}
				</ul>}
		</div >
	)
}

export default PlacesAutoComplete
