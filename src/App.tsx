import ForgotPasswordPage from './pages/GuestPages/ForgotPasswordPage'
import HomePage from './pages/GuestPages/HomePage'
import SignInPage from './pages/GuestPages/SignInPage'
import SignOutPage from './pages/GuestPages/SignOutPage'
import NotFoundPage from './pages/GuestPages/NotFoundPage'
import AdminPlaceFormPage from './pages/AdminPages/AdminPlaceFormPage'
import AdminPlacesOverviewPage from './pages/AdminPages/AdminPlacesOverviewPage'
import UpdateProfilePage from './pages/UserPages/UpdateProfilePage'
import Navigation from './pages/Partials/Navigation'
import Container from 'react-bootstrap/Container'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './assets/scss/App.scss'
import SignUpPage from './pages/GuestPages/SignUpPage'
import UserPlaceFormPage from './pages/UserPages/UserPlaceFormPage'
import RequireAuth from './components/RequireAuth'
import RequireAuthAdmin from './components/RequireAuthAdmin'

const App = () => {
	return (
		<div id='App'>
			<Navigation />

			<Container fluid>
				<Routes>
					{/* Guest Routes */}
					<Route path="*" element={<NotFoundPage />} />
					<Route
						path="/forgot-password"
						element={<ForgotPasswordPage />}
					/>
					<Route path="/sign-in" element={<SignInPage />} />
					<Route path="/sign-out" element={<SignOutPage />} />
					<Route path="/sign-up" element={<SignUpPage />} />
					<Route path="/" element={<HomePage />} />

					{/* Protected Routes: */}
					{/* Admin Routes */}

					<Route path="/admin-place-form" element={
						<RequireAuthAdmin>
							<AdminPlaceFormPage />
						</RequireAuthAdmin>
					} />
					<Route path="/admin-places" element={
						<RequireAuthAdmin>
							<AdminPlacesOverviewPage />
						</RequireAuthAdmin>
					} />

					{/* User Routes */}
					<Route
						path='/update-profile'
						element={
							<RequireAuth>
								<UpdateProfilePage />
							</RequireAuth>
						}
					/>
					<Route
						path='/recommend-place'
						element={
							<RequireAuth>
								<UserPlaceFormPage />
							</RequireAuth>
						}
					/>
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
