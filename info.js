import "./style.css";
import * as d3 from "d3";

export const renderInfo = () => {
	const info = d3.select("#info");
	info.append("h1").text("How Frustrated Are New Yorkers?");
	// .style("color", "rgba(0,255,255,0.5");
	info.append("p").text("A second-by-second visualization of a day of complaints in New York City.");
	info.append("p").text("Complaints are shown at the exact time they were filed, at this time a week ago.");
  
	const liveInfo = d3.select("#info").append("div").attr("id", "live-info");
	

	const totalComplaints = 5000; // Example static value
	const startHour = 9; // Example static value
	const endHour = 17; // Example static value
	const complaintType = "Noise"; // Example static value
  
	liveInfo.append("p").html(`On this day, a week ago, there were a total of <span id="infoHighlight">${totalComplaints}</span> complaints filed during the course of the day.`);
	liveInfo.append("p").html(`A majority of those complaints were between <span id="infoHighlight">${startHour}</span> and <span id="infoHighlight">${endHour}</span> in the category of <span id="infoHighlight">${complaintType}</span>.`);

	const footer = d3.select("#info").append("div").attr("id", "footer");
	footer.append("p")
	  .html(`Designers: Olivia Kasmin & Lisa Sakai Quinley | <a href="https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9/data_preview" target="_blank">Data Source: 311 Service Requests New York City Open Data</a>`);	
  };
  

