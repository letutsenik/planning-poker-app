export type Identifier = string | number;

export type ControllerCallBackType = (
	arg?: { [key: string]: string } | string,
) => void; //TODO: Update during Error handling

export type ServiceError = { error?: { message: string } };
