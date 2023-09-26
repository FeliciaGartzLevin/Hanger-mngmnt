interface IPaginationProps {
	currentPage: number
	setCurrentPage: (pageNumber: number) => void
	totalItems: number
	itemsPerPage: number
}

const Pagination = ({  setCurrentPage, totalItems, itemsPerPage }: IPaginationProps) => {
	const totalPages = Math.ceil(totalItems / itemsPerPage)

	const handleClick = (pageNumber: number) => {
		setCurrentPage(pageNumber)
	}

	return (
		<div>
			{Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
				<button key={pageNumber} onClick={() => handleClick(pageNumber)}>
					{pageNumber}
				</button>
			))}
		</div>
	)
}

export default Pagination
