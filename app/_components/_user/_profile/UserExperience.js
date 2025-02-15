"use client"

import { useState } from "react"
import { Button } from "@/app/_components/_ui/Button"
import { Input } from "@/app/_components/_ui/Input"
import { Textarea } from "@/app/_components/_ui/Textarea"
import { Plus, X } from "lucide-react"

export default function UserExperience({ user, isOwnProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedExperience, setEditedExperience] = useState({
    corporate: user.corporate_experience,
    startup: user.startup_experience,
  })

  const handleSave = async () => {
    // In a real app, send a PUT request to update the user data
    // await fetch(`/api/user/${user.id}/experience`, { method: 'PUT', body: JSON.stringify(editedExperience) })
    setIsEditing(false)
  }

  const handleAddExperience = (type) => {
    if (type === "corporate") {
      setEditedExperience({
        ...editedExperience,
        corporate: [
          ...editedExperience.corporate,
          { job_title: "", company_name: "", start_date: "", end_date: "", responsibilities: "" },
        ],
      })
    } else {
      setEditedExperience({
        ...editedExperience,
        startup: [...editedExperience.startup, { startup_name: "", role: "", description: "" }],
      })
    }
  }

  const handleRemoveExperience = (type, index) => {
    setEditedExperience({
      ...editedExperience,
      [type]: editedExperience[type].filter((_, i) => i !== index),
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Experience</h2>
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
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Corporate Experience</h3>
          {isEditing ? (
            <div className="space-y-4">
              {editedExperience.corporate.map((exp, index) => (
                <div key={index} className="border p-4 rounded-md relative">
                  <button
                    onClick={() => handleRemoveExperience("corporate", index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                  <Input
                    value={exp.job_title}
                    onChange={(e) => {
                      const newExperience = { ...editedExperience }
                      newExperience.corporate[index].job_title = e.target.value
                      setEditedExperience(newExperience)
                    }}
                    placeholder="Job Title"
                    className="mb-2"
                  />
                  <Input
                    value={exp.company_name}
                    onChange={(e) => {
                      const newExperience = { ...editedExperience }
                      newExperience.corporate[index].company_name = e.target.value
                      setEditedExperience(newExperience)
                    }}
                    placeholder="Company Name"
                    className="mb-2"
                  />
                  <div className="flex space-x-2 mb-2">
                    <Input
                      type="date"
                      value={exp.start_date}
                      onChange={(e) => {
                        const newExperience = { ...editedExperience }
                        newExperience.corporate[index].start_date = e.target.value
                        setEditedExperience(newExperience)
                      }}
                    />
                    <Input
                      type="date"
                      value={exp.end_date}
                      onChange={(e) => {
                        const newExperience = { ...editedExperience }
                        newExperience.corporate[index].end_date = e.target.value
                        setEditedExperience(newExperience)
                      }}
                    />
                  </div>
                  <Textarea
                    value={exp.responsibilities}
                    onChange={(e) => {
                      const newExperience = { ...editedExperience }
                      newExperience.corporate[index].responsibilities = e.target.value
                      setEditedExperience(newExperience)
                    }}
                    placeholder="Responsibilities"
                  />
                </div>
              ))}
              <Button onClick={() => handleAddExperience("corporate")}>
                <Plus size={20} className="mr-2" /> Add Corporate Experience
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {user.corporate_experience.map((exp, index) => (
                <div key={index}>
                  <p>
                    <strong>{exp.job_title}</strong> at {exp.company_name}
                  </p>
                  <p>
                    {new Date(exp.start_date).toLocaleDateString()} - {new Date(exp.end_date).toLocaleDateString()}
                  </p>
                  <p>{exp.responsibilities}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Startup Experience</h3>
          {isEditing ? (
            <div className="space-y-4">
              {editedExperience.startup.map((exp, index) => (
                <div key={index} className="border p-4 rounded-md relative">
                  <button
                    onClick={() => handleRemoveExperience("startup", index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                  <Input
                    value={exp.startup_name}
                    onChange={(e) => {
                      const newExperience = { ...editedExperience }
                      newExperience.startup[index].startup_name = e.target.value
                      setEditedExperience(newExperience)
                    }}
                    placeholder="Startup Name"
                    className="mb-2"
                  />
                  <Input
                    value={exp.role}
                    onChange={(e) => {
                      const newExperience = { ...editedExperience }
                      newExperience.startup[index].role = e.target.value
                      setEditedExperience(newExperience)
                    }}
                    placeholder="Role"
                    className="mb-2"
                  />
                  <Textarea
                    value={exp.description}
                    onChange={(e) => {
                      const newExperience = { ...editedExperience }
                      newExperience.startup[index].description = e.target.value
                      setEditedExperience(newExperience)
                    }}
                    placeholder="Description"
                    maxLength={500}
                  />
                </div>
              ))}
              <Button onClick={() => handleAddExperience("startup")}>
                <Plus size={20} className="mr-2" /> Add Startup Experience
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {user.startup_experience.map((exp, index) => (
                <div key={index}>
                  <p>
                    <strong>{exp.role}</strong> at {exp.startup_name}
                  </p>
                  <p>{exp.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

