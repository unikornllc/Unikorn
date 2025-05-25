"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/_components/_ui/Button.js";
import { Progress } from "@/app/_components/_ui/Progress";
import { toast } from "sonner";
import { votePoll, checkIfUserVoted } from "@/app/_utils/_api/newsfeedAPIs.js";

export default function PollPostContent({ post }) {
	const [selectedOption, setSelectedOption] = useState(null);
	const [hasVoted, setHasVoted] = useState(false);
	const [isVoting, setIsVoting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [pollResults, setPollResults] = useState(null);

	const poll = post.poll || null;

	useEffect(() => {
		const checkUserVote = async () => {
			try {
				if (!poll) {
					setIsLoading(false);
					return;
				}

				const userVotedOption = poll.options.find((option) => option.userVoted);

				if (userVotedOption) {
					setHasVoted(true);
					setSelectedOption(userVotedOption.id);

					const totalVotes = poll.options.reduce(
						(sum, option) => sum + (option._count?.votes || 0),
						0,
					);
					const results = poll.options.map((option) => ({
						id: option.id,
						text: option.text,
						votes: option._count?.votes || 0,
						percentage:
							totalVotes > 0
								? Math.round(((option._count?.votes || 0) / totalVotes) * 100)
								: 0,
						userVoted: option.id === userVotedOption.id,
					}));

					setPollResults(results);
					setIsLoading(false);
				} else {
					try {
						const response = await checkIfUserVoted(poll.id);

						if (response.hasVoted) {
							setHasVoted(true);
							setSelectedOption(response.userVoteOptionId);
							setPollResults(response.results);
						}
					} catch (error) {
						console.error("Error checking user vote via API:", error);
						const totalVotes = poll.options.reduce(
							(sum, option) => sum + (option._count?.votes || 0),
							0,
						);
						const results = poll.options.map((option) => ({
							id: option.id,
							text: option.text,
							votes: option._count?.votes || 0,
							percentage:
								totalVotes > 0
									? Math.round(((option._count?.votes || 0) / totalVotes) * 100)
									: 0,
							userVoted: false,
						}));
						setPollResults(results);
					}
				}
			} catch (error) {
				console.error("Error checking user vote:", error);
			} finally {
				setIsLoading(false);
			}
		};

		checkUserVote();
	}, [poll]);

	const handleVote = async () => {
		if (!selectedOption || hasVoted || isVoting) return;

		setIsVoting(true);

		try {
			const response = await votePoll(poll.id, selectedOption);

			const pollData = response.data.pollResults;
			const totalVotes = pollData._count.votes;

			const formattedResults = pollData.options.map((option) => ({
				id: option.id,
				text: option.text,
				votes: option._count.votes,
				percentage:
					totalVotes > 0
						? Math.round((option._count.votes / totalVotes) * 100)
						: 0,
				userVoted: option.id === selectedOption,
			}));

			setPollResults(formattedResults);
			setHasVoted(true);
			toast.success("Your vote has been recorded!");
		} catch (error) {
			console.error("Error voting on poll:", error);
			toast.error("Failed to record your vote. Please try again.");
		} finally {
			setIsVoting(false);
		}
	};

	const showResults = hasVoted || pollResults;

	if (!poll) {
		return <p>{post.content}</p>;
	}

	if (isLoading) {
		return (
			<div className="space-y-4">
				<h3 className="text-lg font-medium">{poll.question}</h3>
				<div className="flex justify-center py-4">
					<div className="animate-pulse h-4 w-4 bg-primary rounded-full"></div>
					<div className="animate-pulse h-4 w-4 bg-primary rounded-full ml-1"></div>
					<div className="animate-pulse h-4 w-4 bg-primary rounded-full ml-1"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-medium">{poll.question}</h3>

			<div className="space-y-2">
				{poll.options.map((option) => {
					const result = pollResults?.find((r) => r.id === option.id);
					const votePercentage = result?.percentage || 0;
					const isUserVote = result?.userVoted || false;

					return (
						<div key={option.id} className="relative">
							{showResults ? (
								<div
									className={`p-3 border rounded-md ${isUserVote ? "border-primary bg-primary/5" : ""}`}
								>
									<div className="flex justify-between mb-1">
										<span className="text-sm font-medium flex items-center gap-2">
											{option.text}
											{isUserVote && (
												<span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
													Your vote
												</span>
											)}
										</span>
										<span className="text-sm font-medium">
											{votePercentage}%
										</span>
									</div>
									<Progress value={votePercentage} className="h-2" />
									<div className="mt-1 text-xs text-gray-500">
										{result?.votes || option._count?.votes || 0} votes
									</div>
								</div>
							) : (
								<button
									type="button"
									onClick={() => setSelectedOption(option.id)}
									className={`w-full p-3 text-left border rounded-md transition-colors ${
										selectedOption === option.id
											? "border-primary bg-primary/5"
											: "hover:bg-gray-50"
									}`}
								>
									{option.text}
								</button>
							)}
						</div>
					);
				})}
			</div>

			{!showResults && (
				<Button
					onClick={handleVote}
					disabled={!selectedOption || isVoting}
					className="w-full"
				>
					{isVoting ? "Submitting..." : "Vote"}
				</Button>
			)}

			{showResults && (
				<div className="text-center text-sm text-gray-500">
					{hasVoted ? "You've voted in this poll." : "Poll results shown."}
				</div>
			)}
		</div>
	);
}
