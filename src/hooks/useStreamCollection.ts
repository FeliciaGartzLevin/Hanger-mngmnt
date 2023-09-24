import { CollectionReference, QueryConstraint, onSnapshot, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'

const useStreamCollection = <T>(
  colRef: CollectionReference<T>,
  ...queryConstraints: QueryConstraint[]
) => {
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const queryRef = query(colRef, ...queryConstraints);

    const unsubscribe = onSnapshot(queryRef, (snapshot) => {
      const data: T[] = snapshot.docs.map(doc => {
        return {
          ...doc.data(),
          _id: doc.id,
        };
      });

      setData(data);
      setIsLoading(false);
    }, (err) => {
      setError(err);
      setIsLoading(false);
    });

    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colRef]);

  return {
    data,
    isLoading,
    error,
  };
};

export default useStreamCollection;
