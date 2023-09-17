import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'

const HomePage = () => {
	return (
		<Container>
			<h1>Welcome to The Hangry App</h1>
			<p>- Always by your side in case you get hangry 🔥🌭🍟🍔🍕🌮🥪🥙🥗</p>

			<Link to='/map'>
				<Button>See map</Button>
			</Link>
		</Container>

	)
}

export default HomePage
