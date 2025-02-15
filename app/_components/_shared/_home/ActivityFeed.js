import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/_ui/Card"
import { ScrollArea } from "@/app/_components/_ui/ScrollArea"
import { Button } from "@/app/_components/_ui/Button"
import { useState, useEffect } from "react"
import { Input } from "@/app/_components/_ui/Input"

export default function ActivityFeed() {
    const [feed, setFeed] = useState([
        {
            id: 1,
            type: "company",
            name: "TechInnovate Inc.",
            content: "We're excited to announce our new AI-powered analytics platform!",
            likes: 45,
            comments: 12,
        },
        {
            id: 2,
            type: "news",
            content: "Breaking: Major tech companies announce collaboration on quantum computing initiative",
            likes: 78,
            comments: 23,
        },
        {
            id: 3,
            type: "user",
            name: "Jane Smith",
            content: "Just invested in an exciting new fintech startup. The future of finance is here!",
            likes: 34,
            comments: 8,
        },
    ])

    return (
        <Card className="md:col-span-3">
            <CardHeader>
                <CardTitle>Investment Feed</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Input placeholder="Share your thoughts..." />
                    <Button className="mt-2">Post</Button>
                </div>
                <ScrollArea className="h-[400px]">
                    {feed.map((item) => (
                        <Card key={item.id} className="mb-4">
                            <CardContent className="pt-6">
                                {item.type === "company" && <p className="font-semibold text-indigo-600">{item.name}</p>}
                                {item.type === "user" && <p className="font-semibold">{item.name}</p>}
                                {item.type === "news" && <p className="text-indigo-600 font-semibold">Breaking News</p>}
                                <p className="mt-1">{item.content}</p>
                                <div className="mt-2 flex items-center space-x-4">
                                    <Button variant="ghost" size="sm">
                                        Like ({item.likes})
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        Comment ({item.comments})
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

