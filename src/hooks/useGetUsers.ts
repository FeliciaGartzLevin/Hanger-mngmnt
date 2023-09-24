import useStreamCollection from './useStreamCollection'
import { usersCol } from '../services/firebase'
import { UserDoc } from '../types/User.types'

const useGetUsers = () => {
	return useStreamCollection<UserDoc>(
		usersCol
	)
}

export default useGetUsers
