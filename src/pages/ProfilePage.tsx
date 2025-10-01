import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../auth/AuthProvider';

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
    return <div>Loading Your Profile...</div>;
  }

  if (!profile) {
    return <div>Could not load profile.</div>;
  }

  return (
    <div>
      <h1>Your Profile</h1>
      <h2>{profile.full_name || profile.username}</h2>
      <p>Archetype: {profile.archetype}</p>

      <h3>Skills</h3>
      <ul>
        {profile.skills && Object.entries(profile.skills).map(([skill, score]) => (
          <li key={skill}>{skill}: {score as number}%</li>
        ))}
      </ul>

      <h3>Values</h3>
      <ul>
        {profile.values?.map((value: string) => (
          <li key={value}>{value}</li>
        ))}
      </ul>

      <Link to="/quest">Continue to First Quest</Link>
    </div>
  );
};

export default ProfilePage;