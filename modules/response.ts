// Message 기본형
class Message {
	message: string;
	description?: string | undefined;

	constructor(message: string, description?: string) {
		this.message = message;
		this.description = description;
	}

	SetMessage(message: string) {
		this.message = message;
	}
}

// 성공 시 메시지
// {
//     message: 'success',
//     data?: any,
//     description?: string
// }
export class SuccessMessage extends Message {
	data?: any | undefined;

	constructor(data?: any, description?: string) {
		super("success", description);
		this.data = data;
	}
}

// 실패 시 메시지
// {
//     message: 'error',
//     error_code: string,
//     description?: string
// }
export class FailedMessage extends Message {
	error_code: string;

	constructor(error_code: string, description?: string) {
		super("error", description);
		this.error_code = error_code;
	}
}

// 내부 오류 메시지
// {
//     message: 'error',
//     error_code: 'ERR_INTERNAL_ERROR',
//     description?: string
// }
export class InternalErrorMessage extends FailedMessage {
	constructor(description?: string) {
		super("ERR_INTERNAL_ERROR", description);
	}
}
