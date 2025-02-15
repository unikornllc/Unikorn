import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building, MapPin, Calendar, LinkIcon, Briefcase, DollarSign } from "lucide-react"

export default function CompanyProfileView({ company, isOwnProfile, onEdit }) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div
          className="relative h-48 rounded-t-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${company.coverPicture})` }}
        >
          <Avatar className="absolute bottom-0 left-4 transform translate-y-1/2 w-32 h-32 border-4 border-white">
            <AvatarImage src={company.profilePicture} alt={company.name} />
            <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="mt-16 flex justify-between items-center">
          <div>
            <CardTitle className="text-3xl font-bold">{company.name}</CardTitle>
            <p className="text-xl text-gray-600">@{company.username}</p>
          </div>
          {isOwnProfile ? (
            <Button onClick={onEdit}>Edit Profile</Button>
          ) : (
            <div>
              <Button className="mr-2">Follow</Button>
              <Button variant="outline" as="a" href={company.calendlyLink} target="_blank" rel="noopener noreferrer">
                <Calendar className="mr-2 h-4 w-4" /> Schedule Meeting
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p>{company.description}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Company Details</h2>
            <div className="space-y-2">
              <p>
                <Building className="inline mr-2" />
                {company.industry}
              </p>
              <p>
                <MapPin className="inline mr-2" />
                {company.location}
              </p>
              <p>
                <Briefcase className="inline mr-2" />
                {company.size}
              </p>
              <p>
                <Calendar className="inline mr-2" />
                Founded in {company.foundedYear}
              </p>
              <p>
                <LinkIcon className="inline mr-2" />
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {company.website}
                </a>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Specialties</h2>
            <div className="flex flex-wrap gap-2">
              {company.specialties.map((specialty, index) => (
                <span key={index} className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                  {specialty}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Funding Rounds</h2>
            {company.fundingRounds.map((round, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-semibold">{round.series}</h3>
                <p>
                  <DollarSign className="inline mr-2" />
                  {round.amount}
                </p>
                <p className="text-gray-600">{round.date}</p>
              </div>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Team</h2>
            <div className="grid grid-cols-2 gap-4">
              {company.team.map((member, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.profilePicture} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Social Links</h2>
            <div className="space-y-2">
              <p>
                <LinkIcon className="inline mr-2" />
                <a
                  href={company.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  LinkedIn
                </a>
              </p>
              <p>
                <LinkIcon className="inline mr-2" />
                <a
                  href={company.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Twitter
                </a>
              </p>
            </div>
          </section>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

