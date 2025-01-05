'use client';

import { useState } from "react";

export default function Card_template() {
	const [template, setTemplate] = useState('Default Template');

	return (
	  <div className="p-4 bg-white rounded-xl shadow-lg">
		{/* Product Template Section */}
		<h2 className="text-lg font-semibold mb-2">Product Template</h2>

		<p className="text-gray-600 mb-4">Select a product template</p>

		{/* Dropdown */}
		<select
		  value={template}
		  onChange={(e) => setTemplate(e.target.value)}
		  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-amber-500"
		>
		  <option value="Default Template">Default Template</option>
		  <option value="Custom Template 1">Custom Template 1</option>
		  <option value="Custom Template 2">Custom Template 2</option>
		</select>

		<p className="text-gray-500 mt-2">
		  Assign a template from your current theme to define how a single product is displayed.
		</p>
	  </div>
	);
  }
