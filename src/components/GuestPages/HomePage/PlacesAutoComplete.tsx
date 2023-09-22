import React from 'react'
import usePlacesAutoComplete, { getGeocode } from 'use-places-autocomplete'
import useOnclickOutside from "react-cool-onclickoutside";

type Props = {
	onClickedPlace: (results: google.maps.GeocoderResult[]) => void
	searchPlacesOfTypes?: string[] | undefined
}

const PlacesAutoComplete: React.FC<Props> = ({ onClickedPlace, searchPlacesOfTypes }) => {
	const {
		ready,
		value,
		setValue,
		suggestions: { status, data },
		clearSuggestions,
	} = usePlacesAutoComplete({
		requestOptions: {
			componentRestrictions: {
				country: 'SE'
			},
			types: searchPlacesOfTypes ?? undefined
		}
	})
	const ref = useOnclickOutside(() => {
		// When the user clicks outside of the component, we can dismiss
		// the searched suggestions by calling this method
		clearSuggestions()
	})

	const handleSelect = ({ description }: { description: string }) => (

		async () => {
			// When the user selects a place, we can replace the keyword without request data from API
			// by setting the second parameter to "false"
			setValue(description, false);
			clearSuggestions();

			// Get the google.maps.GeocoderResult[] response
			const results = await getGeocode({
				address: description,
				componentRestrictions: { country: 'SE' } //giving only results in Sweden
				// but I also don't even wanna show autocomplete results that is not in sweden
			})

			onClickedPlace(results)

		}
	)

	const renderSuggestions = () => (

		data.map((suggestion) => {
			const {
				place_id,
				structured_formatting: { main_text, secondary_text },
			} = suggestion

			return (
				<React.Fragment key={place_id}>
					<li
						key={place_id}
						className='autoComplete-options'
						onClick={handleSelect(suggestion)}>
						<strong>{main_text}</strong> <small>{secondary_text}</small>
					</li>
					<hr />
				</React.Fragment>
			)
		})
	)

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


