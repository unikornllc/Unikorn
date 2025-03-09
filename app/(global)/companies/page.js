"use client";

import React from "react";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import { FundingCard } from "@/app/_components/_company/_funding/FundingCard";
import { Input } from "@/app/_components/_ui/Input";
import { Label } from "@/app/_components/_ui/Label";
import { Slider } from "@/app/_components/_ui/Slider";
import { Button } from "@/app/_components/_ui/Button";
import { Badge } from "@/app/_components/_ui/Badge";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/_ui/Select";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import {
	Loader2,
	Search,
	X,
	TrendingUp,
	Briefcase,
	DollarSign,
	PieChart,
	Filter,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

import { useToast } from "@/app/_components/_hooks/useToast";
import { formatCurrency } from "@/app/_utils/utils";
import { useDebounce } from "@/app/_components/_hooks/useDebounce";

export default function FundraisingPage() {
	const [fundraisings, setFundraisings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showFilters, setShowFilters] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeView, setActiveView] = useState("grid");
	const [sortOption, setSortOption] = useState("newest");
	const [filters, setFilters] = useState({
		minPrice: 0,
		maxPrice: 1000000,
		minEquity: 0,
		maxEquity: 100,
		minPortions: 0,
		industry: "all",
	});
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 6,
		totalPages: 1,
		totalCount: 0,
	});
	const [industries, setIndustries] = useState(["all"]);
	const [stats, setStats] = useState({
		totalOpportunities: 0,
		totalFunding: 0,
		averageEquity: 0,
		activeIndustries: 0,
	});

	const router = useRouter();
	const { toast } = useToast();

	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const debouncedFilters = useDebounce(filters, 500);

	const getSortParams = useCallback(() => {
		switch (sortOption) {
			case "newest":
				return { sortBy: "date", sortOrder: "desc" };
			case "oldest":
				return { sortBy: "date", sortOrder: "asc" };
			case "priceAsc":
				return { sortBy: "price", sortOrder: "asc" };
			case "priceDesc":
				return { sortBy: "price", sortOrder: "desc" };
			case "equityAsc":
				return { sortBy: "equity", sortOrder: "asc" };
			case "equityDesc":
				return { sortBy: "equity", sortOrder: "desc" };
			case "progressAsc":
				return { sortBy: "progress", sortOrder: "asc" };
			case "progressDesc":
				return { sortBy: "progress", sortOrder: "desc" };
			default:
				return { sortBy: "date", sortOrder: "desc" };
		}
	}, [sortOption]);

	const fetchFundraisings = useCallback(async () => {
		try {
			setIsLoading(true);

			const { sortBy, sortOrder } = getSortParams();

			const params = new URLSearchParams({
				page: pagination.page.toString(),
				limit: pagination.limit.toString(),
				sortBy,
				sortOrder,
				...(debouncedSearchTerm && { searchTerm: debouncedSearchTerm }),
				...(debouncedFilters.minPrice > 0 && {
					minPrice: debouncedFilters.minPrice.toString(),
				}),
				...(debouncedFilters.maxPrice < 1000000 && {
					maxPrice: debouncedFilters.maxPrice.toString(),
				}),
				...(debouncedFilters.minEquity > 0 && {
					minEquity: debouncedFilters.minEquity.toString(),
				}),
				...(debouncedFilters.maxEquity < 100 && {
					maxEquity: debouncedFilters.maxEquity.toString(),
				}),
				...(debouncedFilters.minPortions > 0 && {
					minPortions: debouncedFilters.minPortions.toString(),
				}),
				...(debouncedFilters.industry !== "all" && {
					industry: debouncedFilters.industry,
				}),
			});

			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/api/raisingFunds/active?${params.toString()}`,
				{ withCredentials: true },
			);

			setFundraisings(response.data.fundraisings || []);
			setPagination({
				...pagination,
				totalPages: response.data.totalPages || 1,
				totalCount: response.data.totalCount || 0,
			});

			if (response.data.message && response.data.fundraisings.length === 0) {
				toast({
					title: "No results",
					description: response.data.message,
				});
			}

			if (
				pagination.page === 1 &&
				!debouncedSearchTerm &&
				debouncedFilters.minPrice === 0 &&
				debouncedFilters.maxPrice === 1000000 &&
				debouncedFilters.minEquity === 0 &&
				debouncedFilters.maxEquity === 100 &&
				debouncedFilters.minPortions === 0 &&
				debouncedFilters.industry === "all"
			) {
				fetchStats();
			}

			if (response.data.fundraisings && response.data.fundraisings.length > 0) {
				const uniqueIndustries = [
					"all",
					...new Set(
						response.data.fundraisings.map((item) => item.company.industry),
					),
				];
				setIndustries(uniqueIndustries);
			}
		} catch (error) {
			console.error("Error fetching fundraisings:", error);
			toast({
				title: "Error",
				description: "Failed to load investment opportunities",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}, [debouncedSearchTerm, debouncedFilters, getSortParams, pagination.page]);

	const fetchStats = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/api/raisingFunds/stats`,
				{ withCredentials: true },
			);
			setStats({
				totalOpportunities: response.data.totalCount || 0,
				totalFunding: response.data.totalFunding || 0,
				averageEquity: response.data.averageEquity || 0,
				activeIndustries: response.data.uniqueIndustries || 0,
			});
		} catch (error) {
			console.error("Error fetching stats:", error);
		}
	};

	useEffect(() => {
		console.log("here1");
		fetchFundraisings();
	}, [fetchFundraisings]);

	useEffect(() => {
		setPagination((prev) => ({ ...prev, page: 1 }));
	}, [debouncedSearchTerm, debouncedFilters]);

	const resetFilters = () => {
		setFilters({
			minPrice: 0,
			maxPrice: 1000000,
			minEquity: 0,
			maxEquity: 100,
			minPortions: 0,
			industry: "all",
		});
		setSearchTerm("");
		setPagination((prev) => ({ ...prev, page: 1 }));
	};

	const handlePageChange = (newPage) => {
		setPagination((prev) => ({ ...prev, page: newPage }));
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-background/80">
			<section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background pt-16 pb-24 overflow-hidden">
				<div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,white)]"></div>
				<div className="container mx-auto px-4 relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="text-center max-w-3xl mx-auto mb-12"
					>
						<h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
							Discover Investment Opportunities
						</h1>
						<p className="text-lg text-muted-foreground mb-8">
							Find promising companies raising funds and invest in their growth
							journey
						</p>

						<div className="relative max-w-2xl mx-auto">
							<Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
							<Input
								placeholder="Search by company name, industry, or keywords..."
								className="pl-10 h-12 text-base"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							{searchTerm && (
								<button
									className="absolute right-3 top-3"
									onClick={() => setSearchTerm("")}
								>
									<X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
								</button>
							)}
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
					>
						<Card className="bg-background/60 backdrop-blur-sm border-primary/20">
							<CardContent className="p-6 flex items-center">
								<div className="mr-4 bg-primary/10 p-3 rounded-full">
									<Briefcase className="h-6 w-6 text-primary" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Opportunities</p>
									<h3 className="text-2xl font-bold">
										{stats.totalOpportunities}
									</h3>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-background/60 backdrop-blur-sm border-primary/20">
							<CardContent className="p-6 flex items-center">
								<div className="mr-4 bg-primary/10 p-3 rounded-full">
									<DollarSign className="h-6 w-6 text-primary" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Total Funding</p>
									<h3 className="text-2xl font-bold">
										{formatCurrency(stats.totalFunding)}
									</h3>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-background/60 backdrop-blur-sm border-primary/20">
							<CardContent className="p-6 flex items-center">
								<div className="mr-4 bg-primary/10 p-3 rounded-full">
									<PieChart className="h-6 w-6 text-primary" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Avg. Equity</p>
									<h3 className="text-2xl font-bold">
										{stats.averageEquity.toFixed(2)}%
									</h3>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-background/60 backdrop-blur-sm border-primary/20">
							<CardContent className="p-6 flex items-center">
								<div className="mr-4 bg-primary/10 p-3 rounded-full">
									<TrendingUp className="h-6 w-6 text-primary" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Industries</p>
									<h3 className="text-2xl font-bold">
										{stats.activeIndustries}
									</h3>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</section>

			<section className="py-16">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
					>
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
							<div>
								<h2 className="text-3xl font-bold">All Opportunities</h2>
								<p className="text-muted-foreground">
									Browse all available investment opportunities
								</p>
							</div>

							<div className="flex flex-wrap items-center gap-3">
								<div className="flex items-center space-x-2">
									<Button
										variant={activeView === "grid" ? "default" : "outline"}
										size="sm"
										className="h-9 w-9 p-0"
										onClick={() => setActiveView("grid")}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<rect width="7" height="7" x="3" y="3" rx="1" />
											<rect width="7" height="7" x="14" y="3" rx="1" />
											<rect width="7" height="7" x="3" y="14" rx="1" />
											<rect width="7" height="7" x="14" y="14" rx="1" />
										</svg>
									</Button>
									<Button
										variant={activeView === "list" ? "default" : "outline"}
										size="sm"
										className="h-9 w-9 p-0"
										onClick={() => setActiveView("list")}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<line x1="3" x2="21" y1="6" y2="6" />
											<line x1="3" x2="21" y1="12" y2="12" />
											<line x1="3" x2="21" y1="18" y2="18" />
										</svg>
									</Button>
								</div>

								<Select value={sortOption} onValueChange={setSortOption}>
									<SelectTrigger className="w-[180px] h-9">
										<SelectValue placeholder="Sort by" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="newest">Newest First</SelectItem>
										<SelectItem value="oldest">Oldest First</SelectItem>
										<SelectItem value="priceAsc">Price: Low to High</SelectItem>
										<SelectItem value="priceDesc">
											Price: High to Low
										</SelectItem>
										<SelectItem value="equityAsc">
											Equity: Low to High
										</SelectItem>
										<SelectItem value="equityDesc">
											Equity: High to Low
										</SelectItem>
										<SelectItem value="progressAsc">
											Progress: Low to High
										</SelectItem>
										<SelectItem value="progressDesc">
											Progress: High to Low
										</SelectItem>
									</SelectContent>
								</Select>

								<Button
									variant={showFilters ? "default" : "outline"}
									size="sm"
									className="h-9"
									onClick={() => setShowFilters(!showFilters)}
								>
									<Filter className="h-4 w-4 mr-2" />
									{showFilters ? "Hide Filters" : "Show Filters"}
								</Button>
							</div>
						</div>

						<AnimatePresence>
							{showFilters && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.3 }}
									className="overflow-hidden"
								>
									<Card className="mb-8 border-primary/20">
										<CardHeader className="pb-3">
											<div className="flex justify-between items-center">
												<CardTitle>Advanced Filters</CardTitle>
												<Button
													variant="ghost"
													size="sm"
													onClick={resetFilters}
												>
													Reset All
												</Button>
											</div>
											<CardDescription>
												Refine investment opportunities based on your criteria
											</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
												<div className="space-y-2">
													<Label>Price per portion</Label>
													<div className="flex justify-between text-sm">
														<span>{formatCurrency(filters.minPrice)}</span>
														<span>{formatCurrency(filters.maxPrice)}</span>
													</div>
													<Slider
														defaultValue={[filters.minPrice, filters.maxPrice]}
														max={1000000}
														step={1000}
														onValueChange={(value) => {
															setFilters({
																...filters,
																minPrice: value[0],
																maxPrice: value[1],
															});
														}}
													/>
												</div>

												<div className="space-y-2">
													<Label>Equity per portion (%)</Label>
													<div className="flex justify-between text-sm">
														<span>{filters.minEquity}%</span>
														<span>{filters.maxEquity}%</span>
													</div>
													<Slider
														defaultValue={[
															filters.minEquity,
															filters.maxEquity,
														]}
														max={100}
														step={1}
														onValueChange={(value) => {
															setFilters({
																...filters,
																minEquity: value[0],
																maxEquity: value[1],
															});
														}}
													/>
												</div>

												<div className="space-y-2">
													<Label>Minimum available portions</Label>
													<Input
														type="number"
														min={0}
														value={filters.minPortions}
														onChange={(e) => {
															const value = Number.parseInt(e.target.value);
															setFilters({
																...filters,
																minPortions: isNaN(value) ? 0 : value,
															});
														}}
													/>
												</div>

												<div className="space-y-2">
													<Label>Industry</Label>
													<Select
														value={filters.industry}
														onValueChange={(value) => {
															setFilters({
																...filters,
																industry: value,
															});
														}}
													>
														<SelectTrigger>
															<SelectValue placeholder="Select industry" />
														</SelectTrigger>
														<SelectContent>
															{industries.map((industry) => (
																<SelectItem key={industry} value={industry}>
																	{industry === "all"
																		? "All Industries"
																		: industry}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							)}
						</AnimatePresence>

						{isLoading ? (
							<div className="flex flex-col items-center justify-center py-20">
								<Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
								<p className="text-lg text-muted-foreground">
									Loading investment opportunities...
								</p>
							</div>
						) : fundraisings.length === 0 ? (
							<div className="text-center py-20 bg-muted/30 rounded-lg">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
									<Search className="h-8 w-8 text-muted-foreground" />
								</div>
								<h3 className="text-xl font-semibold mb-2">No results found</h3>
								<p className="text-muted-foreground max-w-md mx-auto mb-6">
									We couldn't find any investment opportunities matching your
									criteria. Try adjusting your filters or search terms.
								</p>
								<Button variant="outline" onClick={resetFilters}>
									Reset Filters
								</Button>
							</div>
						) : (
							<div>
								<div className="flex justify-between items-center mb-6">
									<p className="text-sm text-muted-foreground">
										Showing{" "}
										<span className="font-medium">{fundraisings.length}</span>{" "}
										of{" "}
										<span className="font-medium">{pagination.totalCount}</span>{" "}
										opportunities
									</p>
								</div>

								{activeView === "grid" ? (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{fundraisings.map((fundraising, index) => (
											<motion.div
												key={fundraising.id}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.3, delay: index * 0.05 }}
											>
												<FundingCard
													key={fundraising.id}
													id={`fundraising-${fundraising.id}`}
													fundraising={fundraising}
													onMakeOffer={() => {
														toast({
															title: "Make Offer",
															description: `Opening offer dialog for ${fundraising.company.name}`,
														});
													}}
													onViewDetails={() => {
														router.push(`/companies/${fundraising.id}`);
														toast({
															title: "Viewing Details",
															description: `Loading details for ${fundraising.company.name}`,
														});
													}}
												/>
											</motion.div>
										))}
									</div>
								) : (
									<div className="space-y-4">
										{fundraisings.map((fundraising, index) => (
											<motion.div
												key={fundraising.id}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ duration: 0.3, delay: index * 0.05 }}
											>
												<Card className="overflow-hidden hover:border-primary/50 transition-all">
													<div className="flex flex-col md:flex-row">
														<div className="md:w-1/4 p-6 flex flex-col justify-between bg-muted/30">
															<div>
																<h3 className="text-xl font-bold mb-1">
																	{fundraising.company.name}
																</h3>
																<Badge variant="outline" className="mb-2">
																	{fundraising.company.industry}
																</Badge>
																<p className="text-sm text-muted-foreground line-clamp-2">
																	{fundraising.company.description}
																</p>
															</div>
															<div className="mt-4">
																<div className="text-sm text-muted-foreground mb-1">
																	Funding Progress
																</div>
																<div className="w-full h-2 bg-muted rounded-full overflow-hidden">
																	<div
																		className="h-full bg-primary rounded-full"
																		style={{
																			width: `${fundraising.fundedPercentage}%`,
																		}}
																	></div>
																</div>
																<div className="text-sm mt-1 font-medium">
																	{fundraising.fundedPercentage}% Complete
																</div>
															</div>
														</div>
														<div className="md:w-2/4 p-6 border-t md:border-t-0 md:border-l md:border-r border-border">
															<div className="grid grid-cols-2 gap-4">
																<div>
																	<p className="text-sm text-muted-foreground">
																		Total Equity
																	</p>
																	<p className="font-semibold">
																		{fundraising.equityPercentage}%
																	</p>
																</div>
																<div>
																	<p className="text-sm text-muted-foreground">
																		Funding Amount
																	</p>
																	<p className="font-semibold">
																		{formatCurrency(fundraising.fundingAmount)}
																	</p>
																</div>
																<div>
																	<p className="text-sm text-muted-foreground">
																		Price Per Portion
																	</p>
																	<p className="font-semibold">
																		{formatCurrency(
																			fundraising.pricePerPortion,
																		)}
																	</p>
																</div>
																<div>
																	<p className="text-sm text-muted-foreground">
																		Available Portions
																	</p>
																	<p className="font-semibold">
																		{fundraising.remainingPortions} of{" "}
																		{fundraising.totalPortions}
																	</p>
																</div>
															</div>
														</div>
														<div className="md:w-1/4 p-6 flex flex-col justify-center items-center bg-background">
															<Button
																className="w-full mb-2"
																onClick={() => {
																	router.push(`/companies/${fundraising.id}`);
																	toast({
																		title: "Viewing Details",
																		description: `Loading details for ${fundraising.company.name}`,
																	});
																}}
															>
																View Details
															</Button>
															{/* <Button
																variant="outline"
																className="w-full"
																onClick={() => {
																	toast({
																		title: "Make Offer",
																		description: `Opening offer dialog for ${fundraising.company.name}`,
																	});

																	const element = document.getElementById(
																		`companies-${fundraising.id}`,
																	);
																	if (element) {
																		element.scrollIntoView({
																			behavior: "smooth",
																		});
																	}
																}}
															>
																Make Offer
															</Button> */}
														</div>
													</div>
												</Card>
											</motion.div>
										))}
									</div>
								)}

								{pagination.totalPages > 1 && (
									<div className="flex justify-center mt-8">
										<div className="flex items-center space-x-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													handlePageChange(Math.max(1, pagination.page - 1))
												}
												disabled={pagination.page === 1}
											>
												<ChevronLeft className="h-4 w-4" />
												<span className="sr-only">Previous Page</span>
											</Button>

											{Array.from(
												{ length: pagination.totalPages },
												(_, i) => i + 1,
											)
												.filter(
													(page) =>
														page === 1 ||
														page === pagination.totalPages ||
														Math.abs(page - pagination.page) <= 1,
												)
												.map((page, i, array) => {
													// Add ellipsis
													if (i > 0 && array[i - 1] !== page - 1) {
														return (
															<React.Fragment key={`ellipsis-${page}`}>
																<span className="px-2 text-muted-foreground">
																	...
																</span>
																<Button
																	variant={
																		pagination.page === page
																			? "default"
																			: "outline"
																	}
																	size="sm"
																	onClick={() => handlePageChange(page)}
																>
																	{page}
																</Button>
															</React.Fragment>
														);
													}

													return (
														<Button
															key={page}
															variant={
																pagination.page === page ? "default" : "outline"
															}
															size="sm"
															onClick={() => handlePageChange(page)}
														>
															{page}
														</Button>
													);
												})}

											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													handlePageChange(
														Math.min(
															pagination.totalPages,
															pagination.page + 1,
														),
													)
												}
												disabled={pagination.page === pagination.totalPages}
											>
												<ChevronRight className="h-4 w-4" />
												<span className="sr-only">Next Page</span>
											</Button>
										</div>
									</div>
								)}
							</div>
						)}
					</motion.div>
				</div>
			</section>
		</div>
	);
}
