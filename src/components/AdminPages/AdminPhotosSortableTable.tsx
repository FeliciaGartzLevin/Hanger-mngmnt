import DateCell from './DateCell'
import PhotoCell from './PhotoCell'
import UserNameCell from './UserNameCell'
import { doc, updateDoc } from 'firebase/firestore'
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
import { photosCol } from '../../services/firebase'
import { Photo } from '../../types/Photo.types'

interface IProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
}

const AdminPhotosSortableTable = <TData, TValue>({
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

	const toggleApproval = (photoData: Photo) => {
		const docRef = doc(photosCol, photoData._id)
		updateDoc(docRef, {
			isApproved: !photoData.isApproved
		})
	}

	const renderApprovalCell = (photoData: Photo) => (
		<Form>
			<Form.Check
				checked={photoData.isApproved}
				id='approval-switch'
				onChange={() => toggleApproval(photoData)}
				type='switch'
			/>
		</Form>
	)

	const cellRenderer = (cellType: string, photo: Photo) => {
		switch (cellType) {
			case 'url':
				return <PhotoCell alt={photo.name} src={photo.url} />
			case 'uid':
				return <UserNameCell uid={photo.uid} />
			case 'createdAt':
				return <DateCell date={photo.createdAt.toDate()} />
			case 'isApproved':
				return renderApprovalCell(photo)
			default:
				return
		}
	}

	const altRendering = ['url', 'uid', 'createdAt', 'isApproved']

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
								? cellRenderer(cell.column.id, row.original as Photo)
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

export default AdminPhotosSortableTable
