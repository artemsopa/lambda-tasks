const express = require('express');
const Correct = require('./correct/correct');

const app = express();
app.use(express.json())
const port = 5000;

const corr = new Correct();

app.post('/', (req, res, next) => {
    try {
        const { language, mimetype, count } = req.body;
        if (!language || !mimetype || !count) {
            throw new Error('invalid body!');
        }
        return res.status(200).json(corr.getResponse(language, count, mimetype))
    } catch (error) {
        next(error);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});