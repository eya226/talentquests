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
    const fetchSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        // 'PGRST116' is the code for 'no rows found', which is expected if the profile hasn't been created yet.
        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching profile:", error);
        } else if (profileData) {
          setProfile(profileData as Profile);
        }
      }
      setLoading(false);
    };

    fetchSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setProfile(null);
      setLoading(true);

      if (session?.user) {
         const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching profile on auth state change:", error);
        } else if (profileData) {
          setProfile(profileData as Profile);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);