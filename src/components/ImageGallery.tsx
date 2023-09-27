import { Image } from 'react-bootstrap'
import Slider from 'react-slick'
import { Photo } from '../types/Photo.types'

interface IProps {
	photos: Photo[]
}

const ImageGallery: React.FC<IProps> = ({ photos }) => {
	const settings = {
		autoplay: true,
		dots: true,
		infinite: true,
		slidesToScroll: 1,
		slidesToShow: 3
	}

	return (
		<div className='px-3'>
			<Slider
				className='my-3'
				{...settings}
			>
				{photos.map(photo => (
					<div
						className='p-1'
						key={photo._id}
					>
						<Image
							className='img-square'
							fluid
							rounded
							src={photo.url}
						/>
					</div>
				))}
			</Slider>
		</div>
	)
}

export default ImageGallery
