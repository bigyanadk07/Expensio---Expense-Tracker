import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <div className='flex justify-center my-5'>

<div className="px-7 bg-white shadow-lg rounded-2xl">
  
      <div className="flex">
        <div className="flex-1 group">
          <Link
            to="/"
            className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500"
          >
            <span className="block px-1 pt-1 pb-1">
              <i className="far fa-home text-2xl pt-1 mb-1 block"></i>
              <span className="block text-xs pb-2">Home</span>
              <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
            </span>
          </Link>
        </div>

        <div className="flex-1 group">
          <Link
            to="/expense"
            className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500"
          >
            <span className="block px-1 pt-1 pb-1">
              <i className="far fa-compass text-2xl pt-1 mb-1 block"></i>
              <span className="block text-xs pb-2">Expense</span>
              <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
            </span>
          </Link>
        </div>

        <div className="flex-1 group">
          <Link
            to="/income"
            className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500"
          >
            <span className="block px-1 pt-1 pb-1">
              <i className="far fa-search text-2xl pt-1 mb-1 block"></i>
              <span className="block text-xs pb-2">Income</span>
              <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
            </span>
          </Link>
        </div>

        <div className="flex-1 group">
          <Link
            to="/budget"
            className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500"
          >
            <span className="block px-1 pt-1 pb-1">
              <i className="far fa-cog text-2xl pt-1 mb-1 block"></i>
              <span className="block text-xs pb-2">Budget</span>
              <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
            </span>
          </Link>
        </div>

        <div className="flex-1 group">
          <Link
            to="/report"
            className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500"
          >
            <span className="block px-1 pt-1 pb-1">
              <i className="far fa-file-alt text-2xl pt-1 mb-1 block"></i>
              <span className="block text-xs pb-2">Reports</span>
              <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
            </span>
          </Link>
        </div>
      </div>
    </div>



    </div>
  );
};

export default Navbar;
