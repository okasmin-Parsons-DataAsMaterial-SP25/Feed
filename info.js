import "./style.css";
import * as d3 from "d3";
import { formatHourRange, getHourColor } from "./utils";

const currentHour = new Date().getHours();
const majorityColor = getHourColor(currentHour);

export const renderInfo = (data, majorityType) => {
	const info = d3.select("#info");
	info.append("h1").text("How Frustrated Are New Yorkers?");
	info
		.append("p")
		.text(
			"A second-by-second visualization of a day of 311 service requests in New York City."
		);
	info
		.append("p")
		.text(
			"Complaints are shown at the exact time they were filed, at this time a week ago."
		);

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
			`The majority of those complaints from <span id="infoHighlight" class="complaint">${formatHourRange(
				currentHour
			)}</span> were related to <span id="infoHighlight" class="complaint">${majorityType}</span>.`
		);

	const footer = info.append("div").attr("id", "footer");
	footer
		.append("p")
		.html(
			`Designers: Olivia Kasmin & Lisa Sakai Quinley | <a href="https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9/data_preview" target="_blank">Data Source: 311 Service Requests New York City Open Data</a>`
		);

	d3.selectAll(".complaint").style("color", majorityColor);
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
