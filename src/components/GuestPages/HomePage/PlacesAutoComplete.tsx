import React from 'react'
import { Form, ListGroup, ListGroupItem } from 'react-bootstrap'
import useOnclickOutside from 'react-cool-onclickoutside'
import usePlacesAutoComplete, { getGeocode } from 'use-places-autocomplete'

type Props = {
	onClickedPlace: (results: google.maps.GeocoderResult[]) => void
	onPlaceName?: (placeName: string) => void
	searchPlacesOfTypes?: string[] | undefined
}

const PlacesAutoComplete: React.FC<Props> = ({ onClickedPlace, searchPlacesOfTypes, onPlaceName }) => {
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
			// by setting the second parameter to 'false'
			setValue(description, false)
			clearSuggestions()

			// Get the google.maps.GeocoderResult[] response
			const results = await getGeocode({
				address: description,
				componentRestrictions: { country: 'SE' } //(supposed to be) giving only results in Sweden
				// but I also don't even wanna show autocomplete results that is not in sweden
			})

			onClickedPlace(results)

			// Taking the description (f. ex 'Big Ben Pub, Folkungagatan, Stockholm, Sverige') and splitting it by ','
			const splitDescription = description.split(',')
			// if it had the right format(three parts array), move on
			if (splitDescription.length > 2) {
				if (!onPlaceName) return
				const placeName = splitDescription[0].trim()
				onPlaceName(placeName)
			}
		}
	)

	return (
		<div ref={ref}>
			<Form.Control
				onClick={() => setValue('')}
				value={value}
				onChange={e => setValue(e.target.value)}
				disabled={!ready}
				placeholder='Search Location*'
			/>
			{status === 'OK' &&
				<ListGroup>
					{data.map((suggestion) => {
						const {
							place_id,
							structured_formatting: { main_text, secondary_text }
						} = suggestion

						return (
							<ListGroupItem
								key={place_id}
								onClick={handleSelect(suggestion)}>
								<strong>{main_text}</strong> <small>{secondary_text}</small>
							</ListGroupItem>
						)
					})}
				</ListGroup>
			}
		</div >
	)
}

export default PlacesAutoComplete
