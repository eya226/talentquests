import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface Profile {
  id: string;
  full_name: string | null;
  username: string;
  archetype: string | null;
  skills: any;
  values: string[];
}

interface Submission {
  id: string;
  submitted_code: string;
  quest: {
    title: string;
  };
}

const ApplicantProfile = () => {
  const { applicantId } = useParams<{ applicantId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!applicantId) return;
      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', applicantId)
          .single();
        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch submissions with quest titles
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('quest_submissions')
          .select(`
            id,
            submitted_code,
            quest:quests(title)
          `)
          .eq('user_id', applicantId);
        if (submissionsError) throw submissionsError;
        setSubmissions(submissionsData as Submission[]);

      } catch (error: any) {
        console.error("Error fetching applicant data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [applicantId]);

  if (loading) {
    return <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center"><p>Loading Applicant Profile...</p></div>;
  }

  if (!profile) {
    return <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center"><p>Applicant not found.</p></div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/recruiter-dashboard" className="text-blue-400 hover:underline mb-6 inline-block">&larr; Back to Dashboard</Link>

        <div className="bg-gray-800 p-6 rounded-lg">
            <h1 className="text-3xl font-bold">{profile.full_name || profile.username}</h1>
            <p className="text-purple-300 text-xl">{profile.archetype}</p>

            <div className="mt-6">
                <h2 className="text-2xl font-semibold">Skills</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                    {profile.skills && Object.entries(profile.skills).map(([skill, score]) => (
                        <span key={skill} className="bg-blue-500 px-3 py-1 rounded-full">{skill}: {score as number}%</span>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <h2 className="text-2xl font-semibold">Values</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                    {profile.values?.map(value => (
                        <span key={value} className="bg-green-500 px-3 py-1 rounded-full">{value}</span>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <h2 className="text-2xl font-semibold">Quest Submissions</h2>
                <div className="space-y-2 mt-2">
                    {submissions.map(sub => (
                        <div key={sub.id} className="bg-gray-700 p-3 rounded-md flex justify-between items-center">
                            <span>{sub.quest.title}</span>
                            <button onClick={() => setSelectedSubmission(sub)} className="text-blue-400 hover:underline">View Code</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center" onClick={() => setSelectedSubmission(null)}>
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Submission for: {selectedSubmission.quest.title}</h2>
            <pre className="bg-black p-4 rounded-md text-cyan-300 whitespace-pre-wrap">{selectedSubmission.submitted_code}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantProfile;