const app = require('./app');
const PORT = process.env.port || 5000;

app.listen(PORT, () => console.log(`server has been started at ${PORT}`)
);