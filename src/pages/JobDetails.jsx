import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchJob = async () => {
      try {
        const res = await axios.get(`https://shoaibahmad.pythonanywhere.com/api/jobs/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setJob(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load job details.');
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, token, navigate]);

  if (loading) return <div className='p-8 text-center'>Loading job details...</div>;
  if (error) return <div className='p-8 text-center text-red-500'>{error}</div>;
  if (!job) return null;

  return (
    <div className='mx-auto max-w-3xl p-4'>
      <button
        onClick={() => navigate(-1)}
        className='mb-4 flex items-center gap-1 text-cyan-600 hover:underline'
      >
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className='mb-2 text-2xl font-bold text-gray-800'>{job.title}</h1>
      <p className='mb-4 text-gray-600'>{job.description}</p>

      <div className='mb-4 grid gap-2 sm:grid-cols-2'>
        <div>
          <span className='font-semibold text-gray-700'>Category:</span> {job.category.name}
        </div>
        <div>
          <span className='font-semibold text-gray-700'>Budget:</span> ${job.budget_min} - ${job.budget_max}
        </div>
        <div>
          <span className='font-semibold text-gray-700'>Experience Level:</span> {job.experience_level}
        </div>
        <div>
          <span className='font-semibold text-gray-700'>Duration:</span> {job.duration_days} days
        </div>
        <div className='sm:col-span-2'>
          <span className='font-semibold text-gray-700'>Required Skills:</span> {job.required_skills || 'N/A'}
        </div>
        <div>
          <span className='font-semibold text-gray-700'>Status:</span> {job.status}
        </div>
        <div>
          <span className='font-semibold text-gray-700'>Deadline:</span> {new Date(job.deadline).toLocaleDateString()}
        </div>
      </div>

      <button
        onClick={() => alert('Apply functionality can be added!')}
        className='rounded-lg bg-cyan-600 py-2 px-4 text-white transition-all hover:bg-cyan-700'
      >
        Apply for Job
      </button>
    </div>
  );
};

export default JobDetails;
