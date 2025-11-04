import Modal from '@components/Modal';
import Navbar from '@components/Navbar';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JobsScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    experience_level: '',
    min_budget: '',
    max_budget: '',
    ordering: '-created_at',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create Job form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('entry');
  const [deadline, setDeadline] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [viewMode, setViewMode] = useState('my'); // my | all
  const userData = JSON.parse(localStorage.getItem('userData'));

  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://shoaibahmad.pythonanywhere.com/api/categories/', {
          headers: { Authorization: `Token ${token}` },
        });
        setCategories(res.data);
      } catch (err) {
        console.log('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, [token, navigate]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = { ...filters };
      const res = await axios.get('https://shoaibahmad.pythonanywhere.com/api/jobs/', {
        headers: { Authorization: `Token ${token}` },
        params,
      });
      // setJobs(res.data.results);

      const results = res.data.results;
      console.log('Fetched RESUL: ', results);
      console.log('Fetched Jobs: ', userData);
      if (viewMode === 'my' && userData?.id) {
        const myJobs = results.filter(job => job?.buyer_name == userData.username);
        setJobs(myJobs);
      } else {
        setJobs(results);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load jobs.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    setFormError('');

    try {
      await axios.post(
        'https://shoaibahmad.pythonanywhere.com/api/jobs/',
        {
          title,
          description,
          category_id: categoryId,
          budget_min: budgetMin,
          budget_max: budgetMax,
          duration_days: durationDays,
          required_skills: requiredSkills,
          experience_level: experienceLevel,
          deadline,
        },
        { headers: { Authorization: `Token ${token}` } }
      );
      setLoadingForm(false);
      setIsModalOpen(false);
      fetchJobs(); // Refresh jobs list
      // Reset form
      setTitle('');
      setDescription('');
      setCategoryId('');
      setBudgetMin('');
      setBudgetMax('');
      setDurationDays('');
      setRequiredSkills('');
      setExperienceLevel('entry');
      setDeadline('');
    } catch (err) {
      setFormError('Failed to create job. Check all fields.');
      setLoadingForm(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [viewMode]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Navbar />
      <div className='mx-auto max-w-7xl p-6'>
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <h1 className='text-3xl font-bold text-gray-800'>Available Jobs</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className='rounded-lg bg-cyan-600 px-5 py-2 text-lg font-semibold text-white shadow-md transition-all hover:bg-cyan-700'
          >
            + Create Job
          </button>
        </div>

        {/* My Jobs / All Jobs Toggle */}
        <div className="mb-4 flex gap-3">
          <button
            className={`px-4 py-2 rounded-lg font-medium border ${
              viewMode === 'my'
                ? 'bg-cyan-600 text-white border-cyan-600'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
            onClick={() => setViewMode('my')}
          >
            My Jobs
          </button>

          <button
            className={`px-4 py-2 rounded-lg font-medium border ${
              viewMode === 'all'
                ? 'bg-cyan-600 text-white border-cyan-600'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
            onClick={() => setViewMode('all')}
          >
            All Jobs
          </button>
        </div>


        {/* Filters */}
        <div className='mb-6 grid gap-4 rounded-lg bg-white p-4 shadow-sm sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          <input
            type='text'
            name='search'
            placeholder='Search jobs...'
            value={filters.search}
            onChange={handleChange}
            className='rounded-lg border border-gray-300 p-2 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:outline-none'
          />
          <select
            name='status'
            value={filters.status}
            onChange={handleChange}
            className='rounded-lg border border-gray-300 p-2 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:outline-none'
          >
            <option value=''>All Statuses</option>
            <option value='open'>Open</option>
            <option value='in_progress'>In Progress</option>
            <option value='completed'>Completed</option>
            <option value='cancelled'>Cancelled</option>
          </select>
          <select
            name='category'
            value={filters.category}
            onChange={handleChange}
            className='rounded-lg border border-gray-300 p-2 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:outline-none'
          >
            <option value=''>All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            name='experience_level'
            value={filters.experience_level}
            onChange={handleChange}
            className='rounded-lg border border-gray-300 p-2 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:outline-none'
          >
            <option value=''>All Levels</option>
            <option value='entry'>Entry</option>
            <option value='intermediate'>Intermediate</option>
            <option value='expert'>Expert</option>
          </select>
          <input
            type='number'
            name='min_budget'
            placeholder='Min Budget'
            value={filters.min_budget}
            onChange={handleChange}
            className='rounded-lg border border-gray-300 p-2 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:outline-none'
          />
          <input
            type='number'
            name='max_budget'
            placeholder='Max Budget'
            value={filters.max_budget}
            onChange={handleChange}
            className='rounded-lg border border-gray-300 p-2 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:outline-none'
          />
        </div>

        {/* Jobs Grid */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {jobs.map((job) => (
            <div
              key={job.id}
              className='relative rounded-xl border border-gray-200 bg-white p-5 shadow-md transition-shadow duration-300 hover:shadow-xl'
            >
              <div className='mb-2 flex items-center justify-between'>
                <h2 className='text-xl font-semibold text-gray-800'>{job.title}</h2>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                    job.status
                  )}`}
                >
                  {job.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className='mb-3 line-clamp-3 text-gray-600'>{job.description}</p>
              <div className='mb-3 flex flex-wrap gap-2'>
                <span className='rounded-full bg-cyan-100 px-2 py-1 text-xs font-medium text-cyan-800'>
                  {job?.category?.name}
                </span>
                <span className='rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800'>
                  {job.experience_level.toUpperCase()}
                </span>
              </div>
              <div className='mb-3 flex items-center justify-between text-sm text-gray-500'>
                <span>
                  Budget: ${job.budget_min} - ${job.budget_max}
                </span>
                <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
              </div>
              <div className='mb-3 flex items-center justify-between text-xs text-gray-400'>
                <span>Total Bids: {job.total_bids}</span>
              </div>
              <button
                onClick={() => navigate(`/jobs/${job.id}`)}
                className='mt-2 w-full rounded-lg bg-cyan-600 py-2 font-medium text-white transition-all hover:bg-cyan-700'
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create Job Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className='mb-4 text-2xl font-bold text-gray-800'>Create New Job</h2>
        {formError && <div className='mb-4 text-red-500'>{formError}</div>}
        <form className='grid gap-4' onSubmit={handleCreateJob}>
          <input
            type='text'
            placeholder='Job Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='rounded-lg border border-gray-300 p-2 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:outline-none'
            required
          />
          <textarea
            placeholder='Job Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='rounded-lg border border-gray-300 p-2 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:outline-none'
            required
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className='rounded-lg border border-gray-300 p-2 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:outline-none'
            required
          >
            <option value=''>Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className='grid grid-cols-2 gap-2'>
            <input
              type='number'
              placeholder='Min Budget'
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              className='rounded-lg border border-gray-300 p-2 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:outline-none'
              required
            />
            <input
              type='number'
              placeholder='Max Budget'
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              className='rounded-lg border border-gray-300 p-2 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:outline-none'
              required
            />
          </div>
          <input
            type='number'
            placeholder='Duration (days)'
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            className='rounded-lg border border-gray-300 p-2 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:outline-none'
            required
          />
          <input
            type='text'
            placeholder='Required Skills (comma separated)'
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            className='rounded-lg border border-gray-300 p-2 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:outline-none'
          />
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className='rounded-lg border border-gray-300 p-2 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:outline-none'
            required
          >
            <option value='entry'>Entry</option>
            <option value='intermediate'>Intermediate</option>
            <option value='expert'>Expert</option>
          </select>
          <input
            type='date'
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className='rounded-lg border border-gray-300 p-2 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:outline-none'
            required
          />
          <button
            type='submit'
            disabled={loadingForm}
            className='rounded-lg bg-cyan-600 py-2 font-medium text-white transition-all hover:bg-cyan-700 disabled:opacity-50'
          >
            {loadingForm ? 'Creating...' : 'Create Job'}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default JobsScreen;
