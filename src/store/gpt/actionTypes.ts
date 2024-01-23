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

    
    DELETE_FILE: 'gpt/delete_file',
    DELETE_FILE_SUCCESS: 'gpt/delete_file_success',
    DELETE_FILE_FAILURE: 'gpt/delete_file_failure',
    DELETE_FILE_RESET: 'gpt/delete_file_reset',

    ADD_FILE: 'gpt/add_file',
    ADD_FILE_SUCCESS: 'gpt/add_file_success',
    ADD_FILE_FAILURE: 'gpt/add_file_failure',
    ADD_FILE_RESET: 'gpt/add_file_reset',

    ASSIGN_FILE: 'gpt/assing_file',
    ASSIGN_FILE_SUCCESS: 'gpt/assing_file_success',
    ASSIGN_FILE_FAILURE: 'gpt/assing_file_failure',
    ASSIGN_FILE_RESET: 'gpt/assing_file_reset',

    VERIFY_FILE: 'gpt/verify_file',
    VERIFY_FILE_SUCCESS: 'gpt/verify_file_success',
    VERIFY_FILE_FAILURE: 'gpt/verify_file_failure',
    VERIFY_FILE_RESET: 'gpt/verify_file_reset',

    UPDATE_ASSISTANT: 'gpt/update_assistant',
    UPDATE_ASSISTANT_SUCCESS: 'gpt/update_assistant_success',
    UPDATE_ASSISTANT_FAILURE: 'gpt/update_assistant_failure',
    UPDATE_ASSISTANT_RESET: 'gpt/update_assistant_reset',

    DELETE_ASSISTANT: 'gpt/delete_assistant',
    DELETE_ASSISTANT_SUCCESS: 'gpt/delete_assistant_success',
    DELETE_ASSISTANT_FAILURE: 'gpt/delete_assistant_failure',
    DELETE_ASSISTANT_RESET: 'gpt/delete_assistant_reset',
}

export default actionTypes;