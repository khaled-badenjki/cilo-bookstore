const express = require('express')
const app = express()
const port = 3000

app.get('/health', (req, res) => {
  res.json({
    health: 'healthy'
  })
})

app.listen(port, () => {
  console.log(`Cilo app listening on port ${port}`)
})