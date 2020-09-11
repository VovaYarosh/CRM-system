const express = require('express');
const app = express();
const PORT = process.env.port || 5000;

app.get('/',(req,res) => {
   res.status(200).json({
       message: "Working"
   })
});

app.listen(PORT, () => console.log(`server has been started at ${PORT}`)
);