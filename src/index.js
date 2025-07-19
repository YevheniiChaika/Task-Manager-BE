const express = require('express');
const config = require('./config/config');
require('./db/mongoose')
const usersRouter = require('./routers/usersRouter')
const tasksRouter = require("./routers/tasksRouter");

const app = express();
const port = config.port

app.use(express.json());

app.use(usersRouter);
app.use(tasksRouter);

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
})

// async function main () {
    // const Task = require('./models/task');
    // const task = await Task.findById('6879006e2718c21fb6415801')
    // await task.populate('owner')
    // console.log(task)
    // const User = require('./models/userModel');
    // const user = await User.findById('6878f3a022036d8f64478796')
    // await user.populate('tasks')
    // console.log(user) //virtual tasks is not printed
    // console.log(user.tasks)
// }
// main()
