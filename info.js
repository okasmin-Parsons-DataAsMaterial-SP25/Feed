import "./style.css";
import * as d3 from "d3";
import { totalComplaintsDay, currentMajorityComplaintType } from "./utils";

export const renderInfo = () => {
	const info = d3.select("body").append("div").attr("id", "info");

	info.append("h1").text("How Frustrated Are New Yorkers?");
	info
		.append("p")
		.text(
			"A second-by-second visualization of a day of complaints in New York City."
		);
	info
		.append("p")
		.text(
			"Complaints are shown at the exact time they were filed, at this time a week ago."
		);

	const liveInfo = d3.select("body").append("div").attr("id", "live-info");

	const startHour = 9;
	const endHour = 17;
	const complaintType = currentMajorityComplaintType.type;

	liveInfo
		.append("p")
		.html(
			`On this day, a week ago, there were a total of <span id="infoHighlight">${totalComplaintsDay}</span> complaints filed during the course of the day.`
		);
	liveInfo
		.append("p")
		.html(
			`A majority of those complaints were between <span id="infoHighlight">${startHour}</span> and <span id="infoHighlight">${endHour}</span> in the category of <span id="infoHighlight">${complaintType}</span>.`
		);

	const footer = info.append("div").attr("id", "footer");
	footer
		.append("p")
		.html(
			`Designers: Olivia Kasmin & Lisa Sakai Quinley | <a href="https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9/data_preview" target="_blank">Data Source: 311 Service Requests New York City Open Data</a>`
		);

	// Ensure it's hidden initially after creation
	d3.select("#info").style("display", "none");
};
