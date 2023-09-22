import { ColumnDef } from "@tanstack/react-table";
// import Card from 'react-bootstrap/Card'
import WarningAlert from "../../components/Alerts/WarningAlert";
// import CreateRestaurantForm from '../components/forms/CreateRestaurantForm'
import TanstackSortableTable from "../../components/AdminPages/tables/TanstackSortableTable";
import { Place } from "../../types/Place.types";
import useGetPlaces from "../../hooks/useGetPlaces";

const columns: ColumnDef<Place>[] = [
	{
		accessorKey: "Name",
		header: "Name",
	},
	{
		accessorKey: "streetAddress",
		header: "Adress",
	},
	{
		accessorKey: "category",
		header: "Category",
	},
	{
		accessorKey: "isApproved",
		header: "Approved",
	},
];

const AdminPlacesOverviewPage = () => {
	const { data: books, isError, isLoading } = useGetPlaces();

	return (
		<>
			<h1 className="mb-3">Books</h1>

			{isError && (
				<WarningAlert>
					An terrible, inexplicable error occurred while fetching
					books. It wasn't me!
				</WarningAlert>
			)}

			{isLoading && <p>Loading places...</p>}

			{books && <TanstackSortableTable columns={columns} data={books} />}

			<hr className="mb-5" />

		</>
	);
};

export default AdminPlacesOverviewPage;
