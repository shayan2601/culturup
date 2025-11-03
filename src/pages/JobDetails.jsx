import Navbar from '@components/Navbar';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Briefcase, Clock, DollarSign, Layers, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
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
      } catch {
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, token, navigate]);

  const handleApply = async () => {
    try {
      setApplying(true);
      const res = await axios.post(
        `https://shoaibahmad.pythonanywhere.com/api/jobs/${id}/hire_artist/`,
        { job_id: id },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setApplied(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading)
    return (
      <div className='flex h-screen items-center justify-center bg-gray-50 text-gray-500'>
        Loading job details...
      </div>
    );

  if (error)
    return <div className='flex h-screen items-center justify-center text-red-500'>{error}</div>;

  if (!job) return null;

  return (
    <div className='min-h-screen bg-gradient-to-b from-cyan-50 to-white'>
      <Navbar />

      <motion.div
        className='mx-auto max-w-4xl px-6 pt-28 pb-16'
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className='overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-100'>
          <div className='bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white'>
            <h1 className='text-2xl font-bold'>{job.title}</h1>
            <p className='mt-2 text-cyan-100'>{job.category?.name}</p>
          </div>

          <div className='space-y-6 p-6'>
            <p className='leading-relaxed text-gray-700'>{job.description}</p>

            <div className='grid gap-4 sm:grid-cols-2'>
              <InfoItem
                icon={<DollarSign className='text-cyan-600' />}
                label='Budget'
                value={`$${job.budget_min} - $${job.budget_max}`}
              />
              <InfoItem
                icon={<User className='text-cyan-600' />}
                label='Experience Level'
                value={job.experience_level}
              />
              <InfoItem
                icon={<Clock className='text-cyan-600' />}
                label='Duration'
                value={`${job.duration_days} days`}
              />
              <InfoItem
                icon={<Layers className='text-cyan-600' />}
                label='Required Skills'
                value={job.required_skills || 'N/A'}
              />
              <InfoItem
                icon={<Briefcase className='text-cyan-600' />}
                label='Status'
                value={job.status}
              />
              <InfoItem
                icon={<Clock className='text-cyan-600' />}
                label='Deadline'
                value={new Date(job.deadline).toLocaleDateString()}
              />
            </div>

            {!applied ? (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleApply}
                disabled={applying}
                className='mt-6 w-full rounded-xl bg-cyan-600 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-cyan-700 disabled:opacity-60'
              >
                {applying ? 'Applying...' : 'Apply for Job'}
              </motion.button>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className='mt-6 rounded-lg bg-green-100 p-4 text-center text-green-700'
              >
                ✅ You’ve successfully applied for this job!
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {applied && (
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className='w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl'
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className='mb-2 text-xl font-semibold text-cyan-700'>Application Successful!</h3>
              <p className='mb-6 text-gray-600'>
                You’ve successfully applied for <b>{job.title}</b>.
              </p>
              <button
                onClick={() => navigate(-1)}
                className='rounded-lg bg-cyan-600 px-5 py-2 text-white hover:bg-cyan-700'
              >
                Back to Jobs
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className='flex items-start gap-3 rounded-lg bg-gray-50 p-3'>
    <div className='mt-1'>{icon}</div>
    <div>
      <p className='text-sm font-medium text-gray-500'>{label}</p>
      <p className='font-semibold text-gray-800'>{value}</p>
    </div>
  </div>
);

export default JobDetails;
