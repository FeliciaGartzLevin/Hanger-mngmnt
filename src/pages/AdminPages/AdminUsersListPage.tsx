import { ColumnDef } from '@tanstack/react-table';
import AdminUsersSortableTable from '../../components/AdminPages/AdminUsersSortableTable'
import { UserDoc } from '../../types/User.types';
import useGetUsers from '../../hooks/useGetUsers';

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
	const { data, loading } = useGetUsers()

	{loading && <div>Loading users...</div>}

	if (data) return (
		<AdminUsersSortableTable columns={columns} data={data} />
	)
}

export default AdminUsersListPage;
