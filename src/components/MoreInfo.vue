<template>
  <div>
    <div class="mb-2" v-for="(value, key) in item" :key="value">
      <small
        >{{ key }} : <b>{{ value }}</b></small
      >
    </div>
  </div>
</template>

<script>
export default {
  props: ["item"],
};
</script>
