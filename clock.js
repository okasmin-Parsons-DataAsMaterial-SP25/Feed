import "./style.css";
import * as d3 from "d3";
import { formatTime } from "./utils";

const clockDiv = d3.select("#clock")
	.style("font-family", "'Voltaire', sans-serif");

const updateClock = () => {
	const today = new Date();

	const h = today.getHours();
	const m = today.getMinutes();
	const s = today.getSeconds();

	const timeString = formatTime(h, m, s);

	clockDiv.text(`${timeString}`);
};

export const renderClock = () => {
	// initial render
	updateClock();

	// update every second
	setInterval(updateClock, 1000);
};
