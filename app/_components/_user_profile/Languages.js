import React from "react";

const Languages = ({ languages, userId }) => (
	<div className="bg-white p-6 rounded shadow-md mb-6">
		<h3 className="text-xl font-semibold mb-4">Languages</h3>
		<ul className="list-disc list-inside">
			{languages.map((lang) => (
				<li key={lang.id} className="text-gray-700">
					{lang.language} - {lang.proficiency}
				</li>
			))}
		</ul>
		<button className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
			Add Language
		</button>
	</div>
);

export default Languages;
