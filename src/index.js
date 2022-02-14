const express = require('express');
const app = express();

app.use(express.json());

const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');
app.use(userRouter);
app.use(taskRouter);

require('./db/mongoose');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is running on ${PORT} port`);
});