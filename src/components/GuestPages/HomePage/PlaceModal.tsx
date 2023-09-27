import ImageGallery from '../../ImageGallery'
import useStreamPhotosByPlace from '../../../hooks/useStreamPhotosByPlace'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import { BsInstagram, BsGlobe, BsFacebook, BsFillTelephoneFill } from 'react-icons/bs'
import { GoMail } from 'react-icons/go'
import { Link, useNavigate } from 'react-router-dom'
import { PlaceWithDistance } from '../../../types/Place.types'

interface IProps {
	onClose: () => void
	place: PlaceWithDistance | null
	show: boolean
}

const PlaceModal: React.FC<IProps> = ({ onClose, place, show }) => {
	const navigate = useNavigate()
	const iconSize = 20
	const { data: photos } = useStreamPhotosByPlace(place?._id)

	if (place) return (
		<Modal
			centered
			onHide={onClose}
			show={show}
		>
			<Modal.Header closeButton>
				<Modal.Title >
					{place.name}

				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='d-flex justify-content-between'>
					<div>{place.supply} | {place.category}</div>
					{place.distanceText &&
						<small style={{ fontSize: '0.9rem' }}>
							{place.distanceText} away
						</small>
					}
				</div>
				<div className='small text-muted my-1'>{place.streetAddress}</div>
				<div className='small'>{place.description}</div>
				{photos && <ImageGallery photos={photos} />}
			</Modal.Body>
			<Modal.Footer className='position-relative'>
				<Row
					className='justify-content-end position-absolute start-0'
					xs='auto'
				>
					{place.website && (
						<Col>
							<Link to={place.website} target='_blank'>
								<BsGlobe size={iconSize} />
							</Link>
						</Col>
					)}

					{place.facebook && (
						<Col>
							<Link to={place.facebook} target='_blank'>
								<BsFacebook size={iconSize} />
							</Link>
						</Col>
					)}

					{place.instagram && (
						<Col>
							<Link to={place.instagram} target='_blank'>
								<BsInstagram size={iconSize} />
							</Link>
						</Col>
					)}

					{place.telephone && (
						<Col>
							<Link to={`tel:${place.telephone}`} target='_blank'>
								<BsFillTelephoneFill size={iconSize} />
							</Link>
						</Col>
					)}

					{place.email && (
						<Col>
							<Link to={`mailto:${place.email}`}>
								<GoMail size={iconSize} />
							</Link>
						</Col>
					)}
				</Row>

				<Button
					onClick={() => navigate('/upload-photo/' + place._id)}
					size='sm'
					variant='primary'
				>Add Photo</Button>

				<Button
					onClick={onClose}
					size='sm'
					variant='secondary'
				>Close</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default PlaceModal
