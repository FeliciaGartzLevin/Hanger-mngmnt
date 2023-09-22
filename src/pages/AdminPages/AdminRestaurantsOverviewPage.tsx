import { ColumnDef } from '@tanstack/react-table'
// import Card from 'react-bootstrap/Card'
import WarningAlert from '../components/alerts/WarningAlert'
// import CreateRestaurantForm from '../components/forms/CreateRestaurantForm'
import TanstackSortableTable from '../../components/AdminPages/tables/TanstackSortableTable'
import { Restaurant } from '../../types/Restaurant.types'
import useGetRestaurants from '../../hooks/useGetRestaurants'


const columns: ColumnDef<Restaurant>[] = [
	{
		accessorKey: 'Name',
		header: 'Name',
	},
	{
		accessorKey: 'streetAddress',
		header: 'Adress',
	},
	{
		accessorKey: 'category',
		header: 'Category',
	},
	{
		accessorKey: 'isAdmin',
		header: 'Admin',
	},
]

const BooksPage = () => {
	const { data: books, isError, isLoading } = useGetRestaurants()

	return (
		<>
			<h1 className="mb-3">Books</h1>

			{isError && (
				<WarningAlert>
					An terrible, inexplicable error occurred while fetching books. It wasn't me!
				</WarningAlert>
			)}

			{isLoading && (
				<p>Loading restaurants...</p>
			)}

			{books && <TanstackSortableTable columns={columns} data={books} />}

			<hr className="mb-5" />

			{/* <Card>
				<Card.Body>
					<Card.Title>Create Book</Card.Title>
					<CreatRestaurantForm />
				</Card.Body>
			</Card> */}
		</>
	)
}

export default BooksPage
