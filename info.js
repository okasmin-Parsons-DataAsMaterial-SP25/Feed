import "./style.css";
import * as d3 from "d3";

export const renderInfo = () => {
	const info = d3.select("#info");
	info.append("h1").text("How Frustrated Are New Yorkers?");
	// .style("color", "rgba(0,255,255,0.5");
	info.append("p").text("A second-by-second visualization of a day of complaints in New York City.");
	info.append("p").text("Complaints are shown at the exact time they were filed, at this time a week ago.");

	const liveInfo = info.append("div").attr("id", "live-info");
	liveInfo.append("p").text("On this day, a week ago, there were a total of {total complaints filed} during the course of the day.");
	liveInfo.append("p").text("A majority of those complaints between {start hour - end hour} in the category of {complaint type}.");
};
