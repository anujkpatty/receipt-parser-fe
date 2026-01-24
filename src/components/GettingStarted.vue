<template>
  <section class="getting-started">
    <h3 class="getting-started__title">Getting Started</h3>
    <ol class="getting-started__list">
      <li>Upload receipt image</li>
      <li>Wait for image to be processed</li>
      <li>Click on items to edit or toggle in the top right to select</li>
      <li>Create groups to split items</li>
    </ol>
  </section>
</template>

<style scoped>
.getting-started {
  width: 100%;
  margin-top: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  font-style: italic;
}

.getting-started__list {
  margin-top: 8px;
  padding-left: 20px;
  display: grid;
  gap: 6px;
  justify-content: center;
}

.getting-started__title {
  align-self: center;
}
</style>
