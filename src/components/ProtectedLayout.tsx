import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

const ProtectedLayout = () => {
    const { session, loading: authLoading } = useAuth() as { session: Session | null; loading: boolean };
    const [profile, setProfile] = useState<any>(null);
    const [profileLoading, setProfileLoading] = useState(true);

    useEffect(() => {
        if (session?.user) {
            const fetchProfile = async () => {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('onboarding_complete')
                    .eq('id', session.user.id)
                    .single();

                if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
                    console.error('Error fetching profile:', error);
                }

                setProfile(data);
                setProfileLoading(false);
            };
            fetchProfile();
        } else if (!authLoading) {
            setProfileLoading(false);
        }
    }, [session, authLoading]);

    if (authLoading || profileLoading) {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <Navigate to="/signup" replace />;
    }

    if (!profile?.onboarding_complete) {
        return <Navigate to="/onboarding" replace />;
    }

    return <Outlet />;
}

export default ProtectedLayout;