import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/_ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/_ui/Avatar"
import { Button } from "@/app/_components/_ui/Button"

export default function ProfileCard({ profile, isCompany }) {
    return (
        <Card className="md:col-span-1">
            <CardHeader>
                <CardTitle>{isCompany ? "Company Profile" : "User Profile"}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center">
                    <Avatar className="w-24 h-24 mb-4">
                        <AvatarImage src={profile.profileImage || "/placeholder.svg?height=96&width=96"} alt={profile.name} />
                        <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold text-indigo-900">{profile.name}</h2>
                    <p className="text-sm text-indigo-600">@{profile.account.username}</p>
                    <p className="mt-2 text-center text-gray-600">{profile.description}</p>
                    <div className="mt-4 flex justify-center space-x-2">
                        <Button variant="outline" onClick={() => {
                            window.location.href = isCompany ? "/company/profile" : "/user/profile";
                        }}>Edit Profile</Button>
                        <Button>{isCompany ? "Raise Funds" : "Invest Now"}</Button>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-900">
                            {isCompany ? 0 : 0}
                        </p>
                        <p className="text-sm text-gray-600">{isCompany ? "Followers" : "Following"}</p>
                    </div>
                    <div className="text-center">
                        {/* <p className="text-sm text-gray-600">Tier</p> */}
                        <p className="text-2xl font-bold text-indigo-900">{profile.tier}</p>
                    </div>
                    {/* <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-900">
                            {isCompany ? profile.investorCount : profile.investmentCount}
                        </p>
                        <p className="text-sm text-gray-600">{isCompany ? "Investors" : "Investments"}</p>
                    </div> */}
                </div>
            </CardContent>
        </Card>
    )
}

