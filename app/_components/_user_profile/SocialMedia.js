import React from "react";


const SocialMedia = ({ links, userId }) => (
	<div className="bg-white p-6 rounded shadow-md mb-6">
		<h3 className="text-xl font-semibold mb-4">Social Media</h3>
		<div className="flex space-x-4">
			{links.map((link) => (
				<a
					key={link.id}
					href={link.url}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center space-x-2"
				>
					<img
						src={platformIcons[link.platform]}
						alt={link.platform}
						className="w-6 h-6"
					/>
					<span className="text-gray-700">{link.platform}</span>
				</a>
			))}
		</div>
		<button className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
			Add Social Media
		</button>
	</div>
);

export default SocialMedia;
