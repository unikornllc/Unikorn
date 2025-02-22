"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/app/_components/_ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/_ui/Tabs"
import { Building, Briefcase, Users, DollarSign, FileText, Activity } from "lucide-react"
import ProfileHeader from "@/app/_components/_shared/_profile/ProfileHeader"

const Section = ({ title, icon: Icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-6"
  >
    <h3 className="text-xl font-semibold mb-3 flex items-center">
      <Icon className="mr-2 h-5 w-5 text-indigo-500" />
      {title}
    </h3>
    {children}
  </motion.div>
)

export default function CompanyProfileView({ company, isOwnProfile, onEdit }) {
  const [activeTab, setActiveTab] = useState("about")

  const renderArray = (array) => (
    <div className="flex flex-wrap gap-2">
      {array.map((item, index) => (
        <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {item}
        </span>
      ))}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="overflow-hidden">
        <ProfileHeader profile={company} isEditing={false} onEdit={onEdit} />
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="about">
                  <Section title="About" icon={Building}>
                    <p className="text-gray-600">{company.description}</p>
                  </Section>
                  <Section title="Company Details" icon={Briefcase}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">Industry</p>
                        <p className="text-gray-600">{company.industry}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Founded</p>
                        <p className="text-gray-600">{new Date(company.founded).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Company Type</p>
                        <p className="text-gray-600">{company.type}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Headquarters</p>
                        <p className="text-gray-600">{company.hqlocation}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Company Tier</p>
                        <p className="text-gray-600">{company.tier}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Verified</p>
                        <p className="text-gray-600">{company.verified ? "Yes" : "No"}</p>
                      </div>
                    </div>
                  </Section>
                </TabsContent>
                <TabsContent value="products">
                  <Section title="Products" icon={Briefcase}>
                    {company.product_information.map((product, index) => (
                      <motion.div
                        key={index}
                        className="mb-4 p-4 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <h4 className="font-semibold">{product.product}</h4>
                        <p className="text-gray-600">Market: {product.market}</p>
                        <p className="font-semibold mt-2">Partnerships:</p>
                        {/* {renderArray(product.partnerships)} */}
                      </motion.div>
                    ))}
                  </Section>
                </TabsContent>
                <TabsContent value="team">
                  <Section title="Founders" icon={Users}>
                    {company.founders.map((founder, index) => (
                      <motion.div
                        key={index}
                        className="mb-4 p-4 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <h4 className="font-semibold">{founder.name}</h4>
                        <p className="text-gray-600">{founder.role}</p>
                        <a href={founder.crunch_base_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          Crunchbase Profile
                        </a>
                      </motion.div>
                    ))}
                  </Section>
                  <Section title="Key Employees" icon={Users}>
                    {company.key_employees.map((employee, index) => (
                      <motion.div
                        key={index}
                        className="mb-4 p-4 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <h4 className="font-semibold">{employee.name}</h4>
                        <p className="text-gray-600">{employee.role}</p>
                      </motion.div>
                    ))}
                  </Section>
                  <Section title="Board Members" icon={Users}>
                    {renderArray(company.board_members)}
                  </Section>
                  <Section title="Advisors" icon={Users}>
                    {renderArray(company.advisors)}
                  </Section>
                </TabsContent>
                <TabsContent value="financials">
                  <Section title="Financial Information" icon={DollarSign}>
                    {company.financials && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold">Revenue</p>
                          <p className="text-gray-600">{company.financials.revenue}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Profit</p>
                          <p className="text-gray-600">{company.financials.profit}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Valuation</p>
                          <p className="text-gray-600">{company.financials.valuation}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Cash on Hand</p>
                          <p className="text-gray-600">{company.financials.cash_on_hand}</p>
                        </div>
                      </div>
                    )}
                  </Section>
                  <Section title="Fundraising" icon={DollarSign}>
                    {company.raising_Funds.map((round, index) => (
                      <motion.div
                        key={index}
                        className="mb-4 p-4 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <h4 className="font-semibold">{round.round_name}</h4>
                        <p className="text-gray-600">Target: {round.target_amount}</p>
                        <p className="text-gray-600">Raised: {round.raised_amount}</p>
                        <p className="text-gray-600">Status: {round.status}</p>
                      </motion.div>
                    ))}
                  </Section>
                </TabsContent>
                <TabsContent value="activities">
                  <Section title="Recent Activities" icon={Activity}>
                    {company.activities.map((activity, index) => (
                      <motion.div
                        key={index}
                        className="mb-4 p-4 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1, opacity: 1, y: 0 }}
                      >
                        <h4 className="font-semibold">{activity.title}</h4>
                        <p className="text-gray-600">{activity.description}</p>
                      </motion.div>
                    ))}
                  </Section>
                </TabsContent>
                <TabsContent value="files">
                  <Section title="Company Files" icon={FileText}>
                    {company.company_file && company.company_file.map((file, index) => (
                      <motion.div
                        key={index}
                        className="mb-4 p-4 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <h4 className="font-semibold">{file.fileName}</h4>
                        <p className="text-gray-600">Type: {file.fileType}</p>
                        <p className="text-gray-600">Uploaded: {new Date(file.uploadedAt).toLocaleString()}</p>
                        <a href={file.filePath} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          View File
                        </a>
                      </motion.div>
                    ))}
                  </Section>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}

