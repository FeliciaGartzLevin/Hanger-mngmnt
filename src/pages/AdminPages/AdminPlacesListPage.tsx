import AdminPlacesSortableTable from '../../components/AdminPages/AdminPlacesSortableTable'
import PaginationComponent from '../../components/PaginationComponent'
import useStreamPlaces from '../../hooks/useStreamPlaces'
import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import { ColumnDef } from '@tanstack/react-table'
import { Place } from '../../types/Place.types'

const columns: ColumnDef<Place>[] = [
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'streetAddress',
		header: 'Address'
	},
	{
		accessorKey: 'category',
		header: 'Category'
	},
	{
		accessorKey: 'isApproved',
		header: 'Approved'
	},
]

const AdminPlacesListPage = () => {
	const { data, error, isError, isLoading } = useStreamPlaces()

	const itemsPerPage = 10
	const [currentPage, setCurrentPage] = useState(1)

	if (isLoading) return <div>Loading places...</div>

	if (isError) return <Alert variant='danger'>{error}</Alert>

	if (data) {
		const totalPages = Math.ceil(data.length / itemsPerPage)

		const indexOfLastItem = currentPage * itemsPerPage
		const indexOfFirstItem = indexOfLastItem - itemsPerPage
		const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)

		const handlePageChange = (pageNumber: number) => {
			setCurrentPage(pageNumber)
		}

		return (
			<>
				<h3 className='mb-3 title-table'>Places</h3>
				<AdminPlacesSortableTable
					columns={columns}
					data={currentItems}
				/>

				<div className='d-flex flex-column align-items-center'>
					<PaginationComponent
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</div>
			</>
		)
	}
}

export default AdminPlacesListPage
