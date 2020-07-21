export const generateMessage = (
	username: string,
	text: string,
): { username: string; text: string; createdAt: number } => {
	return {
		username,
		text,
		createdAt: new Date().getTime(),
	};
};

export const generateLocationMessage = (
	username: string,
	url: string,
): { username: string; url: string; createdAt: number } => {
	return {
		username,
		url,
		createdAt: new Date().getTime(),
	};
};
