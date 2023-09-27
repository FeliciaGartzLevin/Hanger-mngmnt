import Card from 'react-bootstrap/Card'
import { BsInstagram, BsGlobe, BsFacebook, BsFillTelephoneFill } from "react-icons/bs";
import { GoMail } from "react-icons/go";
import { Place } from '../../../types/Place.types';
import { Link } from 'react-router-dom';
import useStreamPhotosByPlace from '../../../hooks/useStreamPhotosByPlace';
import { useEffect } from 'react';
import ImageGallery from '../../ImageGallery';

type Props = {
	place: Place
}

const PlaceCards: React.FC<Props> = ({ place }) => {
	const {data: photos, getCollection } = useStreamPhotosByPlace(place._id)

	useEffect(() => {
		if (place) {
			getCollection()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [place])

	return (
		<Card className="mb-3">
			<Card.Body>
				<Card.Title className='d-flex justify-content-between'>
					{place.name}
					{place.distanceText &&
						<small style={{ fontSize: '0.9rem' }}>
							{place.distanceText} away
						</small>
					}
				</Card.Title>
				<hr />
				<Card.Subtitle className="mb-2 text-muted">{place.streetAddress}</Card.Subtitle>
				<Card.Text>{place.description}</Card.Text>

				{photos && !!photos.filter(photo => photo.isApproved).length && <ImageGallery photos={photos.filter(photo => photo.isApproved)} />}

				<Card.Footer className="card-links d-flex justify-content-between align-items-center">
					<div className="d-flex align-items-centers">
						{/* This will be a link ltr: <Link to={<UploadPhotoPage />}>
						needa check here if user is authorized and conditionally render*/}
						<Link
							to={'/upload-photo/' + place._id}
							className="add-photo-links">
							+ Add photo
						</Link>
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
