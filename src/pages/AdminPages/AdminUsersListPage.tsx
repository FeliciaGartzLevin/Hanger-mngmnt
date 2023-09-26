import { useState } from 'react'; // Import useState
import { ColumnDef } from '@tanstack/react-table';
import AdminUsersSortableTable from '../../components/AdminPages/AdminUsersSortableTable'
import { UserDoc } from '../../types/User.types';
import useGetUsers from '../../hooks/useGetUsers';
import { Alert } from 'react-bootstrap';
import PaginationComponent from '../../components/PaginationComponent';

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
  const { data, error, isError, isLoading } = useGetUsers();


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (isLoading) return <div>Loading users...</div>;

  if (isError) return <Alert variant='danger'>{error}</Alert>;

  if (data) {

    const totalPages = Math.ceil(data.length / itemsPerPage);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);


    const handlePageChange = (pageNumber:number) => {
      setCurrentPage(pageNumber);
    };

    return (
      <>
        <h3 className='mb-3'>Users</h3>
        <AdminUsersSortableTable columns={columns} data={currentItems} />
        <div className="d-flex flex-column align-items-center">

          {/* Pass currentPage, totalPages, and handlePageChange to PaginationComponent */}
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

        </div>
      </>
    );
  }
}

export default AdminUsersListPage;
