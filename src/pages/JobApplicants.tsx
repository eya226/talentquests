import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const JobApplicants = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!jobId) return;
      try {
        const { data: jobData } = await supabase.from('jobs').select('title').eq('id', jobId).single();
        if (jobData) setJobTitle(jobData.title);

        const { data: applications } = await supabase.from('applications').select('user_id').eq('job_id', jobId);
        const userIds = applications?.map(app => app.user_id) || [];

        if (userIds.length > 0) {
          const { data: profiles } = await supabase.from('profiles').select('id, full_name, username, archetype').in('id', userIds);
          setApplicants(profiles || []);
        }
      } catch (error: any) {
        console.error("Error fetching applicants:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  if (loading) return <div>Loading Applicants...</div>;

  return (
    <div>
      <Link to="/recruiter-dashboard">&larr; Back to Dashboard</Link>
      <h1>Applicants for {jobTitle}</h1>
      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <div>
          {applicants.map(applicant => (
            <div key={applicant.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
              <h2>{applicant.full_name || applicant.username}</h2>
              <p>{applicant.archetype || 'No archetype'}</p>
              <Link to={`/profile/${applicant.id}`}>View Profile</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicants;