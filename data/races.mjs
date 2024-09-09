let previousRaces = await fetch("https://api.openf1.org/v1/meetings?date_start%3E=2023-01-01").then(r => r.json())


export {previousRaces as races}
