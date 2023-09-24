import { doc, updateDoc } from 'firebase/firestore'
import { usersCol } from '../../services/firebase'
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
import { UserDoc } from '../../types/User.types'

interface IProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
}

const AdminUsersSortableTable = <TData, TValue>({
	columns,
	data,
}: IProps<TData, TValue>) => {
	const [sorting, setSorting] = useState<SortingState>([])

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	})

	const renderPhotoCell = (userData: UserDoc) => (
		<Image
			alt={userData.displayName}
			className='img-square'
			rounded
			src={userData.photoURL}
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

	const toggleAdmin = (userData: UserDoc) => {
		const docRef = doc(usersCol, userData.uid)
		updateDoc(docRef, {
			isAdmin: !userData.isAdmin
		})
	}

	const renderAdminCell = (userData: UserDoc) => (
		<Form>
			<Form.Check
				checked={userData.isAdmin}
				id='admin-switch'
				onChange={() => toggleAdmin(userData)}
				type='switch'
			/>
		</Form>
	)

	const cellRenderer = (cellType: string, userData: UserDoc) => {
		switch (cellType) {
			case 'photoURL':
				return renderPhotoCell(userData)
			case 'createdAt':
				return renderDateCell(userData.createdAt.toDate())
			case 'updatedAt':
				return renderDateCell(userData.updatedAt.toDate())
			case 'isAdmin':
				return renderAdminCell(userData)
			default:
				return
		}
	}

	const altRendering = ['photoURL', 'createdAt', 'updatedAt', 'isAdmin']

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
								? cellRenderer(cell.column.id, row.original as UserDoc)
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

export default AdminUsersSortableTable
