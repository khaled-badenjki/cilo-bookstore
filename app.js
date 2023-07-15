const express = require('express')
const app = express()
const port = 3000
const { cilo, db, singlify, tenantify } = require('./dal/models/index')

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({
    health: 'healthy'
  })
})

app.post('/users', singlify, async (req, res) => {
  const { name, email } = req.body

  await db().User.create({
    name,
    email
  })

  const tenant = await cilo.createTenant(name)

  cilo.setCurrentORM(tenant.subdomain)

  const user = await db().User.create({
    name,
    email
  })

  res.status(201).json({
    name: user.name,
    email: user.email,
    tenant_id: tenant.subdomain
  })
})

app.post('/books', tenantify, async (req, res) => {
  const { title, author } = req.body

  const book = await db().Book.create({
    title,
    author
  })

  res.status(201).json({
    book
  })
})

app.get('/books', tenantify, async (req, res) => {
  const books = await db().Book.findAll()

  res.status(200).json({
    books
  })
})

app.listen(port, () => {
  console.log(`Cilo app listening on port ${port}`)
})