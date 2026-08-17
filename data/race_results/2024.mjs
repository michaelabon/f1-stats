const year = 2024
let meetings = await (await fetch(`https://api.openf1.org/v1/meetings?year=${year}`)).json()

const replacements = [
	"Miami",
	"Monza",
	"Austin",
	"Las Vegas",
]

const results = []
for (const meeting of meetings) {
	const raceResults = await (await fetch(`./data/race_results/${year}-${meeting.meeting_key}.json`)).json()

	for (let raceResult of raceResults.results) {
		results.push({
			meeting_key: "" + raceResults.meeting_key,
			// if replacements contains meeting.circuit_short_name, use meeting.circuit_short_name, else use meeting.country_name
			meeting_name: replacements.includes(meeting.circuit_short_name) ? meeting.circuit_short_name : meeting.country_name,
			points: +raceResult.points,
			driver_name: `${raceResult.driver_first_name} ${raceResult.driver_last_name}`,
		})
	}
}

console.log("results", results)

export {results}
