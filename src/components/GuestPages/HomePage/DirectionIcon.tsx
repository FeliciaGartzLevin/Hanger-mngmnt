import React from 'react'
import Card from 'react-bootstrap/Card'
import { MdOutlineDirections } from "react-icons/md"

type Props = {
	placeId: string
}

const DirectionIcon: React.FC<Props> = ({ placeId }) => {
	return <Card.Link
		style={{
			fontSize: '1.3rem'
		}}
		target="_blank"
		href={`https://www.google.com/maps/dir/?api=1&origin=here&destination_place_id=${placeId}&destination=there`}>
		<MdOutlineDirections />
	</Card.Link>
}

export default DirectionIcon
