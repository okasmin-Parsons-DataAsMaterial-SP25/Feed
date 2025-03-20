// Prototype code for Quiz idea

// Fetch paginated data - NYC Open Data returns 1000 at a time by default
// get the day before yesterday's date by subtracting 7 from today's date
const oneWeekAgo = new Date();
oneWeekAgo.setDate(today.getDate() - 7);

// Format to "YYYY-MM-DDT00:00:00"
const formattedOneWeekAgoStart =
	oneWeekAgo.toISOString().split("T")[0] + "T00:00:00";
const formattedOneWeekAgoEnd =
	oneWeekAgo.toISOString().split("T")[0] + "T23:59:59";

const getData = async () => {
	const BASE_URL = `https://data.cityofnewyork.us/resource/erm2-nwe9.json`;
	const LIMIT = 1000; // records per request
	let offset = 0; // start at first record
	let allData = []; // store all results
	const WHERE_CLAUSE = `created_date between'${formattedOneWeekAgoStart}'and'${formattedOneWeekAgoEnd}'`;

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
