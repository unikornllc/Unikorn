"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/app/_components/_ui/Button"
import { Input } from "@/app/_components/_ui/Input"
import { Textarea } from "@/app/_components/_ui/Textarea"
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react"

const EditableSection = ({ title, items, onAdd, onDelete, onEdit, fields, collapsible = false }) => {
    const [isCollapsed, setIsCollapsed] = useState(collapsible)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 border rounded-lg p-4"
        >
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold flex items-center">
                    {title}
                    {collapsible && (
                        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="ml-2">
                            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                        </Button>
                    )}
                </h3>
                {onAdd && (
                    <Button onClick={onAdd} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                )}
            </div>
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {items.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="mb-4 p-4 bg-gray-50 rounded-lg relative"
                            >
                                {fields.map((field) => (
                                    <div key={field.name} className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                        {field.type === "textarea" ? (
                                            <Textarea
                                                value={item[field.name] || ""}
                                                onChange={(e) => onEdit(index, field.name, e.target.value)}
                                                className="w-full"
                                            />
                                        ) : field.type === "array" ? (
                                            <div className="flex flex-wrap gap-2">
                                                {item[field.name]?.map((value, i) => (
                                                    <div key={i} className="flex items-center bg-gray-200 rounded px-2 py-1">
                                                        <span>{value}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                const newArray = [...item[field.name]]
                                                                newArray.splice(i, 1)
                                                                onEdit(index, field.name, newArray)
                                                            }}
                                                        >
                                                            <X size={12} />
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Input
                                                    type="text"
                                                    placeholder="Add new item"
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") {
                                                            const newArray = [...(item[field.name] || []), e.target.value]
                                                            onEdit(index, field.name, newArray)
                                                            e.target.value = ""
                                                        }
                                                    }}
                                                    className="w-full mt-2"
                                                />
                                            </div>
                                        ) : (
                                            <Input
                                                type={field.type}
                                                value={item[field.name] || ""}
                                                onChange={(e) => onEdit(index, field.name, e.target.value)}
                                                className="w-full"
                                            />
                                        )}
                                    </div>
                                ))}
                                {onDelete && (
                                    <Button
                                        onClick={() => onDelete(index)}
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default EditableSection

