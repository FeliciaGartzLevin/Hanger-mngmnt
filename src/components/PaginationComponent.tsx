import { Pagination } from "react-bootstrap";

interface IPaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (pageNumber: number) => void;
}

const PaginationComponent = ({ currentPage, totalPages, onPageChange }: IPaginationProps) => {
	return (
		<Pagination>
			<Pagination.Prev
				disabled={currentPage === 1}
				onClick={() => onPageChange(currentPage - 1)}
			/>
			{Array.from({ length: totalPages }, (_, index) => (
				<Pagination.Item
					key={index + 1}
					active={currentPage === index + 1}
					onClick={() => onPageChange(index + 1)}
				>
					{index + 1}
				</Pagination.Item>
			))}
			<Pagination.Next
				disabled={currentPage === totalPages}
				onClick={() => onPageChange(currentPage + 1)}
			/>
		</Pagination>
	);
};

export default PaginationComponent;
