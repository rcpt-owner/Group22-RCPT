import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

const tags = [
	"Full-Time Developer",
	"Part-Time Designer",
	"Contract Engineer",
	"Freelance Analyst",
	"Intern Developer",
]

export function ScrollAreaDemo() {
	return (
		<ScrollArea className="h-40 w-48 rounded-md border">
			<div className="p-4">
				<h4 className="mb-4 text-sm leading-none font-medium">EMPLOYMENT TYPE</h4>
				{tags.map((tag, index) => (
					<React.Fragment key={tag}>
						<div className="flex items-center gap-2">
							<Checkbox id={`tag-checkbox-${index}`} />
							<div className="text-sm">{tag}</div>
						</div>
						<Separator className="my-2" />
					</React.Fragment>
				))}
			</div>
		</ScrollArea>
	)
}
