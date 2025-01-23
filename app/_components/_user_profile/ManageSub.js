import axios from "axios";
import React, { useState } from "react";
import Modal from "react-modal";

const ManageSub = ({ tier }) => {
	const [showModal, setShowModal] = useState(false);
	const [result, setResult] = useState();

	const handleUpgrade = async () => {
		try {
			await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER}/updateTier`,
				{ tier: "Pro" },
				{
					withCredentials: true,
				},
			);
			setResult("Pro");
			window.location.reload();
		} catch (err) {
			console.error(err);
		}
	};

	const handleDowngrade = async () => {
		try {
			await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER}/updateTier`,
				{ tier: "Standard" },
				{
					withCredentials: true,
				},
			);
			setResult("Standard");
			window.location.reload();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="relative mb-6">
			<div>
				<button
					className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4"
					onClick={() => setShowModal(true)}
				>
					Manage Subscription
				</button>
				{showModal && (
					<Modal
						isOpen={showModal}
						onRequestClose={() => setShowModal(false)}
						contentLabel="Manage Subscription"
						className="z-50 flex items-center justify-center bg-white rounded-lg p-8 shadow-lg max-w-md mx-auto relative"
						overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
						ariaHideApp={false}
					>
						<button
							className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
							onClick={() => setShowModal(false)}
						>
							&times;
						</button>

						<div className="text-center">
							{result ? (
								<div className="text-center">
									<h2 className="text-xl font-semibold mb-4 text-green-600">
										Congratulations! You have successfully updated your
										subscription to the <strong>{result}</strong> plan.
									</h2>
								</div>
							) : (
								<div>
									<h2 className="text-xl font-semibold mb-4">
										Manage Your Subscription
									</h2>
									{tier === "Standard" ? (
										<div>
											<p className="mb-4">
												You are currently on the <strong>Standard</strong> plan.
												Upgrade to <strong>Pro</strong> to unlock premium
												features!
											</p>
											<button
												className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
												onClick={handleUpgrade}
											>
												Upgrade to Pro
											</button>
										</div>
									) : (
										<div>
											<p className="mb-4">
												You are currently on the <strong>Pro</strong> plan.
												Downgrade to <strong>Standard</strong> if you no longer
												need premium features, but you will miss out on advanced
												benefits.
											</p>
											<button
												className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
												onClick={handleDowngrade}
											>
												Downgrade to Standard
											</button>
										</div>
									)}
								</div>
							)}

							<button
								className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
								onClick={() => setShowModal(false)}
							>
								Close
							</button>
						</div>
					</Modal>
				)}
			</div>
		</div>
	);
};

export default ManageSub;
