import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../auth/AuthProvider';

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  const fetchJobsAndApplications = useCallback(async () => {
    if (!user) return;
    try {
      const { data: jobsData } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      setJobs(jobsData || []);

      const { data: applicationsData } = await supabase.from('applications').select('job_id').eq('user_id', user.id);
      const appliedIds = new Set(applicationsData?.map(app => app.job_id) || []);
      setAppliedJobIds(appliedIds);
    } catch (error: any) {
      alert("Error fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchJobsAndApplications();
  }, [fetchJobsAndApplications]);

  const handleApply = async (jobId: string) => {
    if (!user) return;
    try {
      await supabase.from('applications').insert({ user_id: user.id, job_id: jobId });
      alert("Application successful!");
      setAppliedJobIds(prev => new Set(prev).add(jobId));
    } catch (error: any) {
      alert("Error submitting application: " + error.message);
    }
  };

  if (loading) return <div>Loading Jobs...</div>;

  return (
    <div>
      <h1>Job Board</h1>
      {jobs.length === 0 ? (
        <p>No jobs available right now.</p>
      ) : (
        <div>
          {jobs.map(job => (
            <div key={job.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
              <h2>{job.title}</h2>
              <p>{job.company_name}</p>
              <p>{job.description}</p>
              <p>Salary: {job.salary} TND</p>
              <button onClick={() => handleApply(job.id)} disabled={appliedJobIds.has(job.id)}>
                {appliedJobIds.has(job.id) ? 'Applied' : '1-Tap Apply'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;