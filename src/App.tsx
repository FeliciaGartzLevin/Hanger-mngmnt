import ForgotPasswordPage from "./pages/NoLogInPages/ForgotPasswordPage";
import HomePage from "./pages/NoLogInPages/HomePage";
import SignInPage from "./pages/NoLogInPages/SignInPage";
import SignOutPage from "./pages/NoLogInPages/SignOutPage";
import MapPage from "./pages/NoLogInPages/MapPage";
import NotFoundPage from "./pages/NoLogInPages/NotFoundPage";
import AdminRestaurantFormPage from "./pages/AdminPages/AdminRestaurantFormPage";
import RestaurantListPage from "./pages/NoLogInPages/RestaurantListPage";
import UpdateProfilePage from "./pages/UserPages/UpdateProfilePage";
import AdminUsersOverviewPage from "./pages/AdminPages/AdminUsersOverviewPage";
import AdminRestaurantsOverviewPage from "./pages/AdminPages/AdminRestaurantsOverviewPage";
import Navigation from "./pages/Partials/Navigation";
import Container from "react-bootstrap/Container";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./assets/scss/App.scss";
import SignUpPage from "./pages/NoLogInPages/SignUpPage";
import UserRestaurantFormPage from "./pages/UserPages/UserRestaurantFormPage";


const App = () => {
	return (
		<div id="App">
			<Navigation />

			<Container fluid>
				<Routes>
					{/* No Log In Routes */}
					<Route path="*" element={<NotFoundPage />} />
					<Route
						path="/forgot-password"
						element={<ForgotPasswordPage />}
					/>
					<Route path="/sign-in" element={<SignInPage />} />
					<Route path="/sign-out" element={<SignOutPage />} />
					<Route path="/sign-up" element={<SignUpPage />} />
					<Route path="/" element={<HomePage />} />
					<Route path="/map" element={<MapPage />} />
					<Route
						path="/restaurants"
						element={<RestaurantListPage />}
					/>

					{/* Protected Routes: */}
					{/* Admin Routes */}
					<Route
						path="/admin-usersoverview"
						element={
							// <RequireAuth>
							<AdminUsersOverviewPage />
							// </RequireAuth>
						}
					/>
					<Route
						path="/admin-restaurantsoverview"
						element={
							// <RequireAuth>
							<AdminRestaurantsOverviewPage />
							// </RequireAuth>
						}
					/>
					<Route
						path="/admin-restaurant-form"
						element={
							// <RequireAuth>
							<AdminRestaurantFormPage />
							// </RequireAuth>
						}
					/>

					{/* User Routes */}
					<Route
						path="/update-profile"
						element={
							// <RequireAuth>
							<UpdateProfilePage />
							// </RequireAuth>
						}
					/>
					<Route
						path="/user-recommendation"
						element={
							// <RequireAuth>
							<UserRestaurantFormPage />
							// </RequireAuth>
						}
					/>
				</Routes>

				<ToastContainer
					autoClose={3000}
					theme="colored"
					position="bottom-right"
				/>
			</Container>
		</div>
	);
};

export default App;
