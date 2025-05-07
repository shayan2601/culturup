import Navbar from '../components/Navbar';

const Signup = () => (
  <>
    <Navbar />
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded">
        <h2 className="text-2xl font-semibold text-center text-cyan-600 mb-6">Signup</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-3 border rounded" />
          <input type="email" placeholder="Email" className="w-full p-3 border rounded" />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded" />
          <button className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700">
            Signup
          </button>
        </form>
      </div>
    </div>
  </>
);

export default Signup;
