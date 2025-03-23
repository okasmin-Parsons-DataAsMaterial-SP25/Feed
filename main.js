import "./style.css";
import * as d3 from "d3";
import { getData } from "./utils";
import { renderInfo } from "./info";
import { renderComplaintsBySecond } from "./complaintsBySecond";
import { renderClock } from "./clock";

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
console.log(data);

/**
 * RENDER COMPONENTS
 */

renderComplaintsBySecond(data);
renderClock();

// ensure info screen is hidden initially
const infoDiv = d3.select("#info");
infoDiv.style("display", "none");
renderInfo(data);

/**
 * BUTTON TO TOGGLE INFO
 */
const button = d3.select("#toggleInfo");

const onToggleInfo = () => {
	const isHidden = infoDiv.style("display") === "none";

	infoDiv.style("display", isHidden ? "block" : "none");
	button.classed("active", isHidden);
};

button.on("click", onToggleInfo);
