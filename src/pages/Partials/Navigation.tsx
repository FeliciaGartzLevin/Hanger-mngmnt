import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Image from 'react-bootstrap/Image'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Nav'
import { NavLink, Link } from 'react-router-dom'
// import useAuth from '../../hooks/useAuth'

const Navigation = () => {
	// const {
	// 	currentUser,
	// 	userEmail,
	// 	userName,
	// 	userPhotoUrl,
	// } = useAuth()

	const isLoggedIn = true
	const userPhotoUrl = 'https://picsum.photos/200'
	const userName = 'al_binaur'
	const userEmail = 'albin@gmail.com'

	return (
		<Navbar bg='dark' variant='dark' expand='sm'>
			<Container fluid>
				<Navbar.Brand as={Link} to='/'>Hanger Management</Navbar.Brand>

				<Navbar.Toggle aria-controls='basic-navbar-nav' />
				<Navbar.Collapse id='basic-navbar-nav'>
					<Nav className='ms-auto'>
						<div className='me-2 mt-2'>
							<InputGroup size='sm'>
								<Form.Control placeholder='Restaurant, cafe...' />
								<Button variant='success'>🔍</Button>
							</InputGroup>
						</div>
						{isLoggedIn ? (
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
									to='/update-profile'
									>Update Profile</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item
									className='m-0'
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
									to='/register'
								>
									<Button
										size='sm'
										variant='primary'
									>Register</Button>
								</Nav.Link>
							</div>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default Navigation
