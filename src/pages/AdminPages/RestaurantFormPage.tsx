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
import PlacesAutoComplete from "../../components/NoLogInPages/MapPage.tsx/PlacesAutoComplete";
import { Location, Restaurant } from "../../types/Restaurant.types";
import { doc, setDoc } from "firebase/firestore";
import { placeCol } from "../../services/firebase";
import { Libraries, useLoadScript } from "@react-google-maps/api";

const libraries: Libraries = ["places"];

const RestaurantFormPage = () => {
  const [selectedPlace, setSelectedPlace] = useState<Location | null>(null);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<Restaurant>();

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

  const onSubmit = async (data: Restaurant) => {
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

      const { latitude, longitude } = selectedPlace;

      const newRestaurant: Restaurant = {
        _id: "",
        name: data.name,
        streetAddress: data.streetAddress || "",
        city: data.city || "",
        description: data.description,
        category: data.category,
        supply: data.supply,
        email: data.email || "",
        telephone: data.telephone || "",
        website: data.website || "",
        facebook: data.facebook || "",
        instagram: data.instagram || "",
        location: {
          latitude,
          longitude,
        },
      };

      const docRef = doc(placeCol);
      await setDoc(docRef, newRestaurant);

      console.log("Restaurant added successfully!");
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding restaurant:", error);

      setIsError(true);
      setErrorMessage("An error occurred while adding the restaurant.");
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-3 center-y">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body>
              <Card.Title className="mb-3">Add Restaurant</Card.Title>
              {isError && <Alert variant="danger">{errorMessage}</Alert>}

              <div className="mb-3">
                <label htmlFor="name" className="mb-2">
                  Place
                </label>
                <PlacesAutoComplete
                  onClickedPlace={(results) => {
                    const selectedAddress =
                      results[0]?.formatted_address || "";
                    setValue("name", selectedAddress);
                    const location = results[0]?.geometry?.location;
                    if (location) {
                      setSelectedPlace({
                        latitude: location.lat(),
                        longitude: location.lng(),
                      });
                    } else {
                      setSelectedPlace(null);
                    }
                  }}
                />
              </div>

              <Form onSubmit={handleSubmit(onSubmit)}>
                {/* Description */}
                <Form.Group controlId="description" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    {...register("description")}
                  />
                </Form.Group>

                {/* Add more fields based on your Restaurant type */}
                {/* Category */}
                <div className="mb-3 d-flex align-items-center">
                  <label className="m-2" htmlFor="category">
                    Category
                  </label>
                  <select
                    id="category"
                    {...register("category")}
                    className="form-select"
                    style={{ flex: 0.7, maxWidth: "150px" }}
                  >
                    <option value="Café">Café</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Fast food">Fast food</option>
                    <option value="Kiosk/grill">Kiosk/grill</option>
                    <option value="Food truck">Food truck</option>
                  </select>
                </div>

                {/* Supply */}
                <div className="mb-3 d-flex align-items-center">
                  <label className="m-2" htmlFor="supply">
                    Supply
                  </label>
                  <select
                    id="supply"
                    {...register("supply")}
                    className="form-select"
                    style={{ flex: 0.7, maxWidth: "150px" }}
                  >
                    <option value="Lunch">Lunch</option>
                    <option value="After Work">After Work</option>
                    <option value="Middag/Á la carte">Middag/Á la carte</option>
                  </select>
                </div>

                {/* E-mail */}
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control type="email" {...register("email")} />
                  {errors.email && (
                    <Form.Text className="text-danger">
                      {errors.email.message}
                    </Form.Text>
                  )}
                </Form.Group>

                {/* Telephone */}
                <Form.Group controlId="telephone" className="mb-3">
                  <Form.Label>Telephone</Form.Label>
                  <Form.Control type="tel" {...register("telephone")} />
                  {errors.telephone && (
                    <Form.Text className="text-danger">
                      {errors.telephone.message}
                    </Form.Text>
                  )}
                </Form.Group>

                {/* Website */}
                <Form.Group controlId="website" className="mb-3">
                  <Form.Label>Website</Form.Label>
                  <Form.Control type="url" {...register("website")} />
                </Form.Group>

                {/* Facebook */}
                <Form.Group controlId="facebook" className="mb-3">
                  <Form.Label>Facebook</Form.Label>
                  <Form.Control type="text" {...register("facebook")} />
                </Form.Group>

                {/* Instagram */}
                <Form.Group controlId="instagram" className="mb-3">
                  <Form.Label>Instagram</Form.Label>
                  <Form.Control type="text" {...register("instagram")} />
                </Form.Group>
                {/* Submit Button */}
                <Button
                  variant="primary"
                  type="submit"
                  className="mt-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding Restaurant..." : "Add Restaurant"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RestaurantFormPage;


