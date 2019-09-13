import { Noise } from 'noisejs'

const city_size = 20
const biome_size = 40
const continent_size = 5000
const noise = new Noise()

const ocean_threshold = -0.65
const ocean_shore_threshold = -0.655
const city_threshold = 0.5
const lake_threshold = -0.8
const lake_shore_threshold = lake_threshold + 0.005
const river_lower_ridge = -0.15
const river_upper_ridge = 0.01
const river_shore_threshold = 0.05

const Colors = {
  white: [255, 255, 255],
  red: [255, 0, 0],
  dark_green: [0, 120, 5],
  green: [0, 255, 0],
  water: [0, 0, 255],
  black: [0, 0, 0],
  road: [128, 128, 0],
  sand: [256, 256, 0]
}

var noises = []

export function tile(x, y) {
  calcNoise(x, y)

  if (isOcean()) return Colors.water
  if (isCity()) return getCity(x, y)
  if (isLake()) return Colors.water
  if (isRiver()) return Colors.water
  if (isOceanShore()) return Colors.sand
  if (isLakeShore()) return Colors.sand
  if (isRiverShore()) return Colors.sand
  if (isForest()) return Colors.dark_green
  return Colors.green
}

function calcNoise(x, y) {
  // roads
  noises[1] = noise.simplex3(x, y, 1)
  noises[2] = noise.simplex3(x, y, 3)

  // city shape
  noises[3] = (noise.perlin2(x / city_size, y / city_size) + 1) / 2
  noises[3] = noises[3] * Math.pow(Math.E, 0.9)

  // lake
  noises[4] = noise.simplex3(x / biome_size / 10, y / biome_size / 10, 6)
  noises[4] *= Math.pow(Math.E, 0.8)
  noises[4] += noise.simplex3(x / biome_size / 5, y / biome_size / 5, 12)
  noises[4] += noise.simplex3(x / biome_size / 2, y / biome_size / 2, 24)

  // river
  noises[5] = noise.simplex3(x / biome_size / 3, y / biome_size / 3, 13)
  noises[5] *= Math.pow(Math.E, 2)

  // oceans
  noises[6] = noise.simplex3(x / continent_size, y / continent_size, 100)
  noises[6] *= Math.pow(Math.E, 2)
  noises[6] += noise.simplex3(
    (x / continent_size) * 2,
    (y / continent_size) * 2,
    200
  )
  noises[6] += noise.simplex3(
    (x / continent_size) * 4,
    (y / continent_size) * 4,
    400
  )
  noises[6] += noise.simplex3(
    (x / continent_size) * 8,
    (y / continent_size) * 8,
    800
  )
  noises[6] += noise.simplex3(
    (x / continent_size) * 16,
    (y / continent_size) * 16,
    1600
  )

  // forest/plains
  noises[7] = noise.simplex3(x / biome_size / 2, y / biome_size / 2, 7)
  noises[7] *= Math.pow(Math.E, 2)
  noises[7] += noise.simplex3((x / biome_size) * 2, (y / biome_size) * 2, 34)
}

function isCity() {
  return noises[3] <= city_threshold
}

function getCity(x, y) {
  if (x % 3 & 1 && noises[1] > -0.1) return Colors.road
  else if (y % 3 & 1 && noises[2] > -0.1) return Colors.road
  else return Colors.black
}

function isOcean() {
  return noises[6] >= ocean_threshold
}

function isOceanShore() {
  return noises[6] >= ocean_shore_threshold
}

function isForest() {
  return noises[7] > 0
}

function isLakeShore() {
  return noises[4] < lake_shore_threshold
}

function isLake() {
  return noises[4] <= lake_threshold
}

function isRiver() {
  return noises[5] > river_lower_ridge && noises[5] < river_upper_ridge
}

function isRiverShore() {
  return (
    Math.min(
      Math.abs(noises[5] - river_lower_ridge),
      Math.abs(noises[5] - river_upper_ridge)
    ) < river_shore_threshold
  )
}
