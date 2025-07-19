const express = require('express');
const Task = require('../models/taskModel');
const auth = require('../middleware/auth')

const router = express.Router();

router.post('/tasks', auth, async (req, res) => {
    const newTask = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await newTask.save()
        res.status(201).send(newTask)
    } catch (error) {
        console.log('Error on create task', error);
        res.status(400).send({error: 'Error on create task'});
    }
})

router.get('/tasks', auth, async (req, res) => {
    const limit = parseInt(req.query.limit)
    const skip = parseInt(req.query.skip)
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try {
        // const tasks = await Task.find({owner: userId}) //opt1
        await req.user.populate({
            path: 'tasks',
            match,
            options: {limit, skip, sort},
        })
        res.send(req.user.tasks)
    } catch (error) {
        console.log('Error on read tasks', error)
        res.status(500).send({error: 'Error on read tasks'})
    }
})

router.get('/tasks/:taskId', auth, async (req, res) => {
    const taskId = req.params.taskId
    const userId = req.user._id;

    try {
        const task = await Task.findOne({_id: taskId, owner: userId})
        if (!task) {
            res.status(404).send('Task not found')
            return
        }
        res.send(task)
    } catch (error) {
        console.log('Error on read task', error)
        res.status(500).send({error: 'Error on read task'})
    }
})

router.patch('/tasks/:taskId', auth, async (req, res) => {
    const update = req.body
    const allowedUpdates = ['description', 'completed']
    const updateKeys = Object.keys(update);

    const isValidOperation = updateKeys.every(update => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid update!'})
    }

    try {
        const taskId = req.params.taskId
        const userId = req.user._id;

        const task = await Task.findOne({_id: taskId, owner: userId})

        if (!task) {
            return res.status(404).send('Task not found')
        }

        updateKeys.forEach(fieldName => task[fieldName] = update[fieldName])
        await task.save()
        res.send(task)
    } catch (error) {
        console.log('Error on update task', error)
        res.status(500).send({error: 'Error on update task'})
    }
})

router.delete('/tasks/:taskId', auth, async (req, res) => {
    try {
        const taskId = req.params.taskId
        const userId = req.user._id
        const task = await Task.findOneAndDelete({_id: taskId, owner: userId})
        if (!task) {
            return res.status(404).send('Task not found')
        }
        res.send(task)
    } catch (error) {
        console.log('Error on delete task', error)
        res.status(500).send({error: 'Error on delete task'})
    }
})

module.exports = router
