import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

// Define the Profile type based on the database schema
export interface Profile {
  id: string;
  role: 'student' | 'recruiter';
  name: string;
  onboarding_complete: boolean;
  archetype?: string;
  personality_tags?: string[];
  vision_board?: any;
  recommended_path?: string;
  university?: string;
  skills?: string[];
}

// --- Auth Context Type ---
interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

// --- Auth Provider ---
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange fires immediately with the initial session state,
    // so we don't need a separate getSession() call. This simplifies the logic
    // and prevents race conditions.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      setSession(session);
      setProfile(null); // Reset profile on auth change

      if (session?.user) {
         const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        // 'PGRST116' is the code for 'no rows found', which is expected if the profile hasn't been created yet.
        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching profile on auth state change:", error);
        } else if (profileData) {
          setProfile(profileData as Profile);
        }
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading
  };

  // Render children only when the initial loading is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);