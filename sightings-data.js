import Redis from 'ioredis'
import config from './config.js'

const INDEX = 'sightings:index'

class SightingsData {
  async init() {
    this.connection = new Redis(config.REDIS_URL)

    let indices = await this.connection.call('FT._LIST')

    if (indices.includes(INDEX)) {
      await this.connection.call('FT.DROPINDEX', INDEX)
    }

    await this.connection.call(
      'FT.CREATE', INDEX,
      'ON', 'hash',
      'PREFIX', 1, 'sighting:',
      'SCHEMA',
        'title', 'TEXT',
        'observed', 'TEXT',
        'location_details', 'TEXT',
        'location', 'GEO',
        'county', 'TAG',
        'state', 'TAG'
    )
  }

  async findById(id) {
    return await this.connection.hgetall(`sighting:${id}`)
  }

  async findByState(state) {
    return await this.find(`@state:{${state}}`)
  }

  async findByCountyState(county, state) {
    return await this.find(`@county:{${county}} @state:{${state}}`)
  }

  async findContaining(text) {
    return await this.find(text)
  }

  async findByStateContaining(state, text) {
    return await this.find(`${text} @state:{${state}}`)
  }

  async findNear(latitude, longitude, radius, units) {
    return await this.find(`@location:[${longitude} ${latitude} ${radius} ${units}]`)
  }

  async find(query) {
    let [count, ...foundKeysAndSightings] = await this.connection.call('FT.SEARCH', INDEX, query, 'LIMIT', 0, 100)
    let foundSightings = foundKeysAndSightings.filter((entry, index) => index % 2 !== 0)
    let sightings = foundSightings.map(sightingArray => {
      let keys = sightingArray.filter((_, index) => index % 2 === 0)
      let values = sightingArray.filter((_, index) => index % 2 !== 0)
      return keys.reduce((sighting, key, index) => {
        sighting[key] = values[index]
        return sighting
      }, {})
    })
    return { count, sightings }
  }
}

export default SightingsData
