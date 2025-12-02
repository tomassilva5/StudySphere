import express, { Request, Response, NextFunction } from 'express'
import routes from './routes/index'
import cookieParser from 'cookie-parser'
const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/v1", routes)

app.listen(3000, () => {
  console.log('Server is running')
})

