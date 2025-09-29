import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const CreateJobForm = ({ onJobCreated }: { onJobCreated: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [title, setTitle] = useState('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to create a job.");

      const newJob = {
        recruiter_id: user.id,
        company_name: companyName,
        title,
        salary: parseInt(salary, 10),
        description,
      };

      const { error } = await supabase.from('jobs').insert(newJob);
      if (error) throw error;

      alert('Job created successfully!');
      onJobCreated(); // Callback to refresh the job list
      // Clear form
      setCompanyName('');
      setTitle('');
      setSalary('');
      setDescription('');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Create New Job Listing</h2>
      <form onSubmit={handleCreateJob}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Salary (TND)"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-purple-600 rounded-lg font-bold hover:bg-purple-700 transition-colors"
        >
          {loading ? 'Creating...' : 'Create Job'}
        </button>
      </form>
    </div>
  );
};

export default CreateJobForm;