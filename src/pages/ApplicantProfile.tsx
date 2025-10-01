import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ApplicantProfile = () => {
  const { applicantId } = useParams<{ applicantId: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!applicantId) return;
      try {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', applicantId).single();
        setProfile(profileData);

        const { data: submissionsData } = await supabase.from('quest_submissions').select('id, submitted_code, quest:quests(title)').eq('user_id', applicantId);
        setSubmissions(submissionsData || []);
      } catch (error: any) {
        console.error("Error fetching applicant data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [applicantId]);

  if (loading) return <div>Loading Applicant Profile...</div>;
  if (!profile) return <div>Applicant not found.</div>;

  return (
    <div>
      <Link to="/recruiter-dashboard">&larr; Back to Dashboard</Link>
      <h1>Applicant Profile</h1>
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

      <h3>Quest Submissions</h3>
      <ul>
        {submissions.map(sub => (
          <li key={sub.id}>
            <h4>{sub.quest.title}</h4>
            <pre>{sub.submitted_code}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicantProfile;