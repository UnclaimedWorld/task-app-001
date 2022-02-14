const express = require('express');
const User = require('../models/user');
const router = new express.Router();

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});  
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if(!user) return res.status(404).send();
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch('/users/:id', async (req, res) => {
  const toUpdate = Object.keys(req.body);
  const allowedUpdates = ['name', 'age', 'password', 'email'];
  const isValid = toUpdate.every(param => allowedUpdates.includes(param));
  if(!isValid) return res.sendStatus(500);
  
  try {
    const user = await User.findById(req.params.id);
    if(!user) return res.sendStatus(404);

    toUpdate.forEach(update => user[update] = req.body[update]);
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return res.sendStatus(404);
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;