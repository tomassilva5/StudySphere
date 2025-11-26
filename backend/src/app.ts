import express from 'express'
import routes from './routes'

const app = express()

app.use(express.json())
app.use("api/v1", routes)

app.listen(3000, () => {
  console.log('Server is running')
})

app.use(routes)
