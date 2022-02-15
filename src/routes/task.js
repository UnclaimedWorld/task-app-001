const express = require('express');
const Task = require('../models/task');
const router = new express.Router();

router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    e.status(500).send(e);
  }
});

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id)
    if(!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch('/tasks/:id', async (req, res) => {
  const toUpdate = Object.keys(req.body);
  const allowedUpdates = ['completed', 'description'];
  const isValid = toUpdate.every(param => allowedUpdates.includes(param));
  if(!isValid) return res.sendStatus(400);
  try {
    const task = await Task.findById(req.params.id);
    if(!task) return res.sendStatus(404);

    toUpdate.forEach(update => task[update] = req.body[update]);
    await task.save();
    
    return res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    const user = await Task.findByIdAndDelete(req.params.id);
    if(!user) return res.sendStatus(404);
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;