import React from 'react'
import Card from 'react-bootstrap/Card'
import { BsInstagram, BsGlobe, BsFacebook, BsFillTelephoneFill } from "react-icons/bs";
import { GoMail } from "react-icons/go";
// import { Link } from "react-router-dom"
import { Place } from '../../../types/Place.types';

type Props = {
	place: Place
}

const PlaceCards: React.FC<Props> = ({ place }) => {
	return (
		<Card className="mb-3">
			<Card.Body>
				<Card.Title>{place.name}</Card.Title>
				<hr />
				<Card.Subtitle className="mb-2 text-muted">{place.streetAddress}</Card.Subtitle>
				<Card.Text>{place.description}</Card.Text>
				<Card.Footer className="card-links d-flex justify-content-between align-items-center">
					<div className="d-flex align-items-centers">
						{/* This will be a link ltr: <Link to={<UploadPhotoPage />}>
						needa check here if user is authorized and conditionally render*/}
						+ Add photo
						{/* </Link> */}
					</div>
					<div>
						{place.website && <Card.Link target="_blank" href={place.website}><BsGlobe /></Card.Link>}
						{place.email && <Card.Link target="_blank" href={`mailto:${place.email}`}><GoMail /></Card.Link>}
						{place.instagram && <Card.Link target="_blank" href={place.instagram}><BsInstagram /></Card.Link>}
						{place.facebook && <Card.Link target="_blank" href={place.facebook}><BsFacebook /></Card.Link>}
						{place.telephone && <Card.Link target="_blank" href={`tel:${place.telephone}`}><BsFillTelephoneFill /></Card.Link>}
					</div>
				</Card.Footer>
			</Card.Body>
		</Card>
	)
}

export default PlaceCards