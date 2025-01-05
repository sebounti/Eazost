'use client';
import React, { useState } from 'react';
import Image from 'next/image';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('');

  return (
  <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 lg:flex-none xl:px-24">
	<div className="flex justify-center m-4">
	  <Image
		className="rounded-xl shadow-md justify-center border border-gray-300"
		src="/logo.png"
		alt="logo"
		width={150}
		height={150}
	  />
	</div>
    <form className='mt-4'>
      <div className="space-y-6 mt-6 mb-3">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 mb-3 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-green-700 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 mb-3 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-green-700 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 mb-3 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-green-700 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">Account type</label>
          <select
            id="accountType"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-green-700 sm:text-sm"
          >
            <option value="" disabled>Select an option</option>
            <option value="owner">Owner</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center">
          <input type="checkbox" id="remember_me" className="h-4 w-4 rounded-xl" />
          <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">Remember me</label>
        </div>
        <a href="#" className="text-sm font-medium ml-28 text-amber-600 hover:text-amber-400">Need help to sign in?</a>
      </div>

      <button type="submit" className="w-full py-3 mt-6 rounded-xl shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-500">
        Sign Up
      </button>
    </form>
</div>
  );
}
