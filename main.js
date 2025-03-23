import "./style.css";
import * as d3 from "d3";
import { getData } from "./utils";
import { renderInfo } from "./info";
import { renderComplaintsBySecond } from "./complaintsBySecond";

/**
 * GET DATA
 * fetch entire day's data for 1 week ago
 */

// Get today's date
const today = new Date();
// get the date one week ago by subtracting 7 from today's date
const oneWeekAgo = new Date();
oneWeekAgo.setDate(today.getDate() - 7);

// Format to "YYYY-MM-DDT00:00:00"
const formattedOneWeekAgoStart =
	oneWeekAgo.toISOString().split("T")[0] + "T00:00:00";
const formattedOneWeekAgoEnd =
	oneWeekAgo.toISOString().split("T")[0] + "T23:59:59";

const data = await getData(formattedOneWeekAgoStart, formattedOneWeekAgoEnd);
// console.log("all data");
// console.log(data);

/**
 * RENDER COMPONENTS
 */

renderComplaintsBySecond(data);

// Create a circular "info" button with an "i" icon
const button = d3
	.select("body")
	.append("button")
	.attr("id", "toggleInfo")
	.html("i");

// Set up button click behavior
let infoCreated = false;

button.on("click", () => {
	let info = d3.select("#info");

	// Create the info content only on the first click
	if (!infoCreated) {
		renderInfo(data);
		info = d3.select("#info"); // Re-select after render
		infoCreated = true;
	}
	const isHidden = info.classed("show");
	info.classed("show", !isHidden);
	button.classed("active", !isHidden);
});
