import "./style.css";
import * as d3 from "d3";

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
console.log("all data");
console.log(data);

const formatDataByHour = () => {
	return d3.group(
		data,
		(d) => {
			const date = new Date(d.created_date);
			const hour = date.getHours();
			return hour; // Group by hour
		}
		// (d) => d["complaint_type"]
	);
};

const groupedByHour = formatDataByHour();
// console.log("data grouped by hour ");
// console.log(groupedByHour);

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
console.log("data grouped by hour and then minute");
console.log(groupedByHourAndMinute);

const intro = d3.select("#intro");
intro
	.append("h1")
	.text("Feed Assignment - Prototype")
	.style("color", "rgba(0,255,255,0.5");

// intro.append("p").text("Today's date is " + new Date());

const minutesDiv = d3.select("#minutes");
const renderCurrentMinute = () => {
	minutesDiv.selectAll("*").remove();
	minutesDiv.append("h1").text("minutes");

	const date = new Date();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	// TODO maybe render in order or sseconds?
	// const seconds = date.getSeconds();

	// get data for current minute
	const hourData = groupedByHourAndMinute.get(hours);
	const minuteData = hourData.get(minutes);

	minutesDiv.append("div").text(`${hours}:${minutes}`);
	minuteData.forEach((data) => {
		minutesDiv.append("li").text(`${data.complaint_type}: ${data.descriptor}`);
	});
};

// show data for current minute and rerun fuction each second so it updates with each minute
renderCurrentMinute();
setInterval(renderCurrentMinute, 1000);

const addPercentage = (data) => {
	let total = 0;
	data.forEach((d) => (total += Number(d[1])));
	const withPercent = data.map((d) => {
		const percent = Number(d[1]) / Number(total);
		return [...d, percent];
	});
	// console.log(withPercent);
	return withPercent;
};

const sumComplaintTypes = (data) => {
	const grouped = d3.rollup(
		data,
		(v) => v.length,
		(d) => d["complaint_type"]
	);

	const sorted = Array.from(grouped).sort((a, b) => b[1] - a[1]);
	return addPercentage(sorted);
};

const getBucketData = (offset) => {
	const bucketArr = [];
	for (let i = offset; i < offset + 4; i++) {
		const hourData = groupedByHour.get(i);
		bucketArr.push(...hourData);
	}

	return sumComplaintTypes(bucketArr);
};

const quizDiv = d3.select("#quiz");
const renderHourBuckets = () => {
	quizDiv.append("h1").text("quiz");

	// put data into 4 hr buckets
	const buckets = [];
	let offset = 0;
	for (let i = 0; i < 6; i++) {
		buckets.push(getBucketData(offset));
		offset += 4;
	}

	// render data for each bucket
	let offset2 = 0;
	for (let i = 0; i < buckets.length; i++) {
		quizDiv.append("h4").text(`${offset2} - ${offset2 + 4}hrs`);
		buckets[i].slice(0, 4).forEach((data) => {
			quizDiv
				.append("li")
				.text(`${data[0]}: ${data[1]} (%${Math.round(data[2] * 100)})`);
		});
		offset2 += 4;
	}

	console.log("quiz buckets");
	console.log(buckets);
};

renderHourBuckets();
