import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import {
	Card,
	CardContent,
	Typography,
	Grid,
	CircularProgress,
	Box,
	Tabs,
	Tab,
	Button,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";

const ManageSub = ({ tier, wallet }) => {
	const [showModal, setShowModal] = useState(false);
	const [showWallet, setShowWallet] = useState(false);
	const [tabValue, setTabValue] = useState(0);
	const [depositAmount, setDepositAmount] = useState("");
	const [withdrawAmount, setWithdrawAmount] = useState("");
	const [result, setResult] = useState(null);
	const [following, setFollowing] = useState([]);
	const [transactionSuccess, setTransactionSuccess] = useState(false);
	const [selectedUser, setSelectedUser] = useState("");
	const [sendAmount, setSendAmount] = useState("");

	useEffect(() => {
		const fetchFollowing = async () => {
			try {
				const res = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/getFollowing`,
					{
						withCredentials: true,
					},
				);
				console.log(res.data);
				setFollowing(res.data);
			} catch (err) {
				console.error(err);
			}
		};
		fetchFollowing();
	}, []);

	const handleSend = async () => {
		//handle send money
	};
	const handleDeposit = async () => {
		try {
			await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER}/depositWallet`,
				{ amount: depositAmount },
				{
					withCredentials: true,
				},
			);
			window.location.reload();
		} catch (err) {
			console.error(err);
		}
	};

	const handleWithdraw = async () => {
		try {
			await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER}/widthrawWallet`,
				{ amount: withdrawAmount },
				{
					withCredentials: true,
				},
			);
			window.location.reload();
		} catch (err) {
			console.error(err);
		}
	};

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
				<p className="bg-gray-800 text-gray-200 px-4 py-2 rounded-lg text-sm font-medium shadow-md w-fit">
					Wallet: ${wallet.amount}
				</p>
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
				<button
					className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mt-4 ml-2"
					onClick={() => setShowWallet(true)}
				>
					Manage Wallet
				</button>

				{showWallet && (
					<Modal
						isOpen={showWallet}
						onRequestClose={() => setShowWallet(false)}
						contentLabel="Manage Wallet"
						className="z-50 flex items-center justify-center bg-white rounded-lg p-8 shadow-lg max-w-lg mx-auto relative"
						overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
						ariaHideApp={false}
					>
						<button
							className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
							onClick={() => setShowWallet(false)}
						>
							&times;
						</button>

						<Box sx={{ width: "100%", textAlign: "center" }}>
							<Tabs
								value={tabValue}
								onChange={(e, newValue) => setTabValue(newValue)}
								centered
							>
								<Tab label="Deposit" />
								<Tab label="Withdraw" />
								<Tab label="Transactions" />
								<Tab label="Send" />
							</Tabs>
							{tabValue === 0 && (
								<Box sx={{ mt: 3 }}>
									<Typography variant="h6">Deposit Funds</Typography>
									<TextField
										label="Amount"
										type="number"
										variant="outlined"
										fullWidth
										margin="normal"
										value={depositAmount}
										onChange={(e) => setDepositAmount(e.target.value)}
									/>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											mt: 2,
										}}
									>
										<Button
											variant="contained"
											color="primary"
											onClick={handleDeposit}
										>
											Deposit
										</Button>
										<Button
											variant="contained"
											color="error"
											onClick={() => setShowWallet(false)}
										>
											Close
										</Button>
									</Box>
								</Box>
							)}
							{tabValue === 1 && (
								<Box sx={{ mt: 3 }}>
									<Typography variant="h6">Withdraw Funds</Typography>
									<TextField
										label="Amount"
										type="number"
										variant="outlined"
										fullWidth
										margin="normal"
										value={withdrawAmount}
										onChange={(e) => setWithdrawAmount(e.target.value)}
									/>
									{withdrawAmount > wallet.amount && (
										<Typography
											variant="body2"
											sx={{
												mt: 2,
												color: "red",
												textAlign: "center",
												fontWeight: "bold",
											}}
										>
											You do not have enough funds to withdraw this amount!
										</Typography>
									)}
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											mt: 2,
										}}
									>
										<Button
											variant="contained"
											color="secondary"
											disabled={withdrawAmount > wallet.amount}
											onClick={handleWithdraw}
										>
											Withdraw
										</Button>
										<Button
											variant="contained"
											color="error"
											onClick={() => setShowWallet(false)}
										>
											Close
										</Button>
									</Box>
								</Box>
							)}
							{tabValue === 2 && (
								<Box sx={{ mt: 3 }}>
									<Typography variant="h6">Transaction History</Typography>
									<Typography variant="body2" sx={{ mt: 2, color: "gray" }}>
										No transactions found.
									</Typography>
									<Box
										sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
									>
										<Button
											variant="contained"
											color="error"
											onClick={() => setShowWallet(false)}
										>
											Close
										</Button>
									</Box>
								</Box>
							)}
							{tabValue === 3 && (
								<Box sx={{ mt: 3 }}>
									<Typography variant="h6">Send Money</Typography>
									<FormControl fullWidth margin="normal">
										<InputLabel>Select User</InputLabel>
										<Select
											value={selectedUser}
											onChange={(e) => setSelectedUser(e.target.value)}
										>
											{following.map((user, index) => (
												<MenuItem key={index} value={user}>
													{user}
												</MenuItem>
											))}
										</Select>
									</FormControl>

									<TextField
										label="Amount"
										type="number"
										variant="outlined"
										fullWidth
										margin="normal"
										value={sendAmount}
										onChange={(e) => setSendAmount(e.target.value)}
										error={sendAmount > wallet.amount}
										helperText={
											sendAmount > wallet.amount ? "Insufficient balance!" : ""
										}
									/>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											mt: 2,
										}}
									>
										<Button
											variant="contained"
											color="primary"
											onClick={handleSend}
											disabled={
												!selectedUser ||
												sendAmount > wallet.amount ||
												sendAmount <= 0
											}
										>
											Send
										</Button>
										<Button
											variant="contained"
											color="error"
											onClick={() => setShowWallet(false)}
										>
											Close
										</Button>
									</Box>

									{transactionSuccess && (
										<Typography
											variant="body2"
											sx={{
												mt: 2,
												color: "green",
												textAlign: "center",
												fontWeight: "bold",
											}}
										>
											Money sent successfully to {selectedUser}!
										</Typography>
									)}
								</Box>
							)}
						</Box>
					</Modal>
				)}
			</div>
		</div>
	);
};

export default ManageSub;
