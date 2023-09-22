import ForgotPasswordPage from './pages/NoLogInPages/ForgotPasswordPage'
import HomePage from './pages/NoLogInPages/HomePage'
import SignInPage from './pages/NoLogInPages/SignInPage'
import SignOutPage from './pages/NoLogInPages/SignOutPage'
import NotFoundPage from './pages/NoLogInPages/NotFoundPage'
import RestaurantFormPage from './pages/AdminPages/AdminPlaceFormPage'
import UpdateProfilePage from './pages/UserPages/UpdateProfilePage'
import Navigation from './pages/Partials/Navigation'
import Container from 'react-bootstrap/Container'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './assets/scss/App.scss'
import SignUpPage from './pages/NoLogInPages/SignUpPage'

const App = () => {
	return (
		<div id='App'>
			<Navigation />

			<Container fluid>
				<Routes>
					{/* No Log In Routes */}
					<Route path="*" element={<NotFoundPage />} />
					<Route path="/forgot-password" element={<ForgotPasswordPage />} />
					<Route path="/sign-in" element={<SignInPage />} />
					<Route path="/sign-out" element={<SignOutPage />} />
					<Route path="/sign-up" element={<SignUpPage />} />
					<Route path="/" element={<HomePage />} />

					{/* Protected Routes: */}
					{/* Admin Routes */}

					<Route path="/admin-restaurant-form" element={
						// <RequireAuth>
						<RestaurantFormPage />
						// </RequireAuth>
					} />

					{/* User Routes */}
					<Route path="/update-profile" element={
						// <RequireAuth>
						<UpdateProfilePage />
						// </RequireAuth>
					} />
				</Routes>

				<ToastContainer
					autoClose={3000}
					theme='colored'
					position='bottom-right'
				/>
			</Container>
		</div>
	)
}

export default App
