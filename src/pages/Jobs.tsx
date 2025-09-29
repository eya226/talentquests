import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../auth/AuthProvider';

interface JobData {
  id: string;
  company_name: string;
  title: string;
  salary: number;
  description: string;
}

const JobCard = ({ job, onApply, isApplied, isApplying }: { job: JobData, onApply: (jobId: string) => void, isApplied: boolean, isApplying: boolean }) => {
  return (
    <div className="w-full bg-gray-800 rounded-2xl shadow-lg border border-blue-700 p-6 text-center flex flex-col">
      <div className="mb-4">
        <span className="bg-green-500 text-black font-bold py-1 px-3 rounded-full text-sm">
          ✨ New Opportunity
        </span>
      </div>
      <h2 className="text-2xl font-bold">{job.company_name}</h2>
      <p className="text-lg text-gray-400">{job.title}</p>
      <p className="text-xl font-semibold text-green-400 mt-2">{job.salary} TND / month</p>
      <p className="mt-4 text-sm text-gray-300 h-20 overflow-y-auto flex-grow">{job.description}</p>

      <button
        onClick={() => onApply(job.id)}
        disabled={isApplied || isApplying}
        className="mt-6 w-full p-3 bg-blue-500 rounded-lg text-white font-bold hover:bg-blue-400 transition-all duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {isApplied ? 'Applied' : (isApplying ? 'Applying...' : '1-Tap Apply')}
      </button>
    </div>
  );
};

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  const fetchJobsAndApplications = useCallback(async () => {
    if (!user) return;
    try {
      // Fetch all jobs
      const { data: jobsData, error: jobsError } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (jobsError) throw jobsError;
      setJobs(jobsData || []);

      // Fetch all of this user's applications
      const { data: applicationsData, error: appsError } = await supabase.from('applications').select('job_id').eq('user_id', user.id);
      if (appsError) throw appsError;

      const appliedIds = new Set(applicationsData.map(app => app.job_id));
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
    setApplyingId(jobId);
    try {
      const { error } = await supabase.from('applications').insert({ user_id: user.id, job_id: jobId });
      if (error) throw error;

      alert("Application successful!");
      setAppliedJobIds(prev => new Set(prev).add(jobId));

    } catch (error: any) {
      if (error.code === '23505') {
        alert("You've already applied for this job!");
      } else {
        alert("Error submitting application: " + error.message);
      }
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center"><p>Loading Job Opportunities...</p></div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Job Board</h1>
        {jobs.length === 0 ? (
            <p className="text-center text-gray-400">No jobs available at the moment.</p>
        ) : (
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.map(job => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onApply={handleApply}
                        isApplied={appliedJobIds.has(job.id)}
                        isApplying={applyingId === job.id}
                    />
                ))}
            </div>
        )}
    </div>
  );
};

export default Jobs;