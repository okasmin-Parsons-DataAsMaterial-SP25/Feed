import "./style.css";
import * as d3 from "d3";
import { formatHourRange, getHourColor } from "./utils";

const currentHour = new Date().getHours();
const majorityColor = getHourColor(currentHour);

export const renderInfo = (data, majorityType) => {
	const info = d3.select("#info");

	const liveInfo = info.append("div").attr("id", "live-info");

	const totalComplaintsDay = data.length;

	liveInfo
		.append("p")
		.html(
			`On this day, a week ago, there were a total of <span id="infoHighlight">${totalComplaintsDay}</span> complaints filed during the course of the day.`
		);
	liveInfo
		.append("p")
		.html(
			`The majority of those complaints from <span id="infoHighlight" class="complaint-majority">${formatHourRange(
				currentHour
			)}</span> were related to <span id="infoHighlight" class="complaint-majority">${majorityType}</span>.`
		);

	const legendBubbles = [
		"./Manhattan.png",
		"./Brooklyn.png",
		"./Bronx.png",
		"./Queens.png",
		"./StatenIsland.png",
	];

	// Add legend below the second line of liveInfo
	const legend = liveInfo.append("div").attr("id", "legend");

	// Append each image
	legendBubbles.forEach((src) => {
		legend.append("img").attr("src", src).attr("class", "legend-image");
	});

	liveInfo
		.append("p")
		.text("A second-by-second visualization of a day of 311 service requests in New York City.")
		.style("margin-top", "45px")
		.style("margin-bottom", "45px");
	liveInfo
		.append("p")
		.text(
			"Complaints are shown at the exact time they were filed, at this time a week ago."
		)
		.style("margin-bottom", "45px");

	const footer = info.append("div").attr("id", "footer");
	footer
		.append("p")
		.html(
			`Designers: Olivia Kasmin & Lisa Sakai Quinley | <a href="https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9/data_preview" target="_blank">Data Source: 311 Service Requests New York City Open Data</a>`
		);

	d3.selectAll(".complaint-majority").style("color", majorityColor);
};


export const renderInfoButton = () => {
	const infoDiv = d3.select("#info");
	const button = d3.select("#toggleInfo");
	button.style("color", majorityColor);

	const onToggleInfo = () => {
		const isHidden = infoDiv.style("display") === "none";

		infoDiv.style("display", isHidden ? "block" : "none");

		button.style("background-color", isHidden ? majorityColor : "#ddd");
		button.style("color", isHidden ? "white" : majorityColor);
	};

	button.on("click", onToggleInfo);
};
