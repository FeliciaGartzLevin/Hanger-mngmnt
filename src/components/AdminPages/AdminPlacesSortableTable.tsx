import DateCell from './DateCell'
import { doc, updateDoc } from 'firebase/firestore'
import { placesCol } from '../../services/firebase'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table'
import { Place } from '../../types/Place.types'

interface IProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
}

const AdminPlacesSortableTable = <TData, TValue>({
	columns,
	data,
}: IProps<TData, TValue>) => {
	const [sorting, setSorting] = useState<SortingState>([])

	const table = useReactTable({
		columns,
		data,
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	})

	const toggleApproval = (PlaceData: Place) => {
		const docRef = doc(placesCol, PlaceData._id)
		updateDoc(docRef, {
			isApproved: !PlaceData.isApproved
		})
	}

	const renderApprovalCell = (PlaceData: Place) => (
		<Form>
			<Form.Check
				checked={PlaceData.isApproved}
				id='approval-switch'
				onChange={() => toggleApproval(PlaceData)}
				type='switch'
			/>
		</Form>
	)

	const cellRenderer = (cellType: string, PlaceData: Place) => {
		switch (cellType) {
			case 'createdAt':
				return <DateCell date={PlaceData.createdAt.toDate()} />
			case 'isApproved':
				return renderApprovalCell(PlaceData)
			default:
				return
		}
	}

	const altRendering = ['createdAt', 'isApproved']

	return (
		<Table striped bordered hover responsive>
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<th key={header.id} colSpan={header.colSpan}>
								{header.isPlaceholder ? null : (
									<div
										{...{
											className:
												header.column.getCanSort()
													? 'cursor-pointer select-none'
													: '',
											onClick:
												header.column.getToggleSortingHandler()
										}}
									>
										{flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}

										{{
											asc: " ⬆",
											desc: " ⬇"
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
						{row.getVisibleCells().map((cell) => (
							<td key={cell.id}>
								{altRendering.includes(cell.column.id)
								? cellRenderer(cell.column.id, row.original as Place)
								: (
									flexRender(
										cell.column.columnDef.cell,
										cell.getContext()
									)
								)}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</Table>
	)
}

export default AdminPlacesSortableTable
