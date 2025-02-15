"use client"

import { useState } from "react"
import { Button } from "@/app/_components/_ui/Button"
import { Input } from "@/app/_components/_ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/_ui/Select"
import { Plus, X } from "lucide-react"

const socialPlatforms = ["LinkedIn", "X", "Meetup"]

export default function UserSocialMedia({ user, isOwnProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedSocialMedia, setEditedSocialMedia] = useState(user.social_media)

  const handleSave = async () => {
    // In a real app, send a PUT request to update the user data
    // await fetch(`/api/user/${user.id}/social-media`, { method: 'PUT', body: JSON.stringify(editedSocialMedia) })
    setIsEditing(false)
  }

  const handleAddSocialMedia = () => {
    setEditedSocialMedia([...editedSocialMedia, { platform: "LinkedIn", url: "" }])
  }

  const handleRemoveSocialMedia = (index) => {
    setEditedSocialMedia(editedSocialMedia.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Social Media</h2>
        {isOwnProfile &&
          (isEditing ? (
            <div>
              <Button onClick={handleSave} className="mr-2">
                Save
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          ))}
      </div>
      {isEditing ? (
        <div className="space-y-4">
          {editedSocialMedia.map((social, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Select
                value={social.platform}
                onValueChange={(value) => {
                  const newSocialMedia = [...editedSocialMedia]
                  newSocialMedia[index].platform = value
                  setEditedSocialMedia(newSocialMedia)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={social.url}
                onChange={(e) => {
                  const newSocialMedia = [...editedSocialMedia]
                  newSocialMedia[index].url = e.target.value
                  setEditedSocialMedia(newSocialMedia)
                }}
                placeholder="URL"
              />
              <Button onClick={() => handleRemoveSocialMedia(index)} variant="ghost">
                <X size={20} />
              </Button>
            </div>
          ))}
          <Button onClick={handleAddSocialMedia}>
            <Plus size={20} className="mr-2" /> Add Social Media
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {user.social_media.map((social, index) => (
            <div key={index}>
              <p>
                <strong>{social.platform}:</strong>{" "}
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {social.url}
                </a>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

