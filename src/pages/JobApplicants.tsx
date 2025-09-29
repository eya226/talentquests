import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface Applicant {
  id: string;
  full_name: string | null;
  username: string;
  archetype: string | null;
}

const JobApplicants = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!jobId) return;

      try {
        // Fetch job title
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('title')
          .eq('id', jobId)
          .single();
        if (jobError) throw jobError;
        setJobTitle(jobData.title);

        // Fetch applications for this job
        const { data: applications, error: appError } = await supabase
          .from('applications')
          .select('user_id')
          .eq('job_id', jobId);
        if (appError) throw appError;

        const userIds = applications.map(app => app.user_id);

        if (userIds.length > 0) {
          // Fetch profiles of applicants
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, full_name, username, archetype')
            .in('id', userIds);
          if (profileError) throw profileError;
          setApplicants(profiles);
        }
      } catch (error: any) {
        console.error("Error fetching applicants:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  if (loading) {
    return <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center"><p>Loading Applicants...</p></div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-blue-400 hover:underline mb-6 inline-block">&larr; Back to Dashboard</Link>
        <h1 className="text-3xl font-bold">Applicants for {jobTitle}</h1>

        <div className="mt-6">
          {applicants.length === 0 ? (
            <p className="text-gray-400">No applicants yet for this position.</p>
          ) : (
            <div className="space-y-4">
              {applicants.map(applicant => (
                <div key={applicant.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{applicant.full_name || applicant.username}</h2>
                    <p className="text-gray-400">{applicant.archetype || 'No archetype set'}</p>
                  </div>
                  <Link to={`/profile/${applicant.id}`} className="p-2 bg-blue-500 rounded-lg font-bold hover:bg-blue-400">
                    View Profile & Submission
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicants;