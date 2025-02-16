"use client"

import { useState } from "react"
import { Button } from "@/app/_components/_ui/Button"
import { Input } from "@/app/_components/_ui/Input"
import { Textarea } from "@/app/_components/_ui/Textarea"
import { Plus, X } from "lucide-react"

export default function CompanyActivities({ company, isOwnProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedActivities, setEditedActivities] = useState(company.activities)

  const handleSave = async () => {
    // In a real app, send a PUT request to update the company data
    // await fetch(`/api/company/${company.id}/activities`, { method: 'PUT', body: JSON.stringify(editedActivities) })
    setIsEditing(false)
  }

  const handleAddActivity = () => {
    setEditedActivities([...editedActivities, { title: "", description: "" }])
  }

  const handleRemoveActivity = (index) => {
    setEditedActivities(editedActivities.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Activities</h2>
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
          {editedActivities.map((activity, index) => (
            <div key={index} className="border p-4 rounded-md relative">
              <button
                onClick={() => handleRemoveActivity(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
              <Input
                value={activity.title}
                onChange={(e) => {
                  const newActivities = [...editedActivities]
                  newActivities[index].title = e.target.value
                  setEditedActivities(newActivities)
                }}
                placeholder="Activity title"
                className="mb-2"
              />
              <Textarea
                value={activity.description}
                onChange={(e) => {
                  const newActivities = [...editedActivities]
                  newActivities[index].description = e.target.value
                  setEditedActivities(newActivities)
                }}
                placeholder="Activity description"
              />
            </div>
          ))}
          <Button onClick={handleAddActivity}>
            <Plus size={20} className="mr-2" /> Add Activity
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {company.activities.map((activity, index) => (
            <div key={index} className="border p-4 rounded-md">
              <h3 className="font-semibold">{activity.title}</h3>
              <p>{activity.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

