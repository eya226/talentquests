import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import CreateJobForm from '../components/CreateJobForm';

interface Job {
  id: string;
  title: string;
  company_name: string;
}

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, company_name')
        .eq('recruiter_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data);
    } catch (error: any) {
      console.error("Error fetching jobs:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  if (loading) {
    return <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center"><p>Loading Dashboard...</p></div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-6">Your Job Listings</h1>
          {jobs.length === 0 ? (
            <p className="text-gray-400">You haven't posted any jobs yet.</p>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{job.title}</h2>
                    <p className="text-gray-400">{job.company_name}</p>
                  </div>
                  <Link to={`/jobs/${job.id}/applicants`} className="p-2 bg-blue-500 rounded-lg font-bold hover:bg-blue-400">
                    View Applicants
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <CreateJobForm onJobCreated={fetchJobs} />
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;