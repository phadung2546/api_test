
const express = require('express')
const { status } = require('init')
const app = express()
const mysql = require('mysql2/promise')
require('dotenv').config()
let connection
const conn = async () => {
    connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        //multipleStatements : true
    })

}

app.get('/users' , async (req,res) => {
    const data = await connection.query('SELECT * FROM users')
    res.json(data[0])
})



app.get('/usersqlInjection/:id', async (req, res) => {
    let id = req.params.id
    try {
        const data = await connection.query(`SELECT * FROM users WHERE id = ?` , id)
        if (data[0].length == 0 ){
            throw {statusCode : 404 , message : 'Not found'}
        }else{
            res.json(data[0])
        }
    } catch (error) {
        console.error(error.message)
        let statusCode = error.statusCode || 500
        res.status(statusCode) .json({
            message: "not found"
        })
    }

})

app.get('/user/:id', async (req, res) => {
    try {
        let id = req.params.id
        const data = await connection.query('SELECT * FROM users WHERE id = ?', id)
        //const data = await connection.query(`SELECT * FROM users WHERE id = ${id}`)
        if (isNaN(Number(id))) {
            return res.status(400).json({ err: "Numbers only Please !!" })
        } else if (data[0].length == 0) {
            throw { statusCode: 404, message: "Not found" }
        } else { 
            res.json(data[0])
        }

    } catch (error) {
        console.error("ERROR message ", error.message)
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: "can not get user "

        })
    }

})



const PORT = 3000
app.listen(PORT, async () => {
    await conn()
    console.log('http://localhost:',PORT)
})