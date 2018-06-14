<template>
  <div>
    <h1>Product Backlog</h1>
    <ul v-for="issue in issues" :key="issue.id">
      <li>
        <h2>{{issue.title}}</h2>
        <small>{{issue.repository}}</small>
      </li>
    </ul>
  </div>
</template>

<script>

import ProductBacklogService from '@/service/ProductBacklogService';

export default {
  name: 'home',
  components: {

  },
  data: () => {
    return {
      issues: []
    }
  },
  mounted() {
    const service = new ProductBacklogService();
    service.listItems().then(issues => this.issues = issues);
  }
}
</script>
