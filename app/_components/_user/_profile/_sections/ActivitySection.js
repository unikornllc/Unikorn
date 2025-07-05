import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import { Badge } from "@/app/_components/_ui/Badge";
import {
	Activity,
	TrendingUp,
	Users,
	MessageSquare,
	Award,
	Calendar,
	Eye,
	Heart,
	Briefcase,
	Star,
} from "lucide-react";

const ActivitySection = ({ user, editable }) => {
	// Mock activity data - in real app, this would come from API
	const activities = [
		{
			id: 1,
			type: "investment",
			title: "New Investment",
			description: "Invested $50,000 in TechStart AI",
			date: "2 hours ago",
			icon: TrendingUp,
			color: "text-green-600",
			bgColor: "bg-green-100",
		},
		{
			id: 2,
			type: "post",
			title: "Post Engagement",
			description: "Your post about AI trends received 42 likes and 8 comments",
			date: "5 hours ago",
			icon: Heart,
			color: "text-red-600",
			bgColor: "bg-red-100",
		},
		{
			id: 3,
			type: "connection",
			title: "New Connection",
			description: "Connected with Sarah Johnson, CEO at InnovateCorp",
			date: "1 day ago",
			icon: Users,
			color: "text-blue-600",
			bgColor: "bg-blue-100",
		},
		{
			id: 4,
			type: "profile",
			title: "Profile Update",
			description: "Added new work experience at TechCorp",
			date: "2 days ago",
			icon: Briefcase,
			color: "text-purple-600",
			bgColor: "bg-purple-100",
		},
		{
			id: 5,
			type: "achievement",
			title: "Achievement Unlocked",
			description: "Completed your professional profile",
			date: "3 days ago",
			icon: Award,
			color: "text-yellow-600",
			bgColor: "bg-yellow-100",
		},
		{
			id: 6,
			type: "view",
			title: "Profile Views",
			description: "Your profile was viewed 15 times this week",
			date: "1 week ago",
			icon: Eye,
			color: "text-indigo-600",
			bgColor: "bg-indigo-100",
		},
	];

	const stats = [
		{
			label: "Profile Views",
			value: "1,234",
			change: "+12%",
			icon: Eye,
			color: "text-blue-600",
		},
		{
			label: "Post Engagement",
			value: "89%",
			change: "+5%",
			icon: MessageSquare,
			color: "text-green-600",
		},
		{
			label: "Network Growth",
			value: "156",
			change: "+23%",
			icon: Users,
			color: "text-purple-600",
		},
		{
			label: "Investment Activity",
			value: "8",
			change: "+2",
			icon: TrendingUp,
			color: "text-orange-600",
		},
	];

	const getActivityTypeColor = (type) => {
		const colors = {
			investment: "border-l-green-500",
			post: "border-l-red-500",
			connection: "border-l-blue-500",
			profile: "border-l-purple-500",
			achievement: "border-l-yellow-500",
			view: "border-l-indigo-500",
		};
		return colors[type] || "border-l-gray-500";
	};

	return (
		<div className="space-y-6">
			{/* Activity Stats */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{stats.map((stat, index) => (
					<Card
						key={index}
						className="shadow-sm hover:shadow-md transition-shadow"
					>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600 mb-1">{stat.label}</p>
									<p className="text-2xl font-bold text-gray-900">
										{stat.value}
									</p>
									<p className="text-sm text-green-600 font-medium">
										{stat.change}
									</p>
								</div>
								<div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
									<stat.icon className="h-6 w-6" />
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Recent Activity */}
			<Card className="shadow-sm hover:shadow-md transition-shadow">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Activity className="h-5 w-5 text-blue-500" />
						Recent Activity
					</CardTitle>
				</CardHeader>
				<CardContent>
					{activities.length === 0 ? (
						<div className="text-center py-8">
							<Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No recent activity
							</h3>
							<p className="text-gray-500">
								{editable
									? "Start engaging to see your activity here"
									: "This user hasn't been active recently"}
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{activities.map((activity) => (
								<div
									key={activity.id}
									className={`flex items-start gap-4 p-4 border-l-4 ${getActivityTypeColor(
										activity.type,
									)} bg-gray-50 rounded-r-lg hover:bg-gray-100 transition-colors`}
								>
									<div className={`p-2 rounded-full ${activity.bgColor}`}>
										<activity.icon className={`h-5 w-5 ${activity.color}`} />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between mb-1">
											<h4 className="text-sm font-medium text-gray-900">
												{activity.title}
											</h4>
											<span className="text-xs text-gray-500 whitespace-nowrap ml-2">
												{activity.date}
											</span>
										</div>
										<p className="text-sm text-gray-600 leading-relaxed">
											{activity.description}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Activity Insights */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card className="shadow-sm hover:shadow-md transition-shadow">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="h-5 w-5 text-green-500" />
							This Week's Highlights
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
							<div className="w-2 h-2 bg-green-500 rounded-full"></div>
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-900">
									Most Active Day
								</p>
								<p className="text-xs text-gray-600">Tuesday - 8 activities</p>
							</div>
						</div>
						<div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
							<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-900">
									Top Engagement
								</p>
								<p className="text-xs text-gray-600">
									AI trends post - 42 likes
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
							<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-900">
									New Connections
								</p>
								<p className="text-xs text-gray-600">
									5 new professional connections
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="shadow-sm hover:shadow-md transition-shadow">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Star className="h-5 w-5 text-yellow-500" />
							Achievements
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
							<Award className="h-6 w-6 text-yellow-600" />
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-900">
									Profile Completionist
								</p>
								<p className="text-xs text-gray-600">
									Completed 100% of your profile
								</p>
							</div>
							<Badge className="bg-yellow-100 text-yellow-700">New</Badge>
						</div>
						<div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
							<TrendingUp className="h-6 w-6 text-green-600" />
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-900">
									Active Investor
								</p>
								<p className="text-xs text-gray-600">
									Made 5+ investments this quarter
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
							<Users className="h-6 w-6 text-blue-600" />
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-900">
									Network Builder
								</p>
								<p className="text-xs text-gray-600">
									Connected with 50+ professionals
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Activity Timeline */}
			<Card className="shadow-sm hover:shadow-md transition-shadow">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5 text-indigo-500" />
						Activity Timeline
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="relative">
						<div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
						<div className="space-y-6">
							{activities.slice(0, 5).map((activity, index) => (
								<div
									key={activity.id}
									className="relative flex items-start gap-4"
								>
									<div
										className={`relative z-10 p-2 rounded-full ${activity.bgColor} border-2 border-white`}
									>
										<activity.icon className={`h-4 w-4 ${activity.color}`} />
									</div>
									<div className="flex-1 min-w-0 pb-4">
										<div className="flex items-center justify-between mb-1">
											<h4 className="text-sm font-medium text-gray-900">
												{activity.title}
											</h4>
											<span className="text-xs text-gray-500">
												{activity.date}
											</span>
										</div>
										<p className="text-sm text-gray-600">
											{activity.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ActivitySection;
