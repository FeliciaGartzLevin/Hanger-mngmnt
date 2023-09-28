import PlacesAutoComplete from '../../components/GuestPages/HomePage/PlacesAutoComplete'
import { FirebaseError } from 'firebase/app'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import useAuth from '../../hooks/useAuth'
import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { Libraries, useLoadScript } from '@react-google-maps/api'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { placesCol } from '../../services/firebase'
import { Category, Place, Supply } from '../../types/Place.types'
import { getLatLng } from 'use-places-autocomplete'

const libraries: Libraries = ['places']

const categories: Category[] = [
	'Café',
	'Pub',
	'Restaurant',
	'Fast Food',
	'Kiosk/grill',
	'Food Truck',
]

const supplyOptions: Supply[] = [
	'General Menu',
	'Lunch',
	'After Work',
	'Dinner',
	'Breakfast/Brunch',
]

const PlaceFormPage = () => {
	const [selectedPlace, setSelectedPlace] = useState<google.maps.LatLngLiteral | null>(null)
	const [isError, setIsError] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [placeName, setPlaceName] = useState<string | undefined>(undefined)
	const {
		handleSubmit,
		register,
		setValue,
		formState: { errors }
	} = useForm<Place>()

	const { signedInUser, signedInUserDoc } = useAuth()

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: import.meta.env.VITE_GEOCODE_API_KEY,
		libraries
	})

	if (!isLoaded) return <div>Loading...</div>

	const onSubmit = async (data: Place) => {
		try {
			setIsError(false)
			setErrorMessage(null)
			setIsSubmitting(true)

			if (!selectedPlace) {
				setIsError(true)
				setErrorMessage("Please select a location")
				setIsSubmitting(false)
				return
			}

			if (!signedInUser) {
				setIsError(true)
				setErrorMessage("User not authenticated")
				setIsSubmitting(false)
				return
			}

			const docRef = doc(placesCol, data._id)
			const checkDoc = await getDoc(docRef)
			if (checkDoc.exists()) {
				setIsError(true)
				setErrorMessage("Place already exists")
				setIsSubmitting(false)
				return
			}

			const newPlace = {
				...data,
				createdAt: serverTimestamp(),
				isApproved: signedInUserDoc && signedInUserDoc.isAdmin,
				uid: signedInUser.uid
			}

			await setDoc(docRef, newPlace)

			toast.dark("Place added successfully!")
			console.log('placeName', placeName)
			setValue('name', '')
			setValue('description', '')
			setValue('email', '')
			setValue('telephone', '')
			setValue('website', '')
			setValue('facebook', '')
			setValue('instagram', '')

			setIsSubmitting(false)

		} catch (error) {
			if (error instanceof FirebaseError) {
				setErrorMessage(error.message)
			} else {
				setErrorMessage("An error occurred while adding the place")
			}
			setIsError(true)
			setIsSubmitting(false)
		}
	}

	return (
		<Container className='py-3 center-y'>
			<Row>
				<Col md={{ span: 6, offset: 3 }}>
					<Card>
						<Card.Body>
							<Card.Title className='mb-3'>
								{signedInUserDoc && signedInUserDoc.isAdmin ? "Add" : "Recommend"} Place
							</Card.Title>

							{isError && <Alert variant='danger'>{errorMessage}</Alert>}

							<div className='mb-3'>
								{placeName && <h2 className='h6 mb-3'>Name: {placeName}</h2>}
								<PlacesAutoComplete
									placeHolderText='Search place*'
									onClickedPlace={(results, name) => {
										const selectedPlace = results[0]

										if (!selectedPlace) {
											setIsError(true)
											setErrorMessage("Please select a valid place")
											return
										}

										const placeTypes = selectedPlace.types || []

										if (!placeTypes.includes('street_address') && !placeTypes.includes('establishment')) {
											setIsError(true)
											setErrorMessage("Please select a valid place")
											return
										}

										setIsError(false)
										setErrorMessage(null)

										setValue('_id', selectedPlace.place_id)
										setValue('name', name)
										setPlaceName(name)

										const selectedAddress = selectedPlace.formatted_address || ''
										setValue('streetAddress', selectedAddress)

										const { lat, lng } = getLatLng(selectedPlace)
										setSelectedPlace({ lat, lng })
										setValue('location', { lat, lng })

										selectedPlace.address_components?.find(
											(component) => {
												if (component.types[0] !== 'postal_town') return

												setValue('city', component.long_name)
												const placeTypes = selectedPlace.types || []

												if (!placeTypes.includes('street_address') && !placeTypes.includes('establishment')) {
													setIsError(true)
													setErrorMessage("Please select a valid address")
													return
												}
											}
										)
									}}
								/>
							</div>

							<Form onSubmit={handleSubmit(onSubmit)}>
								<Form.Group
									className='mb-3'
									controlId='description'
								>
									<Form.Control
										as='textarea'
										placeholder="Description(min. of 10 characters max. of 300 characters)*"
										rows={3}
										{...register('description', {
											required: "Description missing",
											minLength: {
												value: 10,
												message: "Enter at least 10 characters",
											},
											maxLength: {
												value: 300,
												message: "Maximum character limit exceeded (300 characters)",
											},
										})}
										className='roboto'
									/>
									{errors.description && (
										<Form.Text className='invalid-value'>
											{errors.description.message}
										</Form.Text>
									)}
								</Form.Group>

								<Form.Group
									className='mb-3'
									controlId='category'
								>
									<Form.Select
										className='form-select'
										id='category'
										{...register('category', {
											required: "Category missing"
										})}
									>
										<option value='' defaultChecked>Select Category*</option>
										{categories.map((category) => (
											<option key={category} value={category}>
												{category}
											</option>
										))}
									</Form.Select>
									{errors.category && (
										<Form.Text className='invalid-value'>
											{errors.category.message}
										</Form.Text>
									)}
								</Form.Group>

								<Form.Group
									className='mb-3'
									controlId='supply'
								>
									<Form.Select
										className='form-select'
										id='supply'
										{...register('supply', {
											required: "Supply missing"
										})}
									>
										<option value='' defaultChecked>Select Supply*</option>
										{supplyOptions.map((supply) => (
											<option key={supply} value={supply}>
												{supply}
											</option>
										))}
									</Form.Select>
									{errors.supply && (
										<Form.Text className='invalid-value'>
											{errors.supply.message}
										</Form.Text>
									)}
								</Form.Group>

								<Form.Group
									className='mb-3'
									controlId='email'
								>
									<Form.Control
										placeholder="Email"
										type='email'
										{...register('email')}
									/>
									{errors.email && (
										<Form.Text className='invalid-value'>
											{errors.email.message}
										</Form.Text>
									)}
								</Form.Group>

								<Form.Group
									className='mb-3'
									controlId='telephone'
								>
									<Form.Control
										placeholder="Telephone"
										type='tel'
										{...register('telephone')}
									/>
								</Form.Group>

								<Form.Group
									className='mb-3'
									controlId='website'
								>
									<Form.Control
										placeholder="Website"
										type='url'
										{...register('website')}
									/>
								</Form.Group>

								<Form.Group
									className='mb-3'
									controlId='facebook'
								>
									<Form.Control
										placeholder="Facebook"
										type='text'
										className='caveat-brush-font'
										{...register('facebook')}
									/>
								</Form.Group>

								<Form.Group
									className='mb-3'
									controlId='instagram'
								>
									<Form.Control
										placeholder="Instagram"
										type='text'
										className='caveat-brush-font'
										{...register('instagram')}
									/>
								</Form.Group>

								<Button
									disabled={isSubmitting}
									size='sm'
									type='submit'
									variant='primary'
								>
									{isSubmitting
										? "Submitting Place..."
										: "Submit Place"}
								</Button>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default PlaceFormPage
