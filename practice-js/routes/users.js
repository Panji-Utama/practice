const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const mysqlConnection = require('../mysqlConnection')

// GET all users
router.get('/', (req, res) => {
    mysqlConnection.query('SELECT * FROM users', (err, result) => {
        if (err) {
            res.status(500).json({ error: err })
        } else {
            res.status(200).json({ users: result })
        }
    })
})

// GET one
router.get('/:user_id', (req, res) => {
    const id = req.params.user_id

    mysqlConnection.query(
        'SELECT * FROM users WHERE user_id = ?',
        [id],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: err })
            } else {
                if (result.length > 0) {
                    res.status(200).json({ user: result[0] })
                } else {
                    res.status(404).json({ message: 'User not found!' })
                }
            }
        }
    )
})

router.get('/email/:email/:password', (req, res) => {
    const { email, password } = req.params

    mysqlConnection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        async (err, result) => {
            if (err) {
                res.status(500).json({ error: err })
            } else {
                if (result.length > 0) {
                    const isMatch = await bcrypt.compare(
                        password,
                        result[0].password
                    )
                    if (isMatch) {
                        res.status(200).json({
                            msg: 'The user is found',
                            user: result[0]
                        })
                    } else {
                        res.status(500).json({ error: 'Wrong Password!' })
                    }
                } else {
                    res.status(404).json({ message: 'User not found!' })
                }
            }
        }
    )
})

router.post('/', async (req, res) => {
    try {
        const { username, email, password, address } = req.body

        if (!username || !password || !email) {
            return res
                .status(400)
                .json({ msg: 'Username, password and email are required' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await mysqlConnection.query(
            'INSERT INTO users (username, email, password, address) VALUES (?,?,?,?)',
            [username, email, hashedPassword, address]
        )

        res.status(201).json({
            msg: 'User created successfully',
            user_id: result.insertId
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/login', async (req, res) => {
    /*
    const results = await mysqlConnection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    )

    if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' })
    }

    const user = results[0]

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.status(200).json({ message: 'Login successful' })
    */

    const { email, password } = req.body
    if (!email || !password) {
        return res
            .status(400)
            .json({ message: 'Please provide both email and password' })
    }

    mysqlConnection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        async (err, result) => {
            if (err) {
                res.status(500).json({ error: err })
            } else {
                if (result.length > 0) {
                    const isMatch = await bcrypt.compare(
                        password,
                        result[0].password
                    )
                    if (isMatch) {
                        res.status(200).json({
                            msg: 'Login successful',
                            user: result[0]
                        })
                    } else {
                        res.status(500).json({ error: 'Wrong Password!' })
                    }
                } else {
                    res.status(404).json({ message: 'User not found!' })
                }
            }
        }
    )
})

router.put('/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params
        const { username, email, address, password } = req.body
    } catch (error) {}
})

module.exports = router
