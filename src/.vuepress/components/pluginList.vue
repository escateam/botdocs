<script setup>
import { ref, onMounted } from "vue";

const pluginList = ref(null);
const errorMessage = ref(null);

const fetchList = async () => {
  try {
    const response = await fetch('https://yunzai.escateam.icu/plugins', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      console.log(`网络请求失败: ${response.status}`);
    }

    const { data } = await response.json();
    pluginList.value = data;

  } catch (error) {
    console.error('插件列表获取失败:', error);
    errorMessage.value = '插件列表获取失败，请稍后重试';
  }
};

onMounted(() => {
  fetchList();
});
</script>

<template>
  <div class="plugin-container">
    <!-- 加载状态 -->
    <div v-if="!pluginList && !errorMessage" class="loading">
      正在加载插件列表...
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
      <button @click="fetchList">重新加载</button>
    </div>

    <!-- 插件列表 -->
    <div v-if="pluginList" class="plugin-list">
      <h3>已安装插件 ({{ pluginList.length }})</h3>
      <div class="plugin-grid">
        <div v-for="(plugin, index) in pluginList" :key="index" class="plugin-card">
          <div class="plugin-name">{{ plugin.name }}</div>
          <div class="plugin-version">版本: {{ plugin.version }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plugin-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.error {
  color: #ff4d4f;
}

.error button {
  margin-top: 10px;
  padding: 8px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.plugin-list h2 {
  margin-bottom: 20px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.plugin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.plugin-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 16px;
  transition: transform 0.2s;
}

.plugin-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.plugin-name {
  font-weight: bold;
  margin-bottom: 8px;
  color: #1890ff;
}

.plugin-version {
  font-size: 14px;
  color: #666;
}
</style>