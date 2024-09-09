import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {add} from "https://cdn.jsdelivr.net/npm/date-fns/add.mjs";
import {races} from "./data/races.mjs";

const teams = {
    "Ferrari": {color: "E80020"},
    "Red Bull Racing": {color: "3671C6"},
    "Mercedes": {color: "6CD3BF"},
    "McLaren": {color: "FF8000"},
    "Haas": {color: "B6BABD"},
    "Aston Martin": {color: "229971"},
    "RB": {color: "6692FF"},
    "Alpine": {color: "0093cc"},
    "Williams": {color: "64C4FF"},
    "Kick Sauber": {color: "52E252"},
}

const drivers = {
    "Pierre Gasly": {
        "team": "Alpine",
        "color": "#0093cc"
    },
    "Esteban Ocon": {
        "team": "Alpine",
        "color": "#0093cc",
        "dashed": true,
    },
    "Charles Leclerc": {
        "team": "Ferrari",
        "color": "#E80020"
    },
    "Carlos Sainz": {
        "team": "Ferrari",
        "color": "#E80020"
        , "dashed": true,
    },
    "Max Verstappen": {
        "team": "Red Bull Racing",
        "color": "#3671C6"
    },
    "Sergio Perez": {
        "team": "Red Bull Racing",
        "color": "#3671C6"
        , "dashed": true,
    },
    "Alexander Albon": {
        "team": "Williams",
        "color": "#64C4FF"
    },
    "Logan Sargeant": {
        "team": "Williams",
        "color": "#64C4FF"
        , "dashed": true,
    },
    "Yuki Tsunoda": {
        "team": "RB",
        "color": "#6692FF"
    },
    "Daniel Ricciardo": {
        "team": "RB",
        "color": "#6692FF", "dashed": true,
    },
    "Fernando Alonso": {
        "team": "Aston Martin",
        "color": "#229971"
    },
    "Lance Stroll": {
        "team": "Aston Martin",
        "color": "#229971", "dashed": true,
    },
    "Valtteri Bottas": {
        "team": "Kick Sauber",
        "color": "#52E252"
    },
    "Guanyu Zhou": {
        "team": "Kick Sauber",
        "color": "#52E252", "dashed": true,
    },
    "Nico Hulkenberg": {
        "team": "Haas",
        "color": "#B6BABD"
    },
    "Kevin Magnussen": {
        "team": "Haas",
        "color": "#B6BABD", "dashed": true,
    },
    "Lewis Hamilton": {
        "team": "Mercedes",
        "color": "#6CD3BF"
    },
    "George Russell": {
        "team": "Mercedes",
        "color": "#6CD3BF", "dashed": true,
    },
    "Lando Norris": {
        "team": "McLaren",
        "color": "#FF8000"
    },
    "Oscar Piastri": {
        "team": "McLaren",
        "color": "#FF8000", "dashed": true,
    }
}

const rawData = await d3.csv("penalty_points.csv", d3.autoType)

// verify that each driver in rawData exists in drivers
for (const d of rawData) {
    if (!drivers[d.driver]) {
        alert(`Driver ${d.driver} not found in drivers`)
    }
}

// Every entry adds points to a driver, and removes the same number of points a year later
// The default expiry date is one year after the entry date
const relativeData = rawData.flatMap(d => ([
    {
        driver: d.driver,
        points: d.points,
        date: new Date(d.date_added),
        color: drivers[d.driver].color,
        dashed: !!drivers[d.driver].dashed,
    },
    {
        driver: d.driver,
        points: -d.points,
        date: d.date_expired ? new Date(d.date_expired) : add(new Date(d.date_added), {years: 1}),
        color: drivers[d.driver].color,
        dashed: !!drivers[d.driver].dashed,
    }
])).sort((a, b) => a.date - b.date)

// Calculate the total points for each driver at each date
const pointsPerDriver = {}
for (const d of rawData) {
    pointsPerDriver[d.driver] = 0
}
const data = []
for (const d of relativeData) {
    pointsPerDriver[d.driver] += d.points
    data.push({...d, points: pointsPerDriver[d.driver]})
}



const numDays = 370
let minX = add(new Date(), {days: -numDays});
let maxX = add(new Date(), {days: numDays});

const plot = Plot.plot({
    title: "Penalty points for Formula 1 drivers",
    width: 1200,
    marginTop: 70,
    marginBottom: 120,
    x: {
        domain: [minX, maxX], // only show +/- 1 year from today
        grid: true,
    },
    y: {
        grid: true,
        label: "Penalty points",
        tickFormat: "0.0f",
        domain: [0, 12],
    },
    marks: [
        Plot.ruleY([0, 12]),
        Plot.lineY(data.filter(d => d.dashed), {
            x: "date",
            y: "points",
            z: "driver",
            stroke: "color",
            marker: "tick",
            strokeDasharray: "6",
            channels: {reason: "reason"},
        }),
        Plot.lineY(data.filter(d => !d.dashed), {
            x: "date",
            y: "points",
            z: "driver",
            marker: "circle",
            stroke: "color",
        }),
        Plot.text(data, Plot.selectMaxY({
            x: "date",
            y: "points",
            z: "driver",
            filter: (d) => d.date > minX,
            text: "driver",
            textAnchor: "start",
            dy: -10,
            rotate: -30,
        })),
        Plot.ruleX([new Date()], {
            stroke: "red",
            strokeWidth: 2,
        }),
        Plot.text(races, {
            x: "date_start",
            y: 0,
            filter: (d) => new Date(d.date_start) > minX,
            text: "country_name",
            textAnchor: "end",
            dy: 30,
            rotate: -60,
        })
    ],
})

const destination = document.getElementById("plot")
destination.append(plot);
