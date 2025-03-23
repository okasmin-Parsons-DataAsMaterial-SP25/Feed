import "./style.css";
import * as d3 from "d3";
import {
	formatDataByHourAndMinuteAndSeconds,
	getMajorityComplaintType,
	getHourColor,
} from "./utils";

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

	const majorityType = getMajorityComplaintType(data).type;

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

		const bubbleImages = [
			"bubble1.svg",
			"bubble2.svg",
			"bubble3.svg",
			"bubble4.svg",
			"bubble5.svg",
		];

		const getImageSrc = (borough) => {
			if (borough === "MANHATTAN") {
				return bubbleImages[0];
			} else if (borough === "BROOKLYN") {
				return bubbleImages[1];
			} else if (borough === "BRONX") {
				return bubbleImages[2];
			} else if (borough === "QUEENS") {
				return bubbleImages[3];
			} else if (borough === "STATEN ISLAND") {
				return bubbleImages[4];
			} else {
				return bubbleImages[Math.floor(Math.random() * bubbleImages.length)];
			}
		};

		// TODO refactor this to join data with p using d3 instead of using forEach
		secondData &&
			secondData.forEach((data) => {
				const { x, y } = getNonOverlappingPosition();

				// Center X
				secondssDiv
					.append("div")
					.text("X")
					.style("position", "absolute")
					.style("left", `${x}px`)
					.style("top", `${y}px`);

				const scale = 0.5;

				const imageWidth = 1000 * scale;
				const imageHeight = 700 * scale;

				secondssDiv
					.append("img")
					.attr("src", getImageSrc(data.borough))
					.attr("class", "bubble")
					.style("position", "absolute")
					.style("left", `${x - imageWidth / 2}px`)
					.style("top", `${y - imageHeight / 2}px`)
					.style("width", `${imageWidth}px`)
					.style("height", `${imageHeight}px`);

				const textWidth = 400 * scale;
				const textHeight = 200 * scale;

				const newComplaint = secondssDiv
					.append("p")
					.html(
						`${hours}:${minutes}:${seconds}<br>${data.complaint_type}<br>${data.descriptor}<br>${data.incident_zip}`
					)
					.attr("class", "complaint")
					.style("position", "absolute")
					.style("left", `${x - textWidth / 2}px`)
					.style("top", `${y - textHeight / 2 - 20}px`)
					.style("width", `${textWidth}px`)
					.style("height", `${textHeight}px`)
					.style("font-size", "14pt");

				if (data.complaint_type === majorityType) {
					newComplaint.style("color", getHourColor(hours));
				}

				// this code changes the font of the complaints every second, I still need to figure out how to make it keep the font for already rendered complaints
				const fonts = [
					'"Permanent Marker", cursive',
					'"Just Me Again Down Here", cursive',
					'"Caveat", cursive',
					'"Reenie Beanie", cursive',
					'"Mansalva", sans-serif'
				];

				// Select all divs with class 'complaint'
				// const complaints = document.querySelectorAll(".complaint");

				// const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
				// secondssDiv.style("font-family", randomFont);
			});
	};

	const secondssSvg = d3
		.select("body")
		.append("svg")
		.attr("id", "secondss-svg")
		.attr("width", window.innerWidth)
		.attr("height", window.innerHeight);

	// initial render
	renderCurrentSecond();

	// update every second
	setInterval(renderCurrentSecond, 1000);
};
