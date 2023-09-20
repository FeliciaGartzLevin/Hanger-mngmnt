import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Nav'
import { NavLink, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const Navigation = () => {
	const {
		signedInUser,
		signedInUserEmail,
		signedInUserName,
		signedInUserPhotoUrl
	} = useAuth()

	return (
		<Navbar bg='dark' variant='dark'>
			<Container fluid>
				<Navbar.Brand
					as={Link}
					to='/'
				>
					🍔 😡 Hanger
					<span className='d-none d-sm-inline'> Management</span>
					<span className='d-inline d-sm-none'> Mgmt</span>
				</Navbar.Brand>
					<Nav>
						{signedInUser ? (
							<NavDropdown
								drop='start'
								title={
									signedInUserPhotoUrl
									? <Image
										src={signedInUserPhotoUrl}
										width={30}
										title={(signedInUserName || signedInUserEmail) ?? ''}
										className='img-square'
										fluid
										roundedCircle />
									: signedInUserName || signedInUserEmail
								}
							>
								<NavDropdown.Item
									as={NavLink}
									to='/recommend-place'
								>Recommend Place</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item
									as={NavLink}
									to='/update-profile'
								>Update Profile</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item
									as={NavLink}
									to='/sign-out'
								>Sign Out</NavDropdown.Item>
							</NavDropdown>
						) : (
							<>
								<Nav.Link
									as={NavLink}
									to='/sign-in'
								>
									<Button
										size='sm'
										variant='outline-light'
									>Sign In</Button>
								</Nav.Link>
								<Nav.Link
									as={NavLink}
									to='/sign-up'
								>
									<Button
										size='sm'
										variant='primary'
									>Sign Up</Button>
								</Nav.Link>
							</>
						)}
					</Nav>
			</Container>
		</Navbar>
	)
}

export default Navigation
