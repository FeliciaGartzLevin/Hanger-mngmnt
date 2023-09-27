import AdminUsersSortableTable from '../../components/AdminPages/AdminUsersSortableTable'
import PaginationComponent from '../../components/PaginationComponent'
import useStreamUsers from '../../hooks/useStreamUsers'
import { useState } from 'react'
import { Alert } from 'react-bootstrap'
import { ColumnDef } from '@tanstack/react-table'
import { UserDoc } from '../../types/User.types'

const columns: ColumnDef<UserDoc>[] = [
	{
		accessorKey: 'photoURL',
		header: 'Photo'
	},
	{
		accessorKey: 'displayName',
		header: 'Name'
	},
	{
		accessorKey: 'email',
		header: 'Email'
	},
	{
		accessorKey: 'createdAt',
		header: 'Created'
	},
	{
		accessorKey: 'updatedAt',
		header: 'Updated'
	},
	{
		accessorKey: 'isAdmin',
		header: 'Admin'
	}
]

const AdminUsersListPage = () => {
	const { data, error, isError, isLoading } = useStreamUsers()

	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 10

	if (isLoading) return <div>Loading users...</div>

	if (isError) return <Alert variant='danger'>{error}</Alert>

	if (data) {
		const totalPages = Math.ceil(data.length / itemsPerPage)

		const indexOfLastItem = currentPage * itemsPerPage
		const indexOfFirstItem = indexOfLastItem - itemsPerPage
		const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)

		const handlePageChange = (pageNumber:number) => {
			setCurrentPage(pageNumber)
		}

		return (
			<>
				<h3 className='mb-3 title-table'>Users</h3>
				<AdminUsersSortableTable
					columns={columns}
					data={currentItems}
				/>

				<div className="d-flex flex-column align-items-center">
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

export default AdminUsersListPage
