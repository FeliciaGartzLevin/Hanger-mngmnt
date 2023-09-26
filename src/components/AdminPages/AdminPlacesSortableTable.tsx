import { doc, updateDoc } from "firebase/firestore";
import { placesCol } from "../../services/firebase";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { Place } from "../../types/Place.types";
import Pagination  from '../../components/Pagination'

interface IProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

const AdminUsersSortableTable = <TData, TValue>({
	columns,
	data,
}: IProps<TData, TValue>) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [sorting, setSorting] = useState<SortingState>([]);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

	const table = useReactTable({
		columns,
		data: currentItems,
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	const toggleApproval = (PlaceData: Place) => {
		const docRef = doc(placesCol, PlaceData._id);
		updateDoc(docRef, {
			isApproved: !PlaceData.isApproved,
		});
	};

	const renderApprovalCell = (PlaceData: Place) => (
		<Form>
			<Form.Check
				checked={PlaceData.isApproved}
				id="approval-switch"
				onChange={() => toggleApproval(PlaceData)}
				type="switch"
			/>
		</Form>
	);

	const cellRenderer = (cellType: string, PlaceData: Place) => {
		switch (cellType) {
			case "isApproved":
				return renderApprovalCell(PlaceData);
			default:
				return;
		}
	};

	const altRendering = ["isApproved"];

	return (
		<>
			<Table striped bordered hover responsive>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id} colSpan={header.colSpan}>
									{header.isPlaceholder ? null : (
										<div
											className={
												header.column.getCanSort()
													? "cursor-pointer select-none"
													: ""
											}
											onClick={header.column.getToggleSortingHandler()}
										>
											{flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
											{{
												asc: " ⬆",
												desc: " ⬇",
											}[
												header.column.getIsSorted() as string
											] ?? null}
										</div>
									)}
								</th>
							))}
						</tr>
					))}
				</thead>

				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row
								.getVisibleCells()
								.map((cell) =>
									cell.column.id in altRendering ? (
										<td key={cell.id}>
											{cellRenderer(
												cell.column.id,
												row.original as Place
											)}
										</td>
									) : (
										<td key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</td>
									)
								)}
						</tr>
					))}
				</tbody>
			</Table>

			<Pagination
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				totalItems={data.length}
				itemsPerPage={itemsPerPage}
			/>
		</>
	);
};

export default AdminUsersSortableTable;
