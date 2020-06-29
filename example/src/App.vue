<template>
  <div id="app">
    <button @click="fetchApi(0)">/test</button>
    <button @click="fetchApi(1)">/test2</button>
    <HelloWorld/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  methods: {
    fetchApi(index) {
      const apis = [
        {
          url: '/test'
        },
         {
          url: '/test2'
        }
      ]
      const config = apis[index]
      fetch(config.url, {
        method: config.method || 'get'
      }).then(response => response.json())
      .then(res => alert(JSON.stringify(res)))
      .catch(err => alert('fail to fetch'))
    }
  },
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
