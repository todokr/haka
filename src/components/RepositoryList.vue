<template>
  <div>
    <h2>Repositories</h2>
    <sui-list divided relaxed>
      <sui-list-item>
        <sui-list-content>
          <a is="sui-list-header">Semantic-Org/Semantic-UI</a>
          <a is="sui-list-description">Updated 10 mins ago</a>
        </sui-list-content>
      </sui-list-item>
      <sui-list-item>
        <sui-list-content>
          <a is="sui-list-header">Semantic-Org/Semantic-UI</a>
          <a is="sui-list-description">Updated 10 mins ago</a>
        </sui-list-content>
      </sui-list-item>
    </sui-list>
    <sui-button default>Add Repository</sui-button>
  </div>
</template>

<script>

  export default {
    name: "repository-list"
  }
</script>

<style scoped>

</style>