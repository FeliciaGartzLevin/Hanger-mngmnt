import useAuth from '../../hooks/useAuth'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { NavLink, Link } from 'react-router-dom'
import hangry from '../../../public/hangry-3.svg'

const Hangry = () => {
	return (

		<Image src={hangry} alt='Logo' width={40} height={40} />

	);
  };

const Navigation = () => {
	const {
		signedInUser,
		signedInUserDoc,
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
				>	<Hangry/>
					{/* 🍔 😡 Hanger  THE HANGRY APP */}
					{/* <span className='d-none d-sm-inline'> Management</span>
					<span className='d-inline d-sm-none'> Mgmt</span> */}
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
									to='/'
								>See Map</NavDropdown.Item>
								<NavDropdown.Item
									as={NavLink}
									to='/place-form'
								>{signedInUserDoc && signedInUserDoc.isAdmin ? "Add" : "Recommend"} Place</NavDropdown.Item>

								<NavDropdown.Divider />

								<NavDropdown.Item
									as={NavLink}
									to='/update-profile'
								>Update Profile</NavDropdown.Item>

								<NavDropdown.Divider />

								{signedInUserDoc && signedInUserDoc.isAdmin && (
									<>
										<NavDropdown.Item
											as={NavLink}
											to='/admin-places-list'
										>Places List</NavDropdown.Item>

										<NavDropdown.Item
											as={NavLink}
											to='/admin-users-list'
										>Users List</NavDropdown.Item>

										<NavDropdown.Divider />
									</>
								)}

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
