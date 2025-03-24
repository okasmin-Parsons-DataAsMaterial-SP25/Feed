import "./style.css";
import * as d3 from "d3";
import { getData, getMajorityComplaintType } from "./utils";
import { renderInfo, renderInfoButton } from "./info";
import { renderComplaintsBySecond } from "./complaintsBySecond";
import { renderClock } from "./clock";

// Render clock component first so it's visible while data loading
renderClock();

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
