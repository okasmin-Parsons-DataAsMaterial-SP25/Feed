import "./style.css";
import * as d3 from "d3";
import {
	formatDataByHourAndMinuteAndSeconds,
	getMajorityComplaintType,
	getHourColor,
	formatTime,
} from "./utils";

/**
 * Helper functions to determine placement of each complaint
 */
const placementDims = {
	width: window.innerWidth,
	height: window.innerHeight,
	buffer: 300,
	margins: {
		width: 200,
		height: 200,
	},
};

const scale = 0.5;

const imageWidth = 1000 * scale;
const imageHeight = 700 * scale;

const textWidth = 400 * scale;
const textHeight = 200 * scale;

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
		x =
			Math.floor(
				Math.random() * (placementDims.width - placementDims.margins.width)
			) +
			imageWidth / 2;
		y =
			Math.floor(
				Math.random() * (placementDims.height - placementDims.margins.height)
			) +
			imageHeight / 2;
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

		// this code changes the font of the complaints every second, I still need to figure out how to make it keep the font for already rendered complaints
		const fonts = [
			'"Permanent Marker", cursive',
			'"Just Me Again Down Here", cursive',
			'"Caveat", cursive',
			'"Reenie Beanie", cursive',
			'"Mansalva", sans-serif',
		];

		const addFonts = (borough) => {
			switch (borough) {
				case "MANHATTAN":
					return fonts[2]; // Caveat
				case "BROOKLYN":
					return fonts[0]; // Permanent Marker
				case "BRONX":
					return fonts[4]; // Mansalva
				case "QUEENS":
					return fonts[1]; // Just Me Again Down Here
				case "STATEN ISLAND":
					return fonts[3]; // Reenie Beanie
				default:
					return "Arial, sans-serif"; // Fallback font
			}
		};

		// TODO refactor this to join data with p using d3 instead of using forEach
		secondData &&
			secondData.forEach((data) => {
				const { x, y } = getNonOverlappingPosition();

				secondssDiv
					.append("img")
					.attr("src", getImageSrc(data.borough))
					.attr("class", "bubble")
					.style("position", "absolute")
					.style("left", `${x - imageWidth / 2}px`)
					.style("top", `${y - imageHeight / 2}px`)
					.style("width", `${imageWidth}px`)
					.style("height", `${imageHeight}px`);

				const timeString = formatTime(hours, minutes, seconds);

				const newComplaint = secondssDiv
					.append("p")
					.html(
						`${timeString}<br>${data.complaint_type}<br>${data.descriptor}<br>${data.incident_zip}`
					)
					.attr("class", "complaint")
					.style("position", "absolute")
					.style("left", `${x - textWidth / 2}px`)
					.style("top", `${y - textHeight / 2 - 20}px`)
					.style("width", `${textWidth}px`)
					.style("height", `${textHeight}px`)
					.style("font-size", "14pt")
					.style("font-family", addFonts(data.borough));

				if (data.complaint_type === majorityType) {
					newComplaint.style("color", getHourColor(hours));
				}
			});
	};

	// initial render
	renderCurrentSecond();

	// update every second
	setInterval(renderCurrentSecond, 1000);
};
