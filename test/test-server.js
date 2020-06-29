const express = require('express')
const path = require('path')
const { mock } = require('../dist/index')
const mockOptionFile = path.resolve(__dirname, '../example/mock')

const app = express()

app.use(mock({
  entry: mockOptionFile
}))
app.listen(8888, (e) => {
  if (!e) {
    console.log('http://localhost:8888')
  } else {
    console.error(e)
  }
})