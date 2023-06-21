import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.scss'
import * as avro from 'avsc'
const tagParser = avro.Type.forSchema({
  type: 'record',
  name: 'Tag',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'value', type: 'string' }
  ]
})
console.log(tagParser, 'tagParser')

createApp(App).use(router).mount('#app')
