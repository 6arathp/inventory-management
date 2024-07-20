import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

// pool.connect((err) => {
//     if (err)
//         console.log(err.message);
//     console.log("db is connected");
// })

// export async function getTableRow () {
//     const [[id]] = await pool.query(`select * from current_stock order by id desc limit 1`)
//     const [result] = await pool.query(`
//         select * from current_stock where id = ?
//         `, [id.id])
//     return result[0]
// }


export async function getLogRow () {
    const [[id]] = await pool.query(`select * from log order by id desc limit 1`)
    if (id == null)
        return {}
    const [result] = await pool.query(`
        select * from log where id = ?
        `, [id.id])
    return result[0]
}


export async function addLog (name, category, quantity, action) {
    const [result] = await pool.query(`
        insert into log(name, category, quantity, actions)
        values (?,?,?,?)
        `, [name, category, quantity, action])
}

export async function addItem (name, category, quantity, action) {

    const [[exists]] = await pool.query("select exists(select 1 from current_stock where name = ? and category = ?)", [name, category])
    if (Object.values(exists)[0]) {
        const result = await modifyItem(name, category, quantity, action)
        return result
    }
    if (action == "REMOVE")
        return false
    const [result] = await pool.query(`
        insert into current_stock(name, category, quantity)
        values (?,?,?)
        `, [name, category, quantity])
    await addLog(name, category, quantity, action)
    return result
}

export async function modifyItem (name, category, quantity, action) {
    const [[get_value]] = await pool.query("select quantity from current_stock where name = ?", [name])
    var value = Object.values(get_value)[0]
    if (action == 'REMOVE') {
        if (value == 0)
            return
        value = Math.max((value - Number(quantity)), 0)
    }
    if (action == 'ADD')
        value = value + Number(quantity)
    const result = await pool.query(`
        update current_stock set quantity = ? where name = ? and category = ?
        `, [value, name, category])
    await addLog(name, category, quantity, action)
    return result
}

export async function getItems () {
    const [result] = await pool.query(`
        select * from current_stock
        `)
    return result
}

export async function getLog () {
    const [result] = await pool.query(`
        select * from log
        `)
    return result
}

export async function truncateAll () {
    await pool.query(`
        truncate current_stock
        `)
    await pool.query(`
        truncate log
        `)
}