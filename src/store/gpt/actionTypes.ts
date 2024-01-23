const actionTypes = {
    GPTTHREAD: 'gpt/thread',
    THREAD_SUCCESS: 'gpt/thread_success',
    THREAD_FAILURE: 'gpt/thread_failure',
    THREAD_RESET: 'gpt/thread_reset',

    DELETE_THREAD: 'gpt/delete_thread',
    DELETE_THREAD_SUCCESS: 'gpt/delete_thread_success',
    DELETE_THREAD_FAILURE: 'gpt/delete_thread_failure',
    DELETE_THREAD_RESET: 'gpt/delete_thread_reset',

    CREATE_ASSISTANT: 'gpt/create_assistant',
    CREATE_ASSISTANT_SUCCESS: 'gpt/create_assistant_success',
    CREATE_ASSISTANT_FAILURE: 'gpt/create_assistant_failure',
    CREATE_ASSISTANT_RESET: 'gpt/create_assistant_reset',

    MESSAGES: 'gpt/messages',
    MESSAGES_SUCCESS: 'gpt/messages_success',
    MESSAGES_FAILURE: 'gpt/messages_failure',
    MESSAGES_RESET: 'gpt/messages_reset',
}

export default actionTypes;