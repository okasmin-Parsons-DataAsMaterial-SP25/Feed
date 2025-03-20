/**
 * Fetch NYC Open Data 311 Complaints
 * Fetch paginated data 1000 at a time
 * (NYC Open Data returns 1000 at a time by default)
 */
export const getData = async (start, end) => {
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
