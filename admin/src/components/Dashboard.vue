<template>
  <div class="container-fluid">
    <table class="table table-striped">
      <thead>
        <tr>
          <td>Time</td>
          <td>Value</td>
          <td>Description</td>
        </tr>
      </thead>
      
      <tbody>
        <tr v-for="payment in payments">
          <td>{{ payment.time }}</td> 
          <td>{{ payment.value }}</td>   
          <td>{{ payment.description }}</td>   
        </tr> 
      </tbody>
    </table>
  </div>
</template>

<script>
import Pusher from 'pusher-js'

const MOCK_PAYMENTS = [
  {time : '12th Dec, 2017', description: "Shoes", value : "$5"},
  {time : '12th Dec, 2017', description: "Maga don pay", value : "$12"}
]
export default {
  name: 'Dashboard',
  data () {
    return {
      payments : MOCK_PAYMENTS
    }
  },
  created () {
    this.subscribe();
  },
  methods: {
    subscribe () {
      let pusher = new Pusher('PUSHER_API_KEY', {
          cluster: 'eu',
          encrypted: true
      });
      pusher.subscribe('sales');
      pusher.bind('payment-completed', data => {
        this.payments.unshift(data);
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.table{
  background-color : white;
}
</style>
