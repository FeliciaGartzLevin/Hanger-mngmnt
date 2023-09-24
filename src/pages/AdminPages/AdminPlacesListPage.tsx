import AdminPlacesSortableTable from '../../components/AdminPages/AdminPlacesSortableTable'
import useGetPlaces from '../../hooks/useGetPlaces'
import Alert from 'react-bootstrap/Alert'
import { ColumnDef } from '@tanstack/react-table'
import { Place } from '../../types/Place.types'

const columns: ColumnDef<Place>[] = [
	{
		accessorKey: 'name',
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
		accessorKey: 'isApproved',
		header: 'Approved',
	},
]

const AdminPlacesListPage = () => {
	const { data, error, isError, isLoading } = useGetPlaces()

	if (isLoading) return <div>Loading users...</div>

	if (isError) return <Alert variant='danger'>{error}</Alert>

	if (data) return (
		<>
			<h3 className='mb-3'>Places</h3>
			<AdminPlacesSortableTable columns={columns} data={data} />
		</>
	)
}

export default AdminPlacesListPage
