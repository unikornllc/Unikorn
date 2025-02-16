"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import CompanyHeader from "@/app/_components/_company/_profile/CompanyHeader"
import CompanyAbout from "@/app/_components/_company/_profile/CompanyAbout"
import CompanyProducts from "@/app/_components/_company/_profile/CompanyProducts"
import CompanyTeam from "@/app/_components/_company/_profile/CompanyTeam"
import CompanyFinancials from "@/app/_components/_company/_profile/CompanyFinancials"
import CompanyActivities from "@/app/_components/_company/_profile/CompanyActivities"
import CompanyFiles from "@/app/_components/_company/_profile/CompanyFiles"
import CompanyNavbar from "@/app/_components/_company/CompanyNavbar"

export default function CompanyProfilePage() {
    const { username } = useParams()
    const [isOwnProfile, setIsOwnProfile] = useState(false)
    const [company, setCompany] = useState(null)

    useEffect(() => {
        // In a real app, fetch company data based on the username
        // and set isOwnProfile based on the logged-in user
        const fetchCompanyData = async () => {
            // Simulating API call
            const response = await fetch(`/api/company/${username}`)
            const data = await response.json()
            setCompany(data)
            setIsOwnProfile(username === "techinnovate") // Replace with actual logic
        }

        fetchCompanyData()
    }, [username])

    if (!company) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <CompanyNavbar />
            <main className="container mx-auto px-4 py-8">
                <CompanyHeader company={company} isOwnProfile={isOwnProfile} />
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <CompanyAbout company={company} isOwnProfile={isOwnProfile} />
                        <CompanyProducts company={company} isOwnProfile={isOwnProfile} />
                        <CompanyTeam company={company} isOwnProfile={isOwnProfile} />
                        <CompanyActivities company={company} isOwnProfile={isOwnProfile} />
                    </div>
                    <div className="space-y-8">
                        <CompanyFinancials company={company} isOwnProfile={isOwnProfile} />
                        <CompanyFiles company={company} isOwnProfile={isOwnProfile} />
                    </div>
                </div>
            </main>
        </div>
    )
}

