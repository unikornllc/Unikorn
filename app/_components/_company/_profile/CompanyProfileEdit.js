"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/_ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/_ui/Avatar"
import { Button } from "@/app/_components/_ui/Button"
import { Input } from "@/app/_components/_ui/Input"
import { Textarea } from "@/app/_components/_ui/Textarea"
import { Label } from "@/app/_components/_ui/Label"
import { ScrollArea } from "@/app/_components/_ui/ScrollArea"

export default function CompanyProfileEdit({ company, onSave, onCancel }) {
  const [editedCompany, setEditedCompany] = useState(company)

  const handleInputChange = (e, section, index) => {
    const { name, value } = e.target
    setEditedCompany((prevCompany) => {
      if (section && Array.isArray(prevCompany[section])) {
        const newSection = [...prevCompany[section]]
        newSection[index] = { ...newSection[index], [name]: value }
        return { ...prevCompany, [section]: newSection }
      } else if (section === "socialLinks") {
        return { ...prevCompany, socialLinks: { ...prevCompany.socialLinks, [name]: value } }
      } else {
        return { ...prevCompany, [name]: value }
      }
    })
  }

  const handleAddSection = (section) => {
    setEditedCompany((prevCompany) => ({
      ...prevCompany,
      [section]: [...prevCompany[section], {}],
    }))
  }

  const handleRemoveSection = (section, index) => {
    setEditedCompany((prevCompany) => ({
      ...prevCompany,
      [section]: prevCompany[section].filter((_, i) => i !== index),
    }))
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedCompany((prevCompany) => ({
          ...prevCompany,
          profilePicture: reader.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div
          className="relative h-48 rounded-t-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${editedCompany.coverPicture})` }}
        >
          <Avatar className="absolute bottom-0 left-4 transform translate-y-1/2 w-32 h-32 border-4 border-white">
            <AvatarImage src={editedCompany.profilePicture} alt={editedCompany.name} />
            <AvatarFallback>{editedCompany.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="mt-16 flex justify-between items-center">
          <div>
            <CardTitle className="text-3xl font-bold">
              <Input
                name="name"
                value={editedCompany.name}
                onChange={handleInputChange}
                className="text-3xl font-bold"
              />
            </CardTitle>
            <p className="text-xl text-gray-600">@{editedCompany.username}</p>
          </div>
          <div>
            <Button onClick={() => onSave(editedCompany)} className="mr-2">
              Save
            </Button>
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <Textarea name="description" value={editedCompany.description} onChange={handleInputChange} rows={4} />
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Company Details</h2>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" name="industry" value={editedCompany.industry} onChange={handleInputChange} />
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={editedCompany.location} onChange={handleInputChange} />
              <Label htmlFor="size">Company Size</Label>
              <Input id="size" name="size" value={editedCompany.size} onChange={handleInputChange} />
              <Label htmlFor="foundedYear">Founded Year</Label>
              <Input
                id="foundedYear"
                name="foundedYear"
                value={editedCompany.foundedYear}
                onChange={handleInputChange}
              />
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" value={editedCompany.website} onChange={handleInputChange} />
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Specialties</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedCompany.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-2.5 py-0.5 rounded flex items-center"
                >
                  {specialty}
                  <button
                    onClick={() =>
                      setEditedCompany((prevCompany) => ({
                        ...prevCompany,
                        specialties: prevCompany.specialties.filter((_, i) => i !== index),
                      }))
                    }
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Add a specialty"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setEditedCompany((prevCompany) => ({
                      ...prevCompany,
                      specialties: [...prevCompany.specialties, e.currentTarget.value],
                    }))
                    e.currentTarget.value = ""
                  }
                }}
              />
              <Button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Add a specialty"]')
                  if (input.value) {
                    setEditedCompany((prevCompany) => ({
                      ...prevCompany,
                      specialties: [...prevCompany.specialties, input.value],
                    }))
                    input.value = ""
                  }
                }}
              >
                Add
              </Button>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Funding Rounds</h2>
            {editedCompany.fundingRounds.map((round, index) => (
              <div key={index} className="mb-4 space-y-2">
                <Input
                  name="series"
                  value={round.series}
                  onChange={(e) => handleInputChange(e, "fundingRounds", index)}
                  placeholder="Series"
                />
                <Input
                  name="amount"
                  value={round.amount}
                  onChange={(e) => handleInputChange(e, "fundingRounds", index)}
                  placeholder="Amount"
                />
                <Input
                  name="date"
                  value={round.date}
                  onChange={(e) => handleInputChange(e, "fundingRounds", index)}
                  placeholder="Date"
                />
                <Button variant="destructive" onClick={() => handleRemoveSection("fundingRounds", index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={() => handleAddSection("fundingRounds")}>Add Funding Round</Button>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Team</h2>
            {editedCompany.team.map((member, index) => (
              <div key={index} className="mb-4 space-y-2">
                <Input
                  name="name"
                  value={member.name}
                  onChange={(e) => handleInputChange(e, "team", index)}
                  placeholder="Name"
                />
                <Input
                  name="title"
                  value={member.title}
                  onChange={(e) => handleInputChange(e, "team", index)}
                  placeholder="Title"
                />
                <Button variant="destructive" onClick={() => handleRemoveSection("team", index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={() => handleAddSection("team")}>Add Team Member</Button>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Profile Picture</h2>
            <Input type="file" onChange={handleFileUpload} accept="image/*" />
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Social Links</h2>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                name="linkedin"
                value={editedCompany.socialLinks.linkedin}
                onChange={(e) => handleInputChange(e, "socialLinks")}
              />
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                name="twitter"
                value={editedCompany.socialLinks.twitter}
                onChange={(e) => handleInputChange(e, "socialLinks")}
              />
              <Label htmlFor="calendly">Calendly Link</Label>
              <Input
                id="calendly"
                name="calendlyLink"
                value={editedCompany.calendlyLink}
                onChange={handleInputChange}
              />
            </div>
          </section>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

