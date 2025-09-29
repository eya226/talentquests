import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../auth/AuthProvider';
import ProfileReveal from '../components/ProfileReveal'; // Re-using the reveal component for display

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (error) throw error;
        setProfile(data);
      } catch (error: any) {
        console.error("Error fetching profile:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center"><p>Loading Your Profile...</p></div>;
  }

  if (!profile) {
    return <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center"><p>Could not load profile.</p></div>;
  }

  // We are re-using the ProfileReveal component to display the data, but without the button logic.
  // A better approach would be to separate the display logic from ProfileReveal, but this works for now.
  return (
    <div className="bg-gray-900 text-white min-h-screen pt-10">
        <ProfileReveal profile={profile} onBeginQuest={() => {}} isLoading={false} />
        <div className="text-center mt-[-2rem] pb-8">
             <Link to="/quest" className="bg-green-500 text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-green-600 transition-transform transform hover:scale-105">
                Continue to First Quest
            </Link>
        </div>
    </div>
  );
};

export default ProfilePage;