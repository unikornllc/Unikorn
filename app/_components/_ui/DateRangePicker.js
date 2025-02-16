"use client"

import { useState } from "react"
import { Input } from "@/app/_components/_ui/Input"

export const DatePickerWithRange = ({ onChange }) => {
    const [range, setRange] = useState({ from: null, to: null })

    const handleDateChange = (key, value) => {
        setRange((prev) => ({ ...prev, [key]: value }))
        onChange({ from: range.from, to: range.to })
    }

    return (
        <div className="flex space-x-2">
            <Input type="date" onChange={(e) => handleDateChange("from", new Date(e.target.value))} />
            <Input type="date" onChange={(e) => handleDateChange("to", new Date(e.target.value))} />
        </div>
    )
}

