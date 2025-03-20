import "./style.css";
import * as d3 from "d3";

/**
 * Return js Map with data grouped by hour, then minute, then second
 */
const formatDataByHourAndMinuteAndSeconds = (data) => {
	return d3.group(
		data,
		(d) => {
			const date = new Date(d.created_date);
			const hour = date.getHours();
			return hour; // Group by hour
		},
		(d) => {
			const date = new Date(d.created_date);
			return date.getMinutes(); // Group by minute within each hour
		},
		(d) => {
			const date = new Date(d.created_date);
			return date.getSeconds(); // Group by seconds within each minute
		}
	);
};

/**
 * Render 311 complaints
 * complaints start rendering when the app is opened and continue to accumulate
 * complaints are rendered when their timestamp second matches the actual current time (to the second)
 */
export const renderComplaintsBySecond = (data) => {
	const groupedByHourAndMinuteAndSeconds =
		formatDataByHourAndMinuteAndSeconds(data);

	const secondssDiv = d3.select("#seconds");
	const renderCurrentSecond = () => {
		const date = new Date();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();

		// get data for current minute
		const hourData = groupedByHourAndMinuteAndSeconds.get(hours);
		const minuteData = hourData.get(minutes);
		const secondData = minuteData.get(seconds);

		// console.log(secondData);

		secondData &&
			secondssDiv.append("div").text(`${hours}:${minutes}:${seconds}`);
		secondData &&
			secondData.forEach((data) => {
				// data &&
				secondssDiv
					.append("p")
					.text(`${data.complaint_type}: ${data.descriptor}`)
					.attr("class", "complaint");
			});
	};

	// show data for current minute and rerun fuction each second so it updates with each minute
	renderCurrentSecond();
	setInterval(renderCurrentSecond, 1000);
};
