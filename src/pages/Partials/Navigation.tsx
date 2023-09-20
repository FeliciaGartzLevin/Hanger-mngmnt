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
		currentUser,
		userEmail,
		userName,
		userPhotoUrl,
	} = useAuth()

	return (
		<Navbar bg='dark' variant='dark'>
			<Container fluid>
				<Navbar.Brand as={Link} to='/'>Hanger Management</Navbar.Brand>
					<Nav>
						{currentUser ? (
							<NavDropdown
								drop='start'
								title={
									userPhotoUrl
									? <Image
										src={userPhotoUrl}
										width={30}
										title={(userName || userEmail) ?? ''}
										className='img-square'
										fluid
										roundedCircle />
									: userName || userEmail
								}
							>
								<NavDropdown.Item
									as={NavLink}
									to='/recommend'
								>Recommend</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item
									as={NavLink}
									to='/update-profile'
								>Update Profile</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item
									as={NavLink}
									to='/logout'
								>Logout</NavDropdown.Item>
							</NavDropdown>
						) : (
							<div className='d-flex'>
								<Nav.Link
									as={NavLink}
									className='pe-2'
									to='/login'
								>
									<Button
										size='sm'
										variant='outline-light'
									>Login</Button>
								</Nav.Link>
								<Nav.Link
									as={NavLink}
									to='/signup'
								>
									<Button
										size='sm'
										variant='primary'
									>Sign Up</Button>
								</Nav.Link>
							</div>
						)}
					</Nav>

			</Container>
		</Navbar>
	)
}

export default Navigation
