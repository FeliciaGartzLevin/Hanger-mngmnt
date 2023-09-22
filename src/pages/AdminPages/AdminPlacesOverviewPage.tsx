import { ColumnDef } from "@tanstack/react-table";
// import Card from 'react-bootstrap/Card'
import WarningAlert from "../../components/Alerts/WarningAlert";
// import CreatePlaceForm from '../components/forms/CreatePlaceForm'
import TanstackSortableTable from "../../components/AdminPages/tables/TanstackSortableTable";
import { Place } from "../../types/Place.types";
import useGetPlaces from "../../hooks/useGetPlaces";

const columns: ColumnDef<Place>[] = [
	{
		accessorKey: "name",
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
	const { data: places, error: isError, isLoading } = useGetPlaces();

	return (
		<>
			<h1 className="mb-3">Places</h1>

			{isError && (
				<WarningAlert>
					An terrible, inexplicable error occurred while fetching
					books. It wasn't me!
				</WarningAlert>
			)}

			{isLoading && <p>Loading places...</p>}

			{places && <TanstackSortableTable columns={columns} data={places} />}

			<hr className="mb-5" />

		</>
	);
};

export default AdminPlacesOverviewPage;
