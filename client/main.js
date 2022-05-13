import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js'
import axios from 'https://cdn.skypack.dev/axios'

new Vue({
  el: '#app',
  data() {
    return {
      dishes: [],
      modal: false,
      title: '',
      description: '',
      price: null,
      fastcook: false,
      delivery: false
    }
  },
  computed: {
    canCreate() {
      return this.title && this.description && !this.price
    }
  },
  methods: {
      async createDish(){
        let newDish = {
          dish_id: 1,
          title: this.title,
          description: this.description,
          price: this.price,
          fastcook: this.fastcook,
          delivery: this.delivery
        }
        await axios.post('/newdish', newDish)
        this.correctForm(newDish)
        this.dishes.push(newDish)
        this.modal = false
        this.title = ''
        this.description = ''
        this.price = null
        this.fastcook = false
        this.delivery = false
        console.log('Ok');
      },
    async removeDish(id) {
      await axios.delete(`/dish/${id}`)
      this.dishes = this.dishes.filter(e => e.id !== id)
    },
    showModal() {
      this.modal = true
    },
    closeModal() {
      this.modal = false
    },
    correctForm(element){
      if(element.fastcook === true) {
        element.fastcook = 'да'
      } 
      else {
        element.fastcook = 'нет'
      }
      if(element.delivery === true) {
        element.delivery = 'да'
      } 
      else {
        element.delivery = 'нет'
      }
      return element
    }
  },
  async mounted() {
    let response = await axios.get('/dishes')
    let arr = Object.values(response.data)
    arr.forEach(element => {
      this.correctForm(element)
      this.dishes.push(element)
      console.log(element);
    });
  }
})