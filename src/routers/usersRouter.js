const express = require('express');
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const upload = require("../middleware/uploadMiddleware");
const sharp = require("sharp");

const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token});
    } catch (error) {
        console.log('Error on user create', error);
        res.status(400).send({error: 'Error on user create'});
    }
})

router.post('/users/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    try {
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error) {
        console.log('Error on login', error);
        res.status(400).send({error: 'Error on login'});
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (error) {
        console.log('Error on logout', error);
        res.status(500).send();
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        console.log('Error on logoutAll', error);
        res.status(500).send();
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = req.body
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = Object.keys(updates).every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        const user = req.user

        Object.keys(updates).forEach(fieldName => user[fieldName] = updates[fieldName])
        await user.save()

        res.send(user)
    } catch (error) {
        console.log('Error on update user', error)
        res.status(400).send({error: 'Error on update user'})
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    console.log('Error on avatar upload', error)
    res.status(400).send({error: 'Error on avatar upload' })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = null
        await req.user.save()
        res.send()
    } catch (error) {
        console.log('Error on avatar delete')
        res.status(500).send({error: 'Error on avatar delete'})
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne()
        res.send(req.user)
    } catch (error) {
        console.log('Error on delete user', error)
        res.status(500).send({error: 'Error on delete user'})
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        console.log('Error on getting avatar', error)
        res.status(404).send()
    }
})

module.exports = router
