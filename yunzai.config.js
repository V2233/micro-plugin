import { defineConfig } from 'yunzai'
import Micro from './src/index.js'

export default defineConfig({
  applications:[ Micro() ]
})