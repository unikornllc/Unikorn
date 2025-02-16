"use client"

import { useState } from "react"
import { Button } from "@/app/_components/_ui/Button"
import { Input } from "@/app/_components/_ui/Input"
import { Textarea } from "@/app/_components/_ui/Textarea"
import { Plus, X } from "lucide-react"

export default function CompanyProducts({ company, isOwnProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProducts, setEditedProducts] = useState(company.product_information)

  const handleSave = async () => {
    // In a real app, send a PUT request to update the company data
    // await fetch(`/api/company/${company.id}/products`, { method: 'PUT', body: JSON.stringify(editedProducts) })
    setIsEditing(false)
  }

  const handleAddProduct = () => {
    setEditedProducts([...editedProducts, { product: "", market: "", partnerships: [] }])
  }

  const handleRemoveProduct = (index) => {
    setEditedProducts(editedProducts.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
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
          {editedProducts.map((product, index) => (
            <div key={index} className="border p-4 rounded-md relative">
              <button
                onClick={() => handleRemoveProduct(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
              <Input
                value={product.product}
                onChange={(e) => {
                  const newProducts = [...editedProducts]
                  newProducts[index].product = e.target.value
                  setEditedProducts(newProducts)
                }}
                placeholder="Product name"
                className="mb-2"
              />
              <Input
                value={product.market}
                onChange={(e) => {
                  const newProducts = [...editedProducts]
                  newProducts[index].market = e.target.value
                  setEditedProducts(newProducts)
                }}
                placeholder="Market"
                className="mb-2"
              />
              <Input
                value={product.partnerships.join(", ")}
                onChange={(e) => {
                  const newProducts = [...editedProducts]
                  newProducts[index].partnerships = e.target.value.split(",").map((p) => p.trim())
                  setEditedProducts(newProducts)
                }}
                placeholder="Partnerships (comma-separated)"
              />
            </div>
          ))}
          <Button onClick={handleAddProduct} className="mt-4">
            <Plus size={20} className="mr-2" /> Add Product
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {company.product_information.map((product, index) => (
            <div key={index} className="border p-4 rounded-md">
              <h3 className="font-semibold">{product.product}</h3>
              <p>
                <strong>Market:</strong> {product.market}
              </p>
              <p>
                <strong>Partnerships:</strong> {product.partnerships.join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

