import { Image } from 'react-bootstrap'
import Slider from 'react-slick'
import { Photo } from '../types/Photo.types'

interface IProps {
	photos: Photo[]
}

const ImageGallery: React.FC<IProps> = ({ photos }) => {
	const imagesVisible = 3

	const settings = {
		autoplay: photos.length > imagesVisible,
		dots: true,
		infinite: true,
		slidesToScroll: 1,
		slidesToShow: imagesVisible,
		className: 'my-3'
	}

	const elements = []
	for (let i = photos.length; i < imagesVisible; i++) {
		elements.push(
			<Image
				className='img-square p-1'
				fluid
				src={'https://firebasestorage.googleapis.com/v0/b/the-hangry-app.appspot.com/o/places%2FChIJ78Wol-SjU0YRMmTNTQP42vc%2F72adbfcb-8544-4f50-b582-953eef8893d7.png?alt=media&token=89e7f6d5-a3ef-4c71-a6c1-f62830209a80'}
			/>
		)
	}

	return (
		<div className='px-3'>
			<Slider {...settings}>
				{photos.map(photo => (
					<Image
						className='img-square p-1'
						fluid
						key={photo._id}
						rounded
						src={photo.url}
					/>
				))}
				{!elements.length && elements}
			</Slider>
		</div>
	)
}

export default ImageGallery
