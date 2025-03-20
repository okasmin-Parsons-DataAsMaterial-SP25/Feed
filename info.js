import "./style.css";
import * as d3 from "d3";

export const renderInfo = () => {
	const info = d3.select("#info");
	info.append("h1").text("Feed Assignment - Prototype");
	// .style("color", "rgba(0,255,255,0.5");
};
