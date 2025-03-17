import './style.css'
import * as d3 from 'd3';

console.log(d3);

const app = d3.select('#app');

function getPreviousDay() {
    // Get today's date
    const today = new Date();

    // Get the previous day's date by subtracting 1 day from today's date
    const previousDay = new Date(today);
    previousDay.setDate(today.getDate() - 1);

    // Format the previous day's date to "YYYY-MM-DDT00:00:00"
    const formattedPreviousDay = previousDay.toISOString().split('T')[0] + 'T00:00:00';

    // Get the previous day's date + 1 day (to form the end of the range)
    const nextDay = new Date(previousDay);
    nextDay.setDate(previousDay.getDate() + 1);
    const formattedNextDay = nextDay.toISOString().split('T')[0] + 'T00:00:00';

    // Construct the API URL with the date range
    const previousDayData = `https://data.cityofnewyork.us/resource/erm2-nwe9.json?$query=SELECT%0A%20%20%60unique_key%60%2C%0A%20%20%60created_date%60%2C%0A%20%20%60closed_date%60%2C%0A%20%20%60agency%60%2C%0A%20%20%60agency_name%60%2C%0A%20%20%60complaint_type%60%2C%0A%20%20%60descriptor%60%2C%0A%20%20%60location_type%60%2C%0A%20%20%60incident_zip%60%2C%0A%20%20%60incident_address%60%2C%0A%20%20%60street_name%60%2C%0A%20%20%60cross_street_1%60%2C%0A%20%20%60cross_street_2%60%2C%0A%20%20%60intersection_street_1%60%2C%0A%20%20%60intersection_street_2%60%2C%0A%20%20%60address_type%60%2C%0A%20%20%60city%60%2C%0A%20%20%60landmark%60%2C%0A%20%20%60facility_type%60%2C%0A%20%20%60status%60%2C%0A%20%20%60due_date%60%2C%0A%20%20%60resolution_description%60%2C%0A%20%20%60resolution_action_updated_date%60%2C%0A%20%20%60community_board%60%2C%0A%20%20%60bbl%60%2C%0A%20%20%60borough%60%2C%0A%20%20%60x_coordinate_state_plane%60%2C%0A%20%20%60y_coordinate_state_plane%60%2C%0A%20%20%60open_data_channel_type%60%2C%0A%20%20%60park_facility_name%60%2C%0A%20%20%60park_borough%60%2C%0A%20%20%60vehicle_type%60%2C%0A%20%20%60taxi_company_borough%60%2C%0A%20%20%60taxi_pick_up_location%60%2C%0A%20%20%60bridge_highway_name%60%2C%0A%20%20%60bridge_highway_direction%60%2C%0A%20%20%60road_ramp%60%2C%0A%20%20%60bridge_highway_segment%60%2C%0A%20%20%60latitude%60%2C%0A%20%20%60longitude%60%2C%0A%20%20%60location%60%0AWHERE%0A%20%20%60created_date%60%0A%20%20%20%20BETWEEN%20%22${formattedPreviousDay}%22%20AND%20%22${formattedNextDay}%22%0AORDER%20BY%20%60created_date%60%20DESC%20LIMIT%2015000%20OFFSET%200`;

    // Use d3.json to fetch the data
    d3.json(previousDayData)
        .then(function(data) {
            // Log the data
            console.log("Fetched Data: ", data);
        })
        .catch(function(error) {
            console.error("Error fetching data: ", error);
        });
}


getPreviousDay();

app
    .append('h1') // this adds an h1 tag to the html
    .text("Feed Assignment - Minutes") // this adds the following text to the above h1 tag
    .style("color", "rgba(0,255,255,0.5"); // call the attribute "color", and then state what you're changing it to (0.5 is transparency)

app
    .append('p')
    .text("Today's date is " + new Date());
