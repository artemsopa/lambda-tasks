function fibonacci(num) {
    const nums = [0, 1];
    for(let i = 2; i < num+1; i++) {
        if (num <= 1) nums.push(1);
        nums[i] = nums[i-1] + nums[i-2];
    }
    return nums;
}

exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        headers: {
            'Content-type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            message: 'sequence from 10',
            result: fibonacci(10)
        }),
    };
    return response;
};
