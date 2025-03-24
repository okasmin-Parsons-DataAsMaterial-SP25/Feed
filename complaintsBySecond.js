import "./style.css";
import * as d3 from "d3";
import {
	formatDataByHourAndMinuteAndSeconds,
	getHourColor,
	formatTime,
	formatComplaintText,
} from "./utils";

/**
 * Helper functions to determine placement of each complaint
 */
const placementDims = {
	width: window.innerWidth,
	height: window.innerHeight,
	buffer: 300,
	margins: {
		left: 10,
		right: 10,
		top: 6,
		bottom: 10,
	},
};

const scale = 0.5;

const imageWidth = 1000 * scale;
const imageHeight = 700 * scale;

const textWidth = 420 * scale;
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

const xMin = placementDims.margins.left + imageWidth / 4;
const xMax = placementDims.width - placementDims.margins.right - imageWidth / 4;

const yMin = placementDims.margins.top + imageHeight / 2;
const yMax =
	placementDims.height - placementDims.margins.bottom - imageHeight / 4;

// get a non-overlapping random position
function getNonOverlappingPosition() {
	let x, y;
	let attempts = 0;
	do {
		x = Math.floor(Math.random() * (xMax - xMin + 1)) + xMin;
		y = Math.floor(Math.random() * (yMax - yMin + 1)) + yMin;
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
export const renderComplaintsBySecond = (data, majorityType) => {
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

		const bubbleImages = [
			"./bubble1.svg",
			"./bubble2.svg",
			"./bubble3.svg",
			"./bubble4.svg",
			"./bubble5.svg",
		];

		const getImageSrc = (borough) => {
			if (borough === "MANHATTAN") {
				// get the correct colour here and change the path.fill according to data
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

		const fontSizes = [16, 14, 18, 18, 18];

		const getFontSize = (borough) => {
			switch (borough) {
				case "MANHATTAN":
					return fontSizes[0]; // 16pt
				case "BROOKLYN":
					return fontSizes[1]; // 14pt
				case "BRONX":
					return fontSizes[2]; // 18pt
				case "QUEENS":
					return fontSizes[3]; // 18pt
				case "STATEN ISLAND":
					return fontSizes[4]; // 18pt
				default:
					return fontSizes[Math.floor(Math.random() * fontSizes.length)];
			}
		};

		const fonts = [
			'"Permanent Marker", cursive', // 0
			'"Just Me Again Down Here", cursive', // 1
			'"Caveat", cursive', // 2
			'"Reenie Beanie", cursive', // 3
			'"Mansalva", sans-serif', // 4
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
				const complaintText = formatComplaintText(data);

				let fontSize = getFontSize(data.borough);
				if (complaintText.length > 40) fontSize *= 0.85;

				const newComplaint = secondssDiv
					.append("p")
					.html(`${timeString}<br>${complaintText}${data.incident_zip}`)
					.attr("class", "complaint")
					.style("position", "absolute")
					.style("left", `${x - textWidth / 2}px`)
					.style("top", `${y - textHeight / 2 - 22.5}px`)
					.style("width", `${textWidth}px`)
					.style("height", `${textHeight}px`)
					.style("font-family", addFonts(data.borough))
					.style("font-size", `${fontSize}pt`);

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
