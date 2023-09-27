import { doc, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Image from 'react-bootstrap/Image'
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

	const renderPhotoCell = (photoData: Photo) => (
		<Image
			alt={photoData.name}
			className='img-square'
			rounded
			src={photoData.url}
			width={50}
		/>
	)

	const renderDateCell = (date: Date) => {
		return new Intl.DateTimeFormat('sv', {
			year: '2-digit',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date)
	}

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

	const cellRenderer = (cellType: string, photoData: Photo) => {
		switch (cellType) {
			case 'url':
				return renderPhotoCell(photoData)
			case 'createdAt':
				return renderDateCell(photoData.createdAt.toDate())
			case 'isApproved':
				return renderApprovalCell(photoData)
			default:
				return
		}
	}

	const altRendering = ['url', 'createdAt', 'isApproved']

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
