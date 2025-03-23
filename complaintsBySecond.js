import "./style.css";
import * as d3 from "d3";

/**
 * Return js Map with data grouped by hour, then minute, then second
 */
const formatDataByHourAndMinuteAndSeconds = (data) => {
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
 * Helper functions to determine placement of each complaint
 */
// TODO define rect size of each complaint and update buffer to take width & height into account
// TODO may want to limit to parent div rect rather than entire width/height of browser
const placementDims = {
	width: window.innerWidth,
	height: window.innerHeight,
	buffer: 200,
	margins: {
		width: 200,
		height: 200,
	},
};

const pastPlacements = []; // store last 10 positions

// check overlap
function isOverlapping(x, y) {
	return pastPlacements.some(([px, py]) => {
		return (
			Math.abs(px - x) < placementDims.buffer &&
			Math.abs(py - y) < placementDims.buffer
		);
	});
}

// get a non-overlapping random position
function getNonOverlappingPosition() {
	let x, y;
	let attempts = 0;
	do {
		x = Math.floor(
			Math.random() * (placementDims.width - placementDims.margins.width)
		);
		y = Math.floor(
			Math.random() * (placementDims.height - placementDims.margins.height)
		);
		attempts++;
		if (attempts > 100) break; // avoid infinite loops
	} while (isOverlapping(x, y));

	// add new placement and remove first placement in array if more than 10 in array
	pastPlacements.push([x, y]);
	if (pastPlacements.length > 10) pastPlacements.shift();

	return { x, y };
}

/**
 * Render 311 complaints
 * complaints start rendering when the app is opened and continue to accumulate
 * complaints are rendered when their timestamp second matches the actual current time (to the second)
 */
export const renderComplaintsBySecond = (data) => {
	const groupedByHourAndMinuteAndSeconds =
		formatDataByHourAndMinuteAndSeconds(data);

	const secondssDiv = d3.select("#seconds");
	const renderCurrentSecond = () => {
		const date = new Date();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();

		// get data for current time
		const hourData = groupedByHourAndMinuteAndSeconds.get(hours);
		const minuteData = hourData.get(minutes);
		const secondData = minuteData.get(seconds);

		// TODO refactor this to join data with p using d3 instead of using forEach
		secondData &&
			secondData.forEach((data) => {
				const { x, y } = getNonOverlappingPosition();

				secondssDiv
					.append("p")
					.html(
						`${hours}:${minutes}:${seconds}<br><strong>${data.complaint_type}</strong><br>${data.descriptor}`
					)
					.attr("class", "complaint")
					.style("position", "absolute")
					.style("left", `${x}px`)
					.style("top", `${y}px`);
					
					// this code changes the font of the complaints every second, I still need to figure out how to make it keep the font for already rendered complaints
					const fonts = [
						'"Permanent Marker", cursive',
						'"Just Me Again Down Here", cursive'
					  ];
					  
					  // Select all divs with class 'complaint'
					  const complaints = document.querySelectorAll('.complaint');
					  
					  const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
					  secondssDiv.style("font-family", randomFont);
			});
	};

	// show data for current minute and rerun fuction each second so it updates with each minute
	renderCurrentSecond();
	setInterval(renderCurrentSecond, 1000);
};
