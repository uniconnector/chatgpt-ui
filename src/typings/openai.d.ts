declare namespace OpenAI {

    interface Chat {
        uuid: string,
        title: string,
        subTitle: string,
        createDate: string,
		completion: Completion[]
	}

    interface Completion {
		request: CompletionRequest
		response: CompletionResponseChunk
	}

    interface CompletionRequest {
        model: string,
        messages: { role: string, content: string }[],
        stream: boolean
    }

    // interface CompletionResponseObject {
    //     id: string,
    //     object: string,
    //     created: string,
    //     model: string,
    //     choices: { index: number, message: { role: string, content: string }, finish_reason: string }[],
    //     usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number }
    // }

    interface CompletionResponseChunk {
        id: string,
        object: string,
        created: string,
        model: string,
        choices: { index: number, delta: { role: string, content: string }, finish_reason: string }[],
        usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number }
    }
}
