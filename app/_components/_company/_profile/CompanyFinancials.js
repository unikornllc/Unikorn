"use client"

import { useState } from "react"
import { Button } from "@/app/_components/_ui/Button"
import { Input } from "@/app/_components/_ui/Input"
import { Textarea } from "@/app/_components/_ui/Textarea"


export default function CompanyFinancials({ company, isOwnProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedFinancials, setEditedFinancials] = useState(company.financials || {})

  const handleSave = async () => {
    // In a real app, send a PUT request to update the company data
    // await fetch(`/api/company/${company.id}/financials`, { method: 'PUT', body: JSON.stringify(editedFinancials) })
    setIsEditing(false)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Financials</h2>
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
          <Input
            type="number"
            value={editedFinancials.revenue}
            onChange={(e) => setEditedFinancials({ ...editedFinancials, revenue: e.target.value })}
            placeholder="Revenue"
          />
          <Input
            type="number"
            value={editedFinancials.expenses}
            onChange={(e) => setEditedFinancials({ ...editedFinancials, expenses: e.target.value })}
            placeholder="Expenses"
          />
          <Input
            type="number"
            value={editedFinancials.profit}
            onChange={(e) => setEditedFinancials({ ...editedFinancials, profit: e.target.value })}
            placeholder="Profit"
          />
          <Input
            type="number"
            value={editedFinancials.valuation}
            onChange={(e) => setEditedFinancials({ ...editedFinancials, valuation: e.target.value })}
            placeholder="Valuation"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <p>
            <strong>Revenue:</strong> ${company.financials?.revenue?.toLocaleString() || "N/A"}
          </p>
          <p>
            <strong>Expenses:</strong> ${company.financials?.expenses?.toLocaleString() || "N/A"}
          </p>
          <p>
            <strong>Profit:</strong> ${company.financials?.profit?.toLocaleString() || "N/A"}
          </p>
          <p>
            <strong>Valuation:</strong> ${company.financials?.valuation?.toLocaleString() || "N/A"}
          </p>
        </div>
      )}
    </div>
  )
}

