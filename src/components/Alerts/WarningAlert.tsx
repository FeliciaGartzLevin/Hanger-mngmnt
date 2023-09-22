import React from 'react'
import Alert from 'react-bootstrap/Alert'

interface IProps {
	heading?: string
	children: React.ReactNode
}

const WarningAlert: React.FC<IProps> = ({ heading = 'Warning', children }) => {
	return (
		<Alert variant="warning">
			<h2 className="h4">{heading}</h2>
			{children}
		</Alert>
	)
}

export default WarningAlert
