import React from "react";

const Interests = ({ interests, userId }) => (
	<div className="bg-white p-6 rounded shadow-md mb-6">
		<h3 className="text-xl font-semibold mb-4">Interests</h3>
		<ul className="list-disc list-inside">
			{interests.map((interest) => (
				<li key={interest.id} className="text-gray-700">
					{interest.name}
				</li>
			))}
		</ul>
		<button className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
			Add Interest
		</button>
	</div>
);

export default Interests;
