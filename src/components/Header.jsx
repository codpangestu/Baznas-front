export default function Header({ title, subtitle, primaryAction, secondaryAction }) {
  return (
    <header className="relative overflow-hidden bg-white pt-24 pb-32">
      {/* Decorative background blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 blur-[100px] rounded-full mix-blend-multiply"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-8">
          <span className="flex w-2 h-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
          Welcome to the Future
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
          {title || "Building the Next Generation"}
          <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Digital Experience
          </span>
        </h1>
        
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 mb-10">
          {subtitle || "A beautifully crafted template using React, Vite, and Tailwind CSS. Start building your next masterpiece today with unparalleled speed and modern aesthetics."}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-4 text-lg font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            {primaryAction || "Get Started Now"}
          </button>
          <button className="px-8 py-4 text-lg font-medium rounded-full text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all">
            {secondaryAction || "View Documentation"}
          </button>
        </div>
      </div>
    </header>
  );
}
