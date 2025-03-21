import { create } from 'zustand';
import { AuthState } from '../types/auth';
import { supabase } from '../lib/supabase';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
}));

export const initializeAuth = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      useAuthStore.setState({ error: error.message, loading: false });
      return;
    }

    if (session?.user) {
      useAuthStore.setState({
        user: {
          id: session.user.id,
          email: session.user.email!,
          username: session.user.user_metadata.username || '',
          created_at: session.user.created_at,
        },
        loading: false,
      });
    } else {
      useAuthStore.setState({ loading: false });
    }
  } catch (error) {
    useAuthStore.setState({ 
      error: 'Failed to initialize authentication',
      loading: false 
    });
  }
};