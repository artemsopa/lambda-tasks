exports.handler = async (event) => {
    const name = event.queryStringParameters.name;
    if(name.length < 2) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Invalid name length!'
            })
        }
    }
    return {
        statusCode: 200,
        body: `Hello, ${name}!`,
    };
};
