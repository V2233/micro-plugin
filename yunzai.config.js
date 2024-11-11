import { defineConfig } from 'yunzaijs'
import Micro from './src/index.js'

export default defineConfig({
  applications:[ Micro() ]
})