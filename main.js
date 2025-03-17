import "./style.css";
import * as d3 from "d3";

const app = d3.select("#app");

// Get today's date
const today = new Date();
const currentMinute = today.getMinutes();

// get the day before yesterday's date by subtracting 2 from today's date
const previousDay = new Date();
previousDay.setDate(today.getDate() - 2);

// Format to "YYYY-MM-DDT00:00:00"
const formattedPreviousDayStart =
	previousDay.toISOString().split("T")[0] + "T00:00:00";
const formattedPreviousDayEnd =
	previousDay.toISOString().split("T")[0] + "T23:59:59";

// Fetch paginated data - NYC Open Data returns 1000 at a time by default
const getData = async () => {
	const BASE_URL = `https://data.cityofnewyork.us/resource/erm2-nwe9.json`;
	const LIMIT = 1000; // records per request
	let offset = 0; // start at first record
	let allData = []; // store all results
	const WHERE_CLAUSE = `created_date between'${formattedPreviousDayStart}'and'${formattedPreviousDayEnd}'`;

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

const data = await getData();
// console.log(data);

const formatDataByHour = () => {
	return d3.group(
		data,
		(d) => {
			const date = new Date(d.created_date);
			const hour = date.getHours();
			return hour; // Group by hour
		},
		(d) => d["complaint_type"]
	);
};

const groupedByHour = formatDataByHour();
console.log(groupedByHour);

const formatDataByHourAndMinute = () => {
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
		}
	);
};

const groupedByHourAndMinute = formatDataByHourAndMinute();
console.log(groupedByHourAndMinute);

app
	.append("h1") // this adds an h1 tag to the html
	.text("Feed Assignment - Minutes") // this adds the following text to the above h1 tag
	.style("color", "rgba(0,255,255,0.5"); // call the attribute "color", and then state what you're changing it to (0.5 is transparency)

app.append("p").text("Today's date is " + new Date());

// use setInterval to fetch data each new day

// use setInterval to update data displayed each minute
