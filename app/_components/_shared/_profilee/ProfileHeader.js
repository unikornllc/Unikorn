"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/_ui/Avatar"
import { Button } from "@/app/_components/_ui/Button"
import { Input } from "@/app/_components/_ui/Input"
import { MapPin, Briefcase, Mail, Edit2, Check } from "lucide-react"

export default function ProfileHeader({ profile, isEditing, onEdit, onSave, onInputChange }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            className="relative h-80 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-t-xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${profile.coverPicture || "/placeholder.svg"})` }}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-end space-x-4">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        onHoverStart={() => setIsHovered(true)}
                        onHoverEnd={() => setIsHovered(false)}
                    >
                        <Avatar className="w-32 h-32 border-4 border-white">
                            <AvatarImage src={profile.profilePicture} alt={profile.name} />
                            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {isEditing && isHovered && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                                <Edit2 className="w-8 h-8 text-white" />
                            </div>
                        )}
                    </motion.div>
                    <div className="flex-grow">
                        {isEditing ? (
                            <Input
                                name="name"
                                value={profile.name}
                                onChange={onInputChange}
                                className="text-3xl font-bold bg-transparent border-none text-white placeholder-white"
                                placeholder="Name"
                            />
                        ) : (
                            <h1 className="text-3xl font-bold">{profile.name}</h1>
                        )}
                        <p className="text-lg opacity-90">@{profile.username}</p>
                    </div>
                    <div>
                        {isEditing ? (
                            <Button onClick={onSave} variant="secondary" size="sm">
                                <Check className="mr-2 h-4 w-4" /> Save
                            </Button>
                        ) : (
                            <Button onClick={onEdit} variant="secondary" size="sm">
                                <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
                            </Button>
                        )}
                    </div>
                </div>
                <div className="mt-4 flex space-x-4 text-sm">
                    {profile.location && (
                        <div className="flex items-center">
                            <MapPin className="mr-1 h-4 w-4" />
                            {isEditing ? (
                                <Input
                                    name="location"
                                    value={profile.location}
                                    onChange={onInputChange}
                                    className="bg-transparent border-none text-white placeholder-white"
                                    placeholder="Location"
                                />
                            ) : (
                                profile.location
                            )}
                        </div>
                    )}
                    {profile.website && (
                        <div className="flex items-center">
                            <Briefcase className="mr-1 h-4 w-4" />
                            {isEditing ? (
                                <Input
                                    name="website"
                                    value={profile.website}
                                    onChange={onInputChange}
                                    className="bg-transparent border-none text-white placeholder-white"
                                    placeholder="Website"
                                />
                            ) : (
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    {profile.website}
                                </a>
                            )}
                        </div>
                    )}
                    {profile.email && (
                        <div className="flex items-center">
                            <Mail className="mr-1 h-4 w-4" />
                            {isEditing ? (
                                <Input
                                    name="email"
                                    value={profile.email}
                                    onChange={onInputChange}
                                    className="bg-transparent border-none text-white placeholder-white"
                                    placeholder="Email"
                                />
                            ) : (
                                profile.email
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

