// export const formatMessage = (complaint) => {
// 	const type = complaint["complaint_type"];
// 	const descriptor = complaint["descriptor"];
// 	const street1 = complaint["cross_street_1"];
// 	const street2 = complaint["cross_street_2"];
// 	const zip = complaint["incident_zip"];

// 	const descriptorText = descriptor
// 		? `- and specifically the ${descriptor} -`
// 		: "";

// 	// return `the ${type}${descriptorText} at the corner of ${street1} and ${street2} in ${zip} are a huge $%#@! problem.`;

// 	const line1 = `my huge $%#@! problem: ${type}`;
// 	const line2 = descriptor
// 		? `details: specifically the ${descriptor}`
// 		: undefined;
// 	const line3 = `location: at the corner of ${street1} and ${street2} in ${zip}`;
// };

export const getComplaintTypes = (data) => {
	const types = [];
	const typesDescriptionMap = new Map();
	data.forEach((d) => {
		const type = d["complaint_type"];
		const descriptor = d["descriptor"];

		types.push(type);

		if (typesDescriptionMap.get(type) && descriptor) {
			const curr = typesDescriptionMap.get(type);
			typesDescriptionMap.set(type, curr.add(descriptor));
		} else {
			typesDescriptionMap.set(type, new Set([descriptor]));
		}
	});
	const uniqueTypes = new Set(types);

	console.log(typesDescriptionMap);

	return uniqueTypes;
};
