import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import './assets/scss/App.scss'
import NotFoundPage from './pages/NoLogInPages/NotFoundPage'
import ForgotPasswordPage from './pages/NoLogInPages/ForgotPasswordPage'
import LoginPage from './pages/NoLogInPages/LoginPage'
import LogoutPage from './pages/NoLogInPages/LogoutPage'
import SignupPage from './pages/NoLogInPages/SignupPage'
import HomePage from './pages/NoLogInPages/HomePage'
import MapPage from './pages/NoLogInPages/MapPage'
import RestaurantListPage from './pages/NoLogInPages/RestaurantListPage'
import UpdateProfilePage from './pages/UserPages/UpdateProfilePage'
import TipsPage from './pages/UserPages/TipsPage'
import AdminUsersOverviewPage from './pages/AdminPages/AdminUsersOverviewPage'
import AdminRestaurantsOverviewPage from './pages/AdminPages/AdminRestaurantsOverviewPage'
import Navigation from './pages/Partials/Navigation'

import Container from 'react-bootstrap/Container'

const App = () => {
	return (
		<div id='App'>
			<Navigation />

			<Container fluid>
				<Routes>
					{/* No Log In Routes */}
					<Route path="*" element={<NotFoundPage />} />
					<Route path="/forgot-password" element={<ForgotPasswordPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/logout" element={<LogoutPage />} />
					<Route path="/signup" element={<SignupPage />} />
					<Route path="/" element={<HomePage />} />
					<Route path="/map" element={<MapPage />} />
					<Route path="/restaurants" element={<RestaurantListPage />} />

					{/* Protected Routes: */}
					{/* Admin Routes */}
					<Route path="/admin-usersoverview" element={
						// <RequireAuth>
						<AdminUsersOverviewPage />
						// </RequireAuth>
					} />
					<Route path="/admin-restaurantsoverview" element={
						// <RequireAuth>
						<AdminRestaurantsOverviewPage />
						// </RequireAuth>
					} />

					{/* User Routes */}
					<Route path="/update-profile" element={
						// <RequireAuth>
						<UpdateProfilePage />
						// </RequireAuth>
					} />
					<Route path="/tips" element={
						// <RequireAuth>
						<TipsPage />
						// </RequireAuth>
					} />
				</Routes>

				<ToastContainer
					autoClose={2000}
					theme='colored'
				/>
			</Container>
		</div>
	)
}

export default App
