"use client";
import { Spinner } from "@/app/_components/_ui/spinner";

export default function CompanyInvestors() {
	const companyData = {};
	if (!companyData) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Spinner size="lg" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
			<div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center animate-fade-in">
				<div className="relative w-32 h-32 mx-auto mb-8">
					<div
						className="absolute w-16 h-16 bg-indigo-500 rounded-full top-8 left-8 animate-spin flex items-center justify-center"
						style={{ animationDuration: "10s" }}
					>
						<div className="w-6 h-6 bg-white rounded-full"></div>
					</div>
					<div
						className="absolute w-12 h-12 bg-purple-500 rounded-full top-2 right-5 flex items-center justify-center"
						style={{ animation: "spin 7s linear infinite reverse" }}
					>
						<div className="w-4 h-4 bg-white rounded-full"></div>
					</div>
					<div
						className="absolute w-8 h-8 bg-pink-500 rounded-full bottom-4 left-4 animate-spin flex items-center justify-center"
						style={{ animationDuration: "5s" }}
					>
						<div className="w-3 h-3 bg-white rounded-full"></div>
					</div>
				</div>

				<div className="space-y-4">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Under Development
					</h1>
					<p className="text-lg text-gray-600 mb-2">
						We're working hard to bring you detailed investor information.
					</p>
					<p className="text-base text-gray-500 mb-8">
						The Company Investors section is currently being built and will be
						available soon.
					</p>

					<div className="space-y-3">
						<button
							className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg text-base font-medium transition-colors duration-200"
							onClick={() => window.history.back()}
						>
							Go Back
						</button>
					</div>
				</div>

				<div className="mt-12 pt-8 border-t border-gray-200">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Coming Soon
					</h3>
				</div>
			</div>

			<style jsx>{`
				@keyframes fade-in {
					from {
						opacity: 0;
						transform: translateY(-20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fade-in {
					animation: fade-in 1s ease;
				}
			`}</style>
		</div>
	);
}
