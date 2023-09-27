import AdminPhotosSortableTable from '../../components/AdminPages/AdminPhotosSortableTable'
import PaginationComponent from '../../components/PaginationComponent'
import useStreamPhotos from '../../hooks/useStreamPhotos'
import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import { ColumnDef } from '@tanstack/react-table'
import { Photo } from '../../types/Photo.types'

const columns: ColumnDef<Photo>[] = [
	{
		accessorKey: 'url',
		header: 'Photo'
	},
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'placeName',
		header: 'Place'
	},
	{
		accessorKey: 'createdAt',
		header: 'Created'
	},
	{
		accessorKey: 'isApproved',
		header: 'Approved'
	},
]

const AdminPhotosListPage = () => {
	const { data, error, isError, isLoading } = useStreamPhotos()

	const itemsPerPage = 10
	const [currentPage, setCurrentPage] = useState(1)

	if (isLoading) return <div>Loading photos...</div>

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
				<h3 className='mb-3'>Photos</h3>
				<AdminPhotosSortableTable
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

export default AdminPhotosListPage
