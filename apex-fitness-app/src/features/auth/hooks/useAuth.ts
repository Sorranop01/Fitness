import { useEffect, useState } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User } from '@/types';
import { getUserById } from '../api/authApi';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Fetch complete user data from Firestore
          const userData = await getUserById(firebaseUser.uid);
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to basic user data from Firebase Auth
          const basicUserData: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            role: 'member',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setUser(basicUserData);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
