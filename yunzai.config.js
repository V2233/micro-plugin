import { defineConfig } from 'yunzai'
import Micro from './dist/index.js'

export default defineConfig({
  applications:[ Micro() ]
})