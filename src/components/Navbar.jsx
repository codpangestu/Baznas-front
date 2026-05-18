import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              B
            </div>
            <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              BZN Portal
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Home</Link>
            <Link to="/about" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">About</Link>
            <Link to="/services" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Services</Link>
            <Link to="/contact" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Contact</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="hidden md:block px-4 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-full transition-colors">
              Log in
            </button>
            <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
              Sign up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
