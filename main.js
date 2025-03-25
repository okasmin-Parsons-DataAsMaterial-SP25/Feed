import "./style.css";
import * as d3 from "d3";
import { getData, getMajorityComplaintType } from "./utils";
import { renderInfo, renderInfoButton } from "./info";
import { renderComplaintsBySecond } from "./complaintsBySecond";
import { renderClock } from "./clock";
import { getHourColor } from "./utils";

const currentHour = new Date().getHours();
const majorityColor = getHourColor(currentHour);

// Render clock component first so it's visible while data loading
renderClock();

const info = d3.select("body").append("div").attr("id", "title")
  .style("display", "flex")
  .style("align-items", "baseline")
  .style("gap", "10px"); // Optional for spacing

info.append("h1")
  .text("How Frustrated Are New Yorkers?")
  .style("color", `${majorityColor}`);

info.append("h2")
  .text("Visualizing an hour of 311 service requests in New York City")
  .style("color", `${majorityColor}`);


/**
 * GET DATA
 * fetch entire day's data for 1 week ago
 */

const data = await getData();
console.log(data);

// get the majority complaint type for the current hour
const majorityType = getMajorityComplaintType(data).type;

/**
 * RENDER COMPONENTS
 */

renderComplaintsBySecond(data, majorityType);

// ensure info screen is hidden initially
const infoDiv = d3.select("#info");
infoDiv.style("display", "none");
renderInfo(data, majorityType);

renderInfoButton();
