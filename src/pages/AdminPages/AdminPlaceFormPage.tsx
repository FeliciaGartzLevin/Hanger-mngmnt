import { useState } from "react";
import { useForm } from "react-hook-form";
import {
	Alert,
	Button,
	Card,
	Col,
	Container,
	Form,
	Row,
} from "react-bootstrap";
import PlacesAutoComplete from "../../components/GuestPages/HomePage/PlacesAutoComplete";
import { Place } from "../../types/Place.types";
import { doc, setDoc } from "firebase/firestore";
import { Libraries, useLoadScript } from "@react-google-maps/api";
import { getLatLng } from "use-places-autocomplete";
import { placesCol } from "../../services/firebase";
import useAuth from "../../hooks/useAuth";

const libraries: Libraries = ["places"];

const AdminPlaceFormPage = () => {
	const [selectedPlace, setSelectedPlace] =
		useState<google.maps.LatLngLiteral | null>(null);
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const {
		handleSubmit,
		register,
		setValue,
		formState: { errors },
	} = useForm<Place>();
	const auth = useAuth();

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: import.meta.env.VITE_GEOCODE_API_KEY,
		libraries: libraries,
	});

	if (!isLoaded)
		return (
			<Container>
				{/* add other loading animation here ltr */}
				<p>Loading...</p>
			</Container>
		);

	const onSubmit = async (data: Place) => {
		try {
			setIsError(false);
			setErrorMessage(null);
			setIsLoading(true);

			// Check if a location has been selected
			if (!selectedPlace) {
				setIsError(true);
				setErrorMessage("Please select a location.");
				setIsLoading(false);
				return;
			}

			// Access the current user's information
			const user = auth.signedInUser;
			if (!user) {
				setIsError(true);
				setErrorMessage("User not authenticated.");
				setIsLoading(false);
				return;
			}
			// console.log(selectedPlace);

			const newPlace: Place = {
				_id: data._id,
				uid: user.uid,
				isApproved: true,
				name: data.name,
				streetAddress: data.streetAddress,
				city: data.city,
				description: data.description,
				category: data.category,
				supply: data.supply,
				email: data.email,
				telephone: data.telephone,
				website: data.website,
				facebook: data.facebook,
				instagram: data.instagram,
				location: selectedPlace,
			};
			const docRef = doc(placesCol);
			//   const  = collection(db, 'places');
			await setDoc(docRef, newPlace);

			console.log(newPlace);

			console.log("Place added successfully!");
			setIsLoading(false);
		} catch (error) {
			console.error("Error adding place:", error);

			setIsError(true);
			setErrorMessage("An error occurred while adding the place.");
			setIsLoading(false);
		}
	};

	return (

		<Container className="py-3 center-y">
			<Row>
				<Col md={{ span: 6, offset: 3 }}>
					<Card>
						<Card.Body>
							<Card.Title className="mb-3">
								Admin Place Form
							</Card.Title>
							{isError && (
								<Alert variant="danger">{errorMessage}</Alert>
							)}

							{/* Display the selected place data here */}
							<div className="mb-3">
								{/* Description */}
								<Form.Group controlId="name" className="mb-3">
									<Form.Control
										type="name"
										placeholder="Location Name"
										{...register("name", {
											required: "Location name missing",
											minLength: {
												value: 3,
												message:
													"Enter at least 3 characters",
											},
										})}
									/>
									{errors.name && (
										<Form.Text className="text-danger">
											{errors.name.message}
										</Form.Text>
									)}
								</Form.Group>
								<PlacesAutoComplete
									onClickedPlace={(results) => {
										const selectedPlace = results[0];

										if (!selectedPlace) {
											// No place selected
											setIsError(true);
											setErrorMessage(
												"Please select a valid place."
											);
											return;
										}

										// Check for the type of place (you can customize this based on your requirements)
										const placeTypes =
											selectedPlace.types || [];
										if (
											!placeTypes.includes(
												"street_address"
											) &&
											!placeTypes.includes(
												"establishment"
											)
										) {
											// Invalid place type (e.g., country or city)
											setIsError(true);
											setErrorMessage(
												"Please select a valid address."
											);
											return;
										}

										// Valid place selection
										setIsError(false);
										setErrorMessage(null);

										const selectedAddress =
											selectedPlace.formatted_address ||
											"";
										// // Set name as the selected address
										// setValue("name", selectedAddress);
										// // Set address as the selected address
										setValue(
											"streetAddress",
											selectedAddress
										);

										// Set id to Google's id on the place
										setValue("_id", selectedPlace.place_id);

										// Get and set the latitude and longitude positions
										const { lat, lng } =
											getLatLng(selectedPlace);
										setSelectedPlace({ lat, lng });

										// Find the city component in the address_components array
										selectedPlace.address_components?.find(
											(component) => {
												if (
													component.types[0] !==
													"postal_town"
												)
													return;
												setValue(
													"city",
													component.long_name
												);
												// Check for the type of place (you can customize this based on your requirements)
												const placeTypes =
													selectedPlace.types || [];
												if (
													!placeTypes.includes(
														"street_address"
													) &&
													!placeTypes.includes(
														"establishment"
													)
												) {
													// Invalid place type (e.g., country or city)
													setIsError(true);
													setErrorMessage(
														"Please select a valid address."
													);
													return;
												}
											}
										);
									}}
								/>
							</div>

							<Form onSubmit={handleSubmit(onSubmit)}>
								{/* Description */}
								<Form.Group
									controlId="description"
									className="mb-3"
								>
									<Form.Control
										as="textarea"
										placeholder="Description"
										rows={3}
										{...register("description", {
											required: "Description missing",
											minLength: {
												value: 10,
												message:
													"Enter at least 10 characters",
											},
										})}
									/>
								</Form.Group>

								{/* Add more fields based on your Place type */}

								<div className="mb-3 d-flex align-items-center">
									<label className="m-2" htmlFor="category">
										Category
									</label>
									<select
										id="category"
										{...register("category")}
										className="form-select"
										style={{ flex: 0.7, maxWidth: "150px" }} // Adjust flex and maxWidth as needed
									>
										<option value="Café">Café</option>
										<option value="Place">
											Place
										</option>
										<option value="Fast food">
											Fast food
										</option>
										<option value="Kiosk/grill">
											Kiosk/grill
										</option>
										<option value="Food truck">
											Food truck
										</option>
									</select>
								</div>

								<div className="mb-3 d-flex align-items-center">
									<label className="m-2" htmlFor="supply">
										Supply
									</label>
									<select
										id="supply"
										{...register("supply")}
										className="form-select"
										style={{ flex: 0.7, maxWidth: "150px" }} // Adjust flex and maxWidth as needed
									>
										{" "}
										<option value="General Menu">
											General Menu
										</option>
										<option value="Lunch">Lunch</option>
										<option value="After Work">
											After Work
										</option>
										<option value="Middag/Á la carte">
											Middag/Á la carte
										</option>
									</select>
								</div>
								{/* E-mail */}
								<Form.Group controlId="email" className="mb-3">
									<Form.Control
										type="email"
										placeholder="Email"
										{...register("email", {
											required: "Email missing",
										})}
									/>
									{errors.email && (
										<Form.Text className="text-danger">
											{errors.email.message}
										</Form.Text>
									)}
								</Form.Group>

								{/* Telephone */}
								<Form.Group
									controlId="telephone"
									className="mb-3"
								>
									<Form.Control
										type="tel"
										placeholder="Telephone"
										{...register("telephone", {
											required: "Telephone missing",
										})}
									/>
								</Form.Group>

								{/* Website */}
								<Form.Group
									controlId="website"
									className="mb-3"
								>
									<Form.Control
										type="url"
										placeholder="Website"
										{...register("website", {
											required: "Website missing",
										})}
									/>
								</Form.Group>

								{/* Facebook */}
								<Form.Group
									controlId="facebook"
									className="mb-3"
								>
									<Form.Control
										type="text"
										placeholder="Facebook"
										{...register("facebook", {
											required: "Facebook missing",
										})}
									/>
								</Form.Group>

								{/* Instagram */}
								<Form.Group
									controlId="instagram"
									className="mb-3"
								>
									<Form.Control
										type="text"
										placeholder="Instagram"
										{...register("instagram", {
											required: "Instagram missing",
										})}
									/>
								</Form.Group>
								{/* Submit Button */}
								<Button
									variant="primary"
									type="submit"
									className="mt-3"
								>
									{isLoading
										? "Adding Place..."
										: "Add Place"}
								</Button>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default AdminPlaceFormPage;
