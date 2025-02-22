"use client"

import { useState } from "react"
import { Button } from "@/app/_components/_ui/Button"
import { Input } from "@/app/_components/_ui/Input"
import { Plus, X } from "lucide-react"

export default function CompanyTeam({ company, isOwnProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTeam, setEditedTeam] = useState({
    founders: company.founders,
    key_employees: company.key_employees,
    board_members: company.board_members,
    advisors: company.advisors,
  })

  const handleSave = async () => {
    // In a real app, send a PUT request to update the company data
    // await fetch(`/api/company/${company.id}/team`, { method: 'PUT', body: JSON.stringify(editedTeam) })
    setIsEditing(false)
  }

  const handleAddMember = (category) => {
    setEditedTeam({
      ...editedTeam,
      [category]: [
        ...editedTeam[category],
        category === "founders" ? { name: "", role: "", crunch_base_link: "" } : { name: "", role: "" },
      ],
    })
  }

  const handleRemoveMember = (category, index) => {
    setEditedTeam({
      ...editedTeam,
      [category]: editedTeam[category].filter((_, i) => i !== index),
    })
  }

  const renderTeamSection = (title, category) => (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {isEditing ? (
        <div className="space-y-4">
          {editedTeam[category].map((member, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={member.name}
                onChange={(e) => {
                  const newTeam = { ...editedTeam }
                  newTeam[category][index].name = e.target.value
                  setEditedTeam(newTeam)
                }}
                placeholder="Name"
              />
              <Input
                value={member.role}
                onChange={(e) => {
                  const newTeam = { ...editedTeam }
                  newTeam[category][index].role = e.target.value
                  setEditedTeam(newTeam)
                }}
                placeholder="Role"
              />
              {category === "founders" && (
                <Input
                  value={member.crunch_base_link}
                  onChange={(e) => {
                    const newTeam = { ...editedTeam }
                    newTeam[category][index].crunch_base_link = e.target.value
                    setEditedTeam(newTeam)
                  }}
                  placeholder="Crunchbase Link"
                />
              )}
              <Button onClick={() => handleRemoveMember(category, index)} variant="ghost">
                <X size={20} />
              </Button>
            </div>
          ))}
          <Button onClick={() => handleAddMember(category)}>
            <Plus size={20} className="mr-2" /> Add {title.slice(0, -1)}
          </Button>
        </div>
      ) : (
        <ul className="list-disc list-inside">
          {editedTeam[category].map((member, index) => (
            <li key={index}>
              {member.name} - {member.role}
              {category === "founders" && member.crunch_base_link && (
                <>
                  {" "}
                  (
                  <a
                    href={member.crunch_base_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Crunchbase
                  </a>
                  )
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Team</h2>
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
      {renderTeamSection("Founders", "founders")}
      {renderTeamSection("Key Employees", "key_employees")}
      {renderTeamSection("Board Members", "board_members")}
      {renderTeamSection("Advisors", "advisors")}
    </div>
  )
}

