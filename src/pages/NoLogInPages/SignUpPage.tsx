import { FirebaseError } from 'firebase/app'
import useAuth from '../../hooks/useAuth'
import { useRef, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { UserSignUp } from '../../types/User.types'
import { toast } from 'react-toastify'

const SignupPage = () => {
	const [isError, setIsError] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string|null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const { handleSubmit, register, watch, formState: { errors } } = useForm<UserSignUp>()
	const { signup } = useAuth()

	const passwordRef = useRef('')
	passwordRef.current = watch('password')

	const onSignup: SubmitHandler<UserSignUp> = async (data: UserSignUp) => {
		setIsError(false)
		setErrorMessage(null)

		try {
			setIsLoading(true)
			await signup(data.email, data.name, data.password)

			toast.success("Welcome, " + data.name)

		} catch (error) {
			if (error instanceof FirebaseError) {
				setErrorMessage(error.message)
			} else {
				setErrorMessage("Something went wrong when trying to signup")
			}
			setIsError(true)
			setIsLoading(false)
		}
	}

	return (
		<Container className='py-3 center-y'>
			<Row>
				<Col md={{ span: 6, offset: 3 }}>
					<Card>
						<Card.Body>
							<Card.Title className='mb-3'>Sign up</Card.Title>

							{isError && (<Alert variant='danger'>{errorMessage}</Alert>)}

							<Form onSubmit={handleSubmit(onSignup)}>
								<Form.Group controlId='name' className='mb-3'>
									<Form.Control
										placeholder="Name"
										type='text'
										{...register('name', {
											required: "Name missing",
										})}
									/>
									{errors.name && <div className='invalid-value'>{errors.name.message ?? "Invalid value"}</div>}
								</Form.Group>

								<Form.Group controlId='email' className='mb-3'>
									<Form.Control
										placeholder="Email"
										type='email'
										{...register('email', {
											required: "Email missing",
										})}
									/>
									{errors.email && <div className='invalid-value'>{errors.email.message ?? "Invalid value"}</div>}
								</Form.Group>

								<Form.Group controlId='password' className='mb-3'>
									<Form.Control
										placeholder="Password"
										type='password'
										autoComplete='new-password'
										{...register('password', {
											required: "Password missing",
											minLength: {
												value: 6,
												message: "Enter at least 6 characters"
											},
										})}
									/>
									{errors.password && <div className='invalid-value'>{errors.password.message ?? "Invalid value"}</div>}
									<Form.Text>At least 6 characters</Form.Text>
								</Form.Group>

								<Form.Group controlId='confirmPassword' className='mb-3'>
									<Form.Control
										placeholder="Confirm Password"
										type='password'
										autoComplete='off'
										{...register('passwordConfirm', {
											required: "Confirm Password missing",
											minLength: {
												value: 6,
												message: "Enter at least 6 characters"
											},
											validate: (value) => {
												return value === passwordRef.current || "Passwords don't match"
											}
										})}
									/>
									{errors.passwordConfirm && <div className='invalid-value'>{errors.passwordConfirm.message ?? "Invalid value"}</div>}
								</Form.Group>

								<Button
									disabled={isLoading}
									variant='primary'
									size='sm'
									type='submit'
								>{isLoading ? "Signing up..." : "Sign up"}</Button>
							</Form>
						</Card.Body>
					</Card>

					<div className='text-center mt-3'>
						Already have an account? <Link to='/login'>Log in</Link>
					</div>
				</Col>
			</Row>
		</Container>
	)
}

export default SignupPage
