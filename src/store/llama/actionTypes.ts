const actionTypes = {
    CREATE_COLLECTION: 'llama/create_collection',
    CREATE_COLLECTION_SUCCESS: 'llama/create_collection_success',
    CREATE_COLLECTION_FAILURE: 'llama/create_collection_failure',
    CREATE_COLLECTION_RESET: 'llama/create_collection_reset',

    DELETE_COLLECTION: 'llama/delete_collection',
    DELETE_COLLECTION_SUCCESS: 'llama/delete_collection_success',
    DELETE_COLLECTION_FAILURE: 'llama/delete_collection_failure',
    DELETE_COLLECTION_RESET: 'llama/delete_collection_reset',

    ADD_FILE: 'llama/add_file',
    ADD_FILE_SUCCESS: 'llama/add_file_success',
    ADD_FILE_FAILURE: 'llama/add_file_failure',
    ADD_FILE_RESET: 'llama/add_file_reset',

    QUERY: 'llama/query',
    QUERY_SUCCESS: 'llama/query_success',
    QUERY_FAILURE: 'llama/query_failure',
    QUERY_RESET: 'llama/query_reset',
}

export default actionTypes;