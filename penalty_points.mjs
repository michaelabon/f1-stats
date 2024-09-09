import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";
import {add} from "https://cdn.jsdelivr.net/npm/date-fns/add.mjs";

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

let drivers = {
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


const rawData = [



    {
        driver: "Daniel Ricciardo",
        points: 2,
        date_added: "2024-04-21",
        reason: "Overtaking Nico Hulkenburg under safety car at the 2024 Chinese Grand Prix",
    },
    {
        driver: "Daniel Ricciardo",
        points: 1,
        date_added: "2024-09-01",
        reason: "Forcing Nico Hulkenberg off track at the 2024 Italian Grand Prix",
    },

    {
        driver: "Esteban Ocon",
        points: 1,
        date_added: "2024-05-04",
        reason: "Unsafe release during the 2024 Miami Grand Prix Sprint",
    },
    {

        driver: "Esteban Ocon",
        points: 2,
        date_added: "2024-05-26",
        reason: "Collision with Pierre Gasly during the 2024 Monaco Grand Prix",
    },

    {
        driver: "George Russell",
        points: 2,
        date_added: "2023-11-19",
        reason: "Collision with Max Verstappen at the 2023 Las Vegas Grand Prix",
    },

    {
        driver: "Valtteri Bottas",
        points: 2,
        date_added: "2023-10-29",
        reason: "Collision with Lance Stroll at the 2023 Mexican Grand Prix",
    },

    {
        driver: "Carlos Sainz",
        points: 1,
        date_added: "2024-05-05",
        reason: "causing a collision with Oscar Piastri during the 2024 Miami Grand Prix",
    },

    {
        "driver": "Max Verstappen",
        "points": 2,
        "date_added": "2023-11-19",
        "reason": "Collision with George Russell at the 2023 Las Vegas Grand Prix",
    },
    {
        "driver": "Max Verstappen",
        "points": 2,
        "date_added": "2024-06-30",
        "reason": "Collision with Lando Norris at the 2024 Austrian Grand Prix",
    },

    {
        "driver": "Nico Hulkenberg",
        "points": 2,
        "date_added": "2024-06-30",
        "reason": "Collision with Fernando Alonso at the 2024 Austrian Grand Prix",
    },
    {
        "driver": "Nico Hulkenberg",
        "points": 2,
        "date_added": "2024-09-01",
        "reason": "Collision with Yuki Tsunoda at the 2024 Italian Grand Prix",
    },

    {
        "driver": "Lance Stroll",
        "points": 3,
        "date_added": "2023-11-17",
        "reason": "Overtaking under yellow flags at the 2023 Las Vegas Grand Prix",
    },
    {
        "driver": "Lance Stroll",
        "points": 2,
        "date_added": "2024-04-21",
        "reason": "Collision with Daniel Ricciardo at the 2024 Chinese Grand Prix",
    },

    {
        "driver": "Sergio Perez",
        "points": 1,
        "date_added": "2023-09-17",
        "reason": "Causing a collision with Alex Albon at the 2023 Singapore Grand Prix",
    },
    {
        "driver": "Sergio Perez",
        "points": 2,
        "date_added": "2023-09-24",
        "reason": "Overtaking Fernando Alonso under Safety Car conditions at the 2023 Japanese Grand Prix",
    },
    {
        "driver": "Sergio Perez",
        "points": 2,
        "date_added": "2023-09-24",
        "reason": "Causing a collision with Kevin Magnussen at the 2023 Japanese Grand Prix",
    },
    {
        "driver": "Sergio Perez",
        "points": 2,
        "date_added": "2023-11-26",
        "reason": "Causing a collision with Lando Norris at the 2023 Abu Dhabi Grand Prix",
    },
    {
        "driver": "Sergio Perez",
        "points": 2,
        "date_added": "2024-03-09",
        "reason": "Unsafe release during the 2024 Saudi Arabian Grand Prix",
    },


    {
        "driver": "Fernando Alonso",
        "points": 3,
        "date_added": "2024-03-24",
        "reason": "Potentially dangerous driving against George Russell at the 2024 Australian Grand Prix",
    },
    {
        "driver": "Fernando Alonso",
        "points": 3,
        "date_added": "2024-04-20",
        "reason": "Causing a collision with Carlos Sainz at the 2024 Chinese Grand Prix Sprint",
    },
    {
        "driver": "Fernando Alonso",
        "points": 2,
        "date_added": "2024-06-30",
        "reason": "Collision with Zhou Guanyu at the 2024 Austrian Grand Prix",
    },

    {
        "driver": "Kevin Magnussen",
        "points": 3,
        "date_added": "2024-03-09",
        "date_expired": "2024-09-02",
        "reason": "Causing a collision with Alex Albon during the 2024 Saudi Arabian Grand Prix",
    },
    {
        "driver": "Kevin Magnussen",
        "points": 2,
        "date_added": "2024-04-21",
        "date_expired": "2024-09-02",
        "reason": "Causing a collision with Yuji Tsunoda at the 2024 Chinese Grand Prix",
    }
    ,
    {
        "driver": "Kevin Magnussen",
        "points": 3,
        "date_added": "2024-05-04",
        "date_expired": "2024-09-02",
        "reason": "Leaving the track and gaining an advantage on multiple occasions during the 2024 Miami Grand Prix Sprint",
    },
    {
        "driver": "Kevin Magnussen",
        "points": 2,
        "date_added": "2024-05-05",
        "date_expired": "2024-09-02",
        "reason": "Causing a collision with Logan Sargent during the 2024 Miami Grand Prix",
    },
    {
        "driver": "Kevin Magnussen",
        "points": 2,
        "date_added": "2024-09-01",
        "date_expired": "2024-09-02",
        "reason": "Causing a collision with Pierre Gasly during the 2024 Italian Grand Prix",
    }
]

// verify that each driver in rawData exists in drivers
rawData.forEach(d => {
    if (!drivers[d.driver]) {
        alert(`Driver ${d.driver} not found in drivers`)
    }
})

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
rawData.forEach(d => {
    pointsPerDriver[d.driver] = 0
})
let data = []
relativeData.forEach(d => {
    pointsPerDriver[d.driver] += d.points
    data.push({...d, points: pointsPerDriver[d.driver]})
})


const plot = Plot.plot({
    title: "Penalty points for Formula 1 drivers",
    width: 1200,
    marginTop: 70,
    x: {
        // only show +/- 1 year from today
        domain: [add(new Date(), {days: -370}), add(new Date(), {days: 370})],
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
            marker: true,
            strokeDasharray: "6",
            channels: {reason: "reason"},
        }),
        Plot.lineY(data.filter(d => !d.dashed), {
            x: "date",
            y: "points",
            z: "driver",
            marker: true,
            stroke: "color",
        }),
        Plot.text(data, Plot.selectMaxY({
            x: "date",
            y: "points",
            z: "driver",
            text: "driver",
            textAnchor: "start",
            dy: -10,
            rotate: -30,
        })),
        Plot.ruleX([new Date()], {
            stroke: "red",
            strokeWidth: 2,
        }),
    ],
})

const destination = document.getElementById("plot")
destination.append(plot);
