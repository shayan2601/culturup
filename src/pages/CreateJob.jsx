import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('entry');
  const [deadline, setDeadline] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch categories if needed
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://shoaibahmad.pythonanywhere.com/api/jobs/categories/', {
          headers: { Authorization: `Token ${token}` },
        });
        setCategories(res.data);
      } catch (err) {
        console.log('Failed to load categories.');
      }
    };

    fetchCategories();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
      setLoading(false);
      navigate('/jobs');
    } catch (err) {
      setError('Failed to create job. Please check all fields.');
      setLoading(false);
    }
  };

  return (
    <div className='mx-auto max-w-3xl p-4'>
      <h1 className='mb-6 text-2xl font-bold text-gray-800'>Create New Job</h1>
      {error && <div className='mb-4 text-red-500'>{error}</div>}
      <form className='grid gap-4' onSubmit={handleSubmit}>
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
          disabled={loading}
          className='rounded-lg bg-cyan-600 py-2 text-white transition-all hover:bg-cyan-700 disabled:opacity-50'
        >
          {loading ? 'Creating...' : 'Create Job'}
        </button>
      </form>
    </div>
  );
};

export default CreateJob;
