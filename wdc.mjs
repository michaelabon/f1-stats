import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm"

import {results as results2024} from "./data/race_results/2024.mjs"

import {add} from "https://cdn.jsdelivr.net/npm/date-fns/add.mjs"


const drivers = {
	"Pierre Gasly": {
		team: "Alpine",
		color: "#0093cc",
	},
	"Esteban Ocon": {
		team: "Alpine",
		color: "#0093cc",
		dashed: true,
	},
	"Charles Leclerc": {
		team: "Ferrari",
		color: "#E80020",
	},
	"Carlos Sainz": {
		team: "Ferrari",
		color: "#E80020",
		dashed: true,
	},
	"Max Verstappen": {
		team: "Red Bull Racing",
		color: "#3671C6",
	},
	"Sergio Perez": {
		team: "Red Bull Racing",
		color: "#3671C6",
		dashed: true,
	},
	"Alexander Albon": {
		team: "Williams",
		color: "#64C4FF",
	},
	"Logan Sargeant": {
		team: "Williams",
		color: "#64C4FF",
		dashed: true,
	},
	"Franco Colapinto": {
		team: "Williams",
		color: "#64C4FF",
		dashed: true,
	},
	"Yuki Tsunoda": {
		team: "RB",
		color: "#6692FF",
	},
	"Daniel Ricciardo": {
		team: "RB",
		color: "#6692FF",
		dashed: true,
	},
	"Fernando Alonso": {
		team: "Aston Martin",
		color: "#229971",
	},
	"Lance Stroll": {
		team: "Aston Martin",
		color: "#229971",
		dashed: true,
	},
	"Valtteri Bottas": {
		team: "Kick Sauber",
		color: "#52E252",
	},
	"Zhou Guanyu": {
		team: "Kick Sauber",
		color: "#52E252",
		dashed: true,
	},
	"Guanyu Zhou": {
		team: "Kick Sauber",
		color: "#52E252",
		dashed: true,
	},
	"Nico Hulkenberg": {
		team: "Haas",
		color: "#B6BABD",
	},
	"Kevin Magnussen": {
		team: "Haas",
		color: "#B6BABD",
		dashed: true,
	},
	"Oliver Bearman": {
		team: "Haas",
		color: "#B6BABD",
		dashed: true,
	},
	"Lewis Hamilton": {
		team: "Mercedes",
		color: "#6CD3BF",
	},
	"George Russell": {
		team: "Mercedes",
		color: "#6CD3BF",
		dashed: true,
	},
	"Lando Norris": {
		team: "McLaren",
		color: "#FF8000",
	},
	"Oscar Piastri": {
		team: "McLaren",
		color: "#FF8000",
		dashed: true,
	},
}


const updateSessions = async () => {
	const form = document.getElementById("year")
	// get value from input name="year"
	const year = form.year.value

	const $sessions = fetch(`https://api.openf1.org/v1/sessions?year=${year}&session_name=Race`)
	const sessions = await (await $sessions).json()

	const sessionsEl = document.getElementById("sessions")
	sessionsEl.innerHTML = ""
	for (let session of sessions) {
		const sessionEl = document.createElement("option")
		sessionEl.value = session.session_key
		sessionEl.innerText = session.circuit_short_name
		sessionsEl.appendChild(sessionEl)
	}
}

const fetchAndUpdateRaceResults = async (session_key) => {
	const $laps = fetch(`https://api.openf1.org/v1/laps?session_key=${session_key}`)
	const laps = await (await $laps).json()

	updateRaceTable(laps)
}

