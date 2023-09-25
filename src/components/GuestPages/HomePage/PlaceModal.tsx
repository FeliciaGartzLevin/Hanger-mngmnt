import { BsInstagram, BsGlobe, BsFacebook, BsFillTelephoneFill } from 'react-icons/bs'
import { GoMail } from 'react-icons/go'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import { Place } from '../../../types/Place.types'
import { Link } from 'react-router-dom'

interface IProps {
	onClose: () => void
	place: Place | null
	show: boolean
}

const PlaceModal: React.FC<IProps> = ({ onClose, place, show }) => {
	const iconSize = 25

	if (place) return (
		<Modal
			centered
			onHide={onClose}
			show={show}
		>
			<Modal.Header closeButton>
				<Modal.Title>{place.name}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>{place.supply} | {place.category}</div>
				<div className='small text-muted my-1'>{place.streetAddress}</div>
				<div className='small'>{place.description}</div>
				<Row
					className='mt-3 justify-content-end'
					xs='auto'
				>
					<Col>
						{place.website && (
							<Link to={place.website} target='_blank'>
								<BsGlobe size={iconSize} />
							</Link>
						)}
					</Col>
					<Col>
						{place.facebook && (
							<Link to={place.facebook} target='_blank'>
								<BsFacebook size={iconSize} />
							</Link>
						)}
					</Col>
					<Col>
						{place.instagram && (
							<Link to={place.instagram} target='_blank'>
								<BsInstagram size={iconSize} />
							</Link>
						)}
					</Col>
					<Col>
						{place.telephone && (
							<Link to={`tel:${place.telephone}`} target='_blank'>
								<BsFillTelephoneFill size={iconSize} />
							</Link>
						)}
					</Col>
					<Col>
						{place.email && (
							<Link to={`mailto:${place.email}`}>
								<GoMail size={iconSize} />
							</Link>
						)}
					</Col>
				</Row>
			</Modal.Body>
			<Modal.Footer>
				<Button
					// onClick={onClose}
					size='sm'
					variant='primary'
				>Upload Photos</Button>

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
