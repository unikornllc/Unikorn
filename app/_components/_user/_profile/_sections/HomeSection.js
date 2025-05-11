import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import { Badge } from "@/app/_components/_ui/Badge";
import {
	Briefcase,
	GraduationCap,
	Award,
	Users,
	Building,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";

const HomeSection = ({ user, investments = [], editable }) => {
	const topInvestments = investments.slice(0, 3);

	const topExpertise = user.expertise?.slice(0, 3) || [];

	const latestEducation = user.education?.[0] || null;

	const latestExperience =
		user.corporateExperience?.[0] || user.startupExperience?.[0] || null;

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div className="md:col-span-2 space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Professional Overview</CardTitle>
						<CardDescription>
							A summary of {user.name}'s professional background
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-start gap-3">
							<Award className="h-5 w-5 text-blue-500 mt-1" />
							<div>
								<h3 className="font-medium">Areas of Expertise</h3>
								<div className="flex flex-wrap gap-2 mt-2">
									{topExpertise.length > 0 ? (
										topExpertise.map((expertise, index) => (
											<Badge key={index} variant="secondary">
												{expertise.field}
											</Badge>
										))
									) : (
										<p className="text-gray-500 text-sm">No expertise listed</p>
									)}
									{user.expertise?.length > 3 && (
										<Badge variant="outline">
											+{user.expertise.length - 3} more
										</Badge>
									)}
								</div>
							</div>
						</div>

						{latestExperience && (
							<div className="flex items-start gap-3">
								<Briefcase className="h-5 w-5 text-blue-500 mt-1" />
								<div>
									<h3 className="font-medium">Latest Experience</h3>
									<p className="text-gray-700">
										{latestExperience.jobTitle || latestExperience.role} at{" "}
										<span className="font-medium">
											{latestExperience.companyName ||
												latestExperience.startupName}
										</span>
									</p>
									<p className="text-gray-500 text-sm">
										{new Date(latestExperience.startDate).getFullYear()} -{" "}
										{latestExperience.endDate
											? new Date(latestExperience.endDate).getFullYear()
											: "Present"}
									</p>
								</div>
							</div>
						)}

						{latestEducation && (
							<div className="flex items-start gap-3">
								<GraduationCap className="h-5 w-5 text-blue-500 mt-1" />
								<div>
									<h3 className="font-medium">Education</h3>
									<p className="text-gray-700">
										{latestEducation.degree} from{" "}
										<span className="font-medium">
											{latestEducation.institution}
										</span>
									</p>
								</div>
							</div>
						)}

						<div className="flex items-start gap-3">
							<Users className="h-5 w-5 text-blue-500 mt-1" />
							<div>
								<h3 className="font-medium">Network</h3>
								<p className="text-gray-700">
									Connected with 128 professionals
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="border-l-2 border-gray-200 pl-4 space-y-6">
							<div className="relative">
								<div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-blue-500"></div>
								<p className="text-gray-500 text-sm">2 days ago</p>
								<p className="text-gray-700">
									<span className="font-medium">{user.name}</span> added a new
									certification in Blockchain Development
								</p>
							</div>
							<div className="relative">
								<div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-blue-500"></div>
								<p className="text-gray-500 text-sm">1 week ago</p>
								<p className="text-gray-700">
									<span className="font-medium">{user.name}</span> invested in a
									new startup
								</p>
							</div>
							<div className="relative">
								<div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-blue-500"></div>
								<p className="text-gray-500 text-sm">2 weeks ago</p>
								<p className="text-gray-700">
									<span className="font-medium">{user.name}</span> updated their
									professional experience
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="md:col-span-1 space-y-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5" />
							Investments
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{topInvestments.length > 0 ? (
							topInvestments.map((investment, index) => (
								<div
									key={index}
									className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
								>
									<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
										<Building className="h-5 w-5 text-blue-600" />
									</div>
									<div>
										<p className="font-medium">Company {index + 1}</p>
										<p className="text-sm text-gray-500">
											{investment.equityPercentage}% equity • $
											{investment.fundingAmount}
										</p>
									</div>
								</div>
							))
						) : (
							<p className="text-gray-500 text-center py-4">
								No investments yet
							</p>
						)}
						{investments.length > 3 && (
							<Link
								href="#"
								className="block text-center text-sm text-blue-600 hover:text-blue-800 hover:underline mt-2"
							>
								View all {investments.length} investments
							</Link>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recommendations</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="p-3 bg-gray-50 rounded-lg">
								<p className="italic text-gray-700">
									"{user.name} is an exceptional professional with deep industry
									knowledge."
								</p>
								<p className="text-sm text-gray-500 mt-2">
									- Jane Smith, CEO at TechCorp
								</p>
							</div>
							<div className="p-3 bg-gray-50 rounded-lg">
								<p className="italic text-gray-700">
									"Working with {user.name} was a game-changer for our startup."
								</p>
								<p className="text-sm text-gray-500 mt-2">
									- John Doe, Founder at InnovateCo
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default HomeSection;
