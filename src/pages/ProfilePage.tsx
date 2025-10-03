import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const ProfilePage = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [goals, setGoals] = useState('');

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      if (!session?.user) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`name, university, skills, goals`)
        .eq('id', session.user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setName(data.name || '');
          setUniversity(data.university || '');
          setSkills(data.skills || []);
          setGoals(data.goals || '');
        }
      }

      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user) return;

    setLoading(true);
    const updates = {
      id: session.user.id,
      name,
      university,
      skills,
      goals,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      alert(error.message);
    } else {
      alert('Profile updated successfully!');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Your Profile</h1>
      <Card>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleUpdateProfile}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="name">Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}/>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="university">University</label>
              <input id="university" type="text" value={university} onChange={(e) => setUniversity(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}/>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="skills">Skills (comma-separated)</label>
              <input id="skills" type="text" value={skills.join(', ')} onChange={(e) => setSkills(e.target.value.split(',').map(s => s.trim()))} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}/>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="goals">Your Goals</label>
              <textarea id="goals" value={goals} onChange={(e) => setGoals(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', minHeight: '100px' }}/>
            </div>
            <div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;