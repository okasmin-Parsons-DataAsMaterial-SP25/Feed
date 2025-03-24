import * as d3 from "d3";

/**
 * Fetch NYC Open Data 311 Complaints
 * Fetch paginated data 1000 at a time
 * (NYC Open Data returns 1000 at a time by default)
 */
export const getData = async () => {
	// Get today's date
	const today = new Date();
	// get the date one week ago by subtracting 7 from today's date
	const oneWeekAgo = new Date();
	oneWeekAgo.setDate(today.getDate() - 7);

	// Format to "YYYY-MM-DDT00:00:00"
	const start = oneWeekAgo.toISOString().split("T")[0] + "T00:00:00";
	const end = oneWeekAgo.toISOString().split("T")[0] + "T23:59:59";

	const BASE_URL = `https://data.cityofnewyork.us/resource/erm2-nwe9.json`;
	const LIMIT = 1000; // records per request
	let offset = 0; // start at first record
	let allData = []; // store all results
	const WHERE_CLAUSE = `created_date between'${start}'and'${end}'`;

	let moreDataAvailable = true;

	while (moreDataAvailable) {
		const url = `${BASE_URL}?$limit=${LIMIT}&$offset=${offset}&$where=${encodeURIComponent(
			WHERE_CLAUSE
		)}`;
		// console.log(`Fetching: ${url}`);

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (data.length > 0) {
				allData = allData.concat(data); // append new data
				offset += LIMIT; // increment offset for next page
			} else {
				moreDataAvailable = false; // stop when no more records
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			moreDataAvailable = false; // stop if error
		}
	}

	return allData;
};

/**
 * Can use this function to examine all complaint types
 * and relevant descriptions for the data
 */
export const getComplaintTypes = (data) => {
	const types = [];
	const typesDescriptionMap = new Map();
	data.forEach((d) => {
		const type = d["complaint_type"];
		const descriptor = d["descriptor"];

		types.push(type);

		if (typesDescriptionMap.get(type) && descriptor) {
			const curr = typesDescriptionMap.get(type);
			typesDescriptionMap.set(type, curr.add(descriptor));
		} else {
			typesDescriptionMap.set(type, new Set([descriptor]));
		}
	});
	const uniqueTypes = new Set(types);

	console.log(typesDescriptionMap);
	console.log(uniqueTypes);

	return uniqueTypes;
};

/**
 * Return js Map with data grouped by hour, then minute, then second
 */
export const formatDataByHourAndMinuteAndSeconds = (data) => {
	return d3.group(
		data,
		(d) => {
			const date = new Date(d.created_date);
			const hour = date.getHours();
			return hour; // Group by hour
		},
		(d) => {
			const date = new Date(d.created_date);
			return date.getMinutes(); // Group by minute within each hour
		},
		(d) => {
			const date = new Date(d.created_date);
			return date.getSeconds(); // Group by seconds within each minute
		}
	);
};

/**
 * Return the highest count complaint type for the current hour
 */
export const getMajorityComplaintType = (data) => {
	const currentHour = new Date().getHours();

	const grouped = d3.rollup(
		data,
		(v) => v.length,
		(d) => {
			const date = new Date(d.created_date);
			const hour = date.getHours();
			if (hour === currentHour) {
				return hour; // Group by hour
			}
		},
		(d) => d["complaint_type"]
	);

	const currentHourData = grouped.get(currentHour);

	const sorted = Array.from(currentHourData).sort((a, b) => b[1] - a[1]);
	return {
		type: sorted[0][0],
		count: sorted[0][1],
	};
};

/**
 * Function to format the current hour for the info screen
 * courtesy chatgpt
 */
export function formatHourRange(hour) {
	const startHour = hour % 12 === 0 ? 12 : hour % 12;
	const endHourRaw = (hour + 1) % 24;
	const endHour = endHourRaw % 12 === 0 ? 12 : endHourRaw % 12;

	const startPeriod = hour < 12 || hour === 24 ? "am" : "pm";
	const endPeriod = endHourRaw < 12 || endHourRaw === 24 ? "am" : "pm";

	// If the end hour crosses from AM to PM or vice versa, show both
	if (startPeriod !== endPeriod) {
		return `${startHour}${startPeriod}-${endHour}${endPeriod}`;
	} else {
		return `${startHour}-${endHour}${startPeriod}`;
	}
}

// TODO
// format complaint type
// remove N/A
// if complaint === description then don't show descriptor

// TODO
// make sure current hour complaint type updates live in case have open when hour changes
// probably need to call on setInterval

// TODO
// function to check if need to re-fetch data (today doesn't make fetch data)

// COLORS
/* 
#792368, 
#443377,
#2c498b,
#14689c,
#0b7669,
#2a8842,
#a3bd3b,
#e9ab19,
#f68c1f,
#e45d25,
#df3527,
#c0223a
 */

const colors = [
	"#792368",
	"#443377",
	"#2c498b",
	"#14689c",
	"#0b7669",
	"#2a8842",
	"#a3bd3b",
	"#e9ab19",
	"#f68c1f",
	"#e45d25",
	"#df3527",
	"#c0223a",
];

export const getHourColor = (hour) => {
	if (hour < 12) {
		return colors[hour];
	} else {
		return colors[hour - 12];
	}
};

export const formatTime = (h, m, s) => {
	const hh = String(h).padStart(2, "0");
	const mm = String(m).padStart(2, "0");
	const ss = String(s).padStart(2, "0");

	return `${hh}:${mm}:${ss}`;
};
