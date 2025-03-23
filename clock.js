import "./style.css";
import * as d3 from "d3";

const clockDiv = d3.select("#clock");

const updateClock = () => {
	const today = new Date();
	const hh = String(today.getHours()).padStart(2, "0");
	const mm = String(today.getMinutes()).padStart(2, "0");
	const ss = String(today.getSeconds()).padStart(2, "0");
	clockDiv.text(`${hh}:${mm}:${ss}`);
};

export const renderClock = () => {
	// initial render
	updateClock();

	// update every second
	setInterval(updateClock, 1000);
};
