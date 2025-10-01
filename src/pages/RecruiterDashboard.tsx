import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../auth/AuthProvider';

// A simplified CreateJobForm for this unstyled version
const CreateJobForm = ({ onJobCreated }: { onJobCreated: () => void }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from('jobs').insert({
      recruiter_id: user.id,
      title,
      company_name: companyName
    });
    if (error) {
      alert(error.message);
    } else {
      alert('Job created!');
      setTitle('');
      setCompanyName('');
      onJobCreated();
    }
  };

  return (
    <form onSubmit={handleCreateJob} style={{ border: '1px solid black', padding: '10px' }}>
      <h3>Create New Job</h3>
      <input
        type="text"
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <button type="submit">Create Job</button>
    </form>
  );
};


const RecruiterDashboard = () => {
  const { user, signOut } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, company_name')
        .eq('recruiter_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      alert("Error fetching jobs: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  if (loading) return <div>Loading Dashboard...</div>;

  return (
    <div>
      <h1>Recruiter Dashboard</h1>
      <CreateJobForm onJobCreated={fetchJobs} />
      <hr />
      <h2>Your Job Listings</h2>
      {jobs.length === 0 ? (
        <p>You haven't posted any jobs yet.</p>
      ) : (
        <div>
          {jobs.map(job => (
            <div key={job.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
              <h3>{job.title}</h3>
              <p>{job.company_name}</p>
              <Link to={`/jobs/${job.id}/applicants`}>View Applicants</Link>
            </div>
          ))}
        </div>
      )}
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

export default RecruiterDashboard;