const updateRaceTable = (laps) => {
	let bestLaps = Object.values(laps.reduce((acc, curr) => {
		let latest = acc[curr.driver_number] || {}
		if (!latest.lap_number || curr.lap_number > latest.lap_number) {
			acc[curr.driver_number] = curr
		}
		return acc
	}, {}))

	bestLaps = bestLaps.sort((a, b) => {
		if (a.lap_number - b.lap_number !== 0) {
			return b.lap_number - a.lap_number
		}
		const aEnd = add(new Date(a.date_start), {seconds: a.lap_duration})
		const bEnd = add(new Date(b.date_start), {seconds: b.lap_duration})
		return aEnd - bEnd
	})

	const plot = document.getElementById("plot")

	const table = document.createElement("table")
	table.innerHTML = ''
	const thead = document.createElement("thead")
	const tr = document.createElement("tr")
	const thPos = document.createElement("th")
	thPos.innerText = "Pos"
	tr.appendChild(thPos)
	const thDriver = document.createElement("th")
	thDriver.innerText = "Driver"
	tr.appendChild(thDriver)
	const thLaps = document.createElement("th")
	thLaps.innerText = "Laps"
	tr.appendChild(thLaps)
	const thEnd = document.createElement("th")
	thEnd.innerText = "End"
	tr.appendChild(thEnd)
	thead.appendChild(tr)
	table.appendChild(thead)

	bestLaps.forEach((bestLap, i) => {
		const tr = document.createElement("tr")

		const pos = document.createElement("td")
		pos.innerText = i + 1
		tr.appendChild(pos)

		const driver = document.createElement("td")
		driver.innerText = bestLap.driver_number
		tr.appendChild(driver)

		const laps = document.createElement("td")
		laps.innerText = bestLap.lap_number
		tr.appendChild(laps)

		const end = document.createElement("td")
		end.innerText = add(new Date(bestLap.date_start), {seconds: bestLap.lap_duration})
		tr.appendChild(end)

		table.appendChild(tr)
	})
	plot.appendChild(table)

}


document.addEventListener("DOMContentLoaded", async () => {
	await updateSessions()
})

document.getElementById("sessions").addEventListener("change", async (evt) => {
	const session_key = evt.target.value
	await fetchAndUpdateRaceResults(session_key)
})

let cumulativePoints =  {}


const data = results2024.map((d) => {
	const driver = drivers[d.driver_name]
	if (!driver) {
		console.error("No driver found for", d.driver_name)
	}

	let points = cumulativePoints[d.driver_name] ? cumulativePoints[d.driver_name] + d.points : d.points
	cumulativePoints[d.driver_name] = points

	return ({
		...d,
		points,
		color: driver.color,
		dashed: !!driver.dashed,
	});
})

console.log("data", data)

const plot = Plot.plot({
	width: 1600,
	height: 800,
	margin: 70,
	marginRight: 200,
	y: {
		grid: true,
		label: "Driver points",
		type: "pow",
		exponent: 1/2,
	},
	x: {
		domain:
				Object.entries(data.reduce((acc, curr) => {
					acc[curr.meeting_key] = curr.meeting_name
					return acc
				}, {})).sort((a, b) => a[0] - b[0]).map((d) => d[1]),

	},

	marks: [
		Plot.ruleY([0]),
		Plot.lineY(data.filter((d) => d.dashed), {
			x: "meeting_name",
			y: "points",
			z: "driver_name",
			stroke: "color",
			strokeDasharray: "2 8 2",
		}),
		Plot.lineY(data.filter((d) => !d.dashed), {x: "meeting_name", y: "points", z: "driver_name", stroke: "color"}),
		Plot.text(
			data,
				Plot.selectLast({
					x: "meeting_name",
					y: "points",
					z: "driver_name",
					dy: -6,
					dx: 4,
					text: "driver_name",
					textAnchor: "start",
				}),
		),
		Plot.dot(data, Plot.pointer({x: "meeting_name", y: "points", z: "driver_name", stroke: "color", fill: "white", r:8})),
		Plot.tip(data, Plot.pointer({x: "meeting_name", y: "points", z: "driver_name", title: (d) => [d.driver_name, d.points].join("\n\n")})),

	]
})

document.getElementById("plot").append(plot)
