import { FirebaseError } from 'firebase/app'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import useGetPlace from '../../hooks/useGetPlace'
import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { placesCol } from '../../services/firebase'
import { Category, Place, Supply } from '../../types/Place.types'

const categories: Category[] = [
	'Café',
	'Pub',
	'Restaurant',
	'Fast Food',
	'Kiosk/grill',
	'Food Truck'
]

const supplyOptions: Supply[] = [
	'General Menu',
	'Lunch',
	'After Work',
	'Dinner',
	'Breakfast/Brunch'
]

const AdminEditPlaceForm = () => {
	const [isError, setIsError] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const { placeId } = useParams()
	const place = useGetPlace(placeId)

	const {
		handleSubmit,
		register,
		setValue,
		formState: { errors }
	} = useForm<Place>()

	useEffect(() => {
		if (place.data) {
			setValue('description', place.data.description)
			setValue('category', place.data.category)
			setValue('supply', place.data.supply)
			setValue('email', place.data.email)
			setValue('telephone', place.data.telephone)
			setValue('website', place.data.website)
			setValue('facebook', place.data.facebook)
			setValue('instagram', place.data.instagram)
		}
	}, [place.data, setValue])

	const onSubmit = async (data: Place) => {
		try {
			setIsError(false)
			setErrorMessage(null)
			setIsSubmitting(true)

			if (!placeId) {
				setIsError(true)
				setErrorMessage("No place connected")
				setIsSubmitting(false)
				return
			}

			const docRef = doc(placesCol, placeId)
			const checkDoc = await getDoc(docRef)
			if (!checkDoc.exists()) {
				setIsError(true)
				setErrorMessage("Place doesn't exist")
				setIsSubmitting(false)
				return
			}

			await updateDoc(docRef, {
				...place.data,
				...data
			})

			toast.dark("Place updated successfully!")

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
								Edit {place.data?.name}
							</Card.Title>

							{isError && <Alert variant='danger'>{errorMessage}</Alert>}

							<Form onSubmit={handleSubmit(onSubmit)}>
								<Form.Group
									className='mb-3'
									controlId='description'
								>
									<Form.Control
										as='textarea'
										placeholder="Description*"
										rows={5}
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
										type='url'
										{...register('facebook')}
									/>
								</Form.Group>

								<Form.Group
									className='mb-3'
									controlId='instagram'
								>
									<Form.Control
										placeholder="Instagram"
										type='url'
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
										? "Submitting..."
										: "Submit"}
								</Button>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default AdminEditPlaceForm
