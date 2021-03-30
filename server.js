import express from 'express'

import config from './config.js'
import SightingData from './sightings-data.js'

let app = new express()
app.use(express.json())

let sightingData = new SightingData()
sightingData.init()

app.get('/', (req, res) => {
  res.send({
    name: config.SERVICE_NAME,
    version: config.SERVICE_VERSION
  })
})

app.get('/sighting/:id', async (req, res) => {
  res.send(await sightingData.findById(req.params.id))
})

app.get('/sightings/state/:state', async (req, res) => {
  res.send(await sightingData.findByState(req.params.state))
})

app.get('/sightings/county/:county/state/:state', async (req, res) => {
  res.send(await sightingData.findByCountyState(req.params.county, req.params.state))
})

app.get('/sightings/containing/:text', async (req, res) => {
  res.send(await sightingData.findContaining(req.params.text))
})

app.get('/sightings/state/:state/containing/:text', async (req, res) => {
  res.send(await sightingData.findByStateContaining(req.params.state, req.params.text))
})

app.get('/sightings/near/lat/:latitude/long/:longitude/within/:radius/mi', async (req, res) => {
  res.send(await sightingData.findNear(req.params.latitude, req.params.longitude, req.params.radius, 'mi'))
})

app.get('/sightings/near/lat/:latitude/long/:longitude/within/:radius/km', async (req, res) => {
  res.send(await sightingData.findNear(req.params.latitude, req.params.longitude, req.params.radius, 'km'))
})

app.listen(config.PORT, () => console.log(`Bigfoot is listening on port ${config.PORT}`))
