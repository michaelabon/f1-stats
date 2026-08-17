import xray from "x-ray" // https://github.com/matthewmueller/x-ray
import { promises as fs } from "fs"

const x = xray({
})

const year = 2024

let meetings = await (await fetch(`https://api.openf1.org/v1/meetings?year=${year}`)).json()
const replacements = [{from: "Miami", to: "Miami"}, {from: "Las Vegas", to: "Miami"}, {from: "Imola", to: "Emilia-Romagna"}]
meetings = meetings.map((m) => {
	let replacement = replacements.find(r => r.from === m.location)
		let slug = replacement ? replacement.to : m.country_name
	return {
		meeting_key: m.meeting_key,
		slug: slug.toLowerCase().replaceAll(" ", "-"),
	}
})


const doWork = async (year, meeting_key, name) => {
	const url = `https://www.formula1.com/en/results/${year}/races/${meeting_key}/${name}/race-result`


	const raceResults = await x(url, ".f1-table tbody tr", [{
		position: "td:nth-child(1)",
		driver_number: "td:nth-child(2)",
		driver_first_name: "td:nth-child(3) span:nth-child(1)",
		driver_last_name: "td:nth-child(3) span:nth-child(2)",
		constructor: "td:nth-child(4)",
		laps: "td:nth-child(5)",
		time: "td:nth-child(6)",
		points: "td:nth-child(7)",
	}])
	const results = {
		results: raceResults,
		year,
		meeting_key,
		name,
	}

	await fs.writeFile(
	`data/race_results/${year}-${meeting_key}.json`,
		JSON.stringify(results, null, 2),
	)
}


for (const meeting of meetings) {
	await doWork(year, meeting.meeting_key, meeting.slug)
}
