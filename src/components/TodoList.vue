<template>
  <ElContainer class="list-container">
    <ElHeader>待办事项列表</ElHeader>
    <ElMain class="list-main">
      <div class="list-main__add-list">
        <ElInput
          v-model="inputValue"
          placeholder="请输入待办事项"
          @keyup.enter="addTodo"
          clearable
        ></ElInput>
        <ElButton type="primary" @click="addTodo">添加</ElButton>
      </div>
      <ElSelect v-model="filter" placeholder="请选择过滤条件">
        <ElOption
          v-for="item in filters"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></ElOption>
      </ElSelect>
      <ElTable :data="filteredTodoList" :border="true">
        <ElTableColumn prop="description" label="待办事项">
          <template #default="scope">
            <ElInput
              v-model="scope.row.description"
              @blur="updateTodo(scope.row)"
              :readonly="scope.row.readonly"
              @click="editTodo(scope.row)"
            ></ElInput>
          </template>
        </ElTableColumn>
        <ElTableColumn>
          <template #default="scope">
            <ElButton type="danger" @click="deleteTodo(scope.row)">
              删除此事项
            </ElButton>
          </template>
        </ElTableColumn>
        <ElTable-column label="是否完成" prop="completed">
          <template #default="scope">
            <ElCheckbox size="large" v-model="scope.row.completed"></ElCheckbox>
          </template>
        </ElTable-column>
      </ElTable>
    </ElMain>
  </ElContainer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const inputValue = ref('')
const todoList = ref([])
const filter = ref('')
const filterByTime = ref('')

const loadTodoListFromLocalStorage = () => {
  const savedTodoList = localStorage.getItem('todoList')
  if (savedTodoList) {
    return JSON.parse(savedTodoList)
  }
  return []
}

const saveTodoListToLocalStorage = (todoList) => {
  localStorage.setItem('todoList', JSON.stringify(todoList))
}

const filters = [
  { value: '', label: '所有待办事项' },
  { value: 'false', label: '未完成的待办事项' },
  { value: 'true', label: '已完成的待办事项' },
  { value: 'today', label: '今天添加的待办事项' },
  { value: 'week', label: '本周添加的待办事项' },
]

const addTodo = () => {
  if (inputValue.value) {
    const newTodo = {
      description: inputValue.value,
      completed: false,
      readonly: true,
      addedAt: new Date().toISOString(),
    }
    todoList.value.push(newTodo)
    inputValue.value = ''
    saveTodoListToLocalStorage(todoList.value)
  }
}

const updateTodo = (todo) => {
  const index = todoList.value.findIndex((t) => t === todo)
  if (index !== -1) {
    todoList.value[index] = { ...todo }
    saveTodoListToLocalStorage(todoList.value)
  }
}

const deleteTodo = (todo) => {
  const index = todoList.value.findIndex((t) => t === todo)
  if (index !== -1) {
    todoList.value.splice(index, 1)
    saveTodoListToLocalStorage(todoList.value)
  }
}

const editTodo = (todo) => {
  todo.readonly = false
}

const filterTodoList = (todoList) => {
  if (filter.value === '') {
    return todoList
  }

  if (filterByTime.value !== '') {
    const now = new Date()
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay() + 1
    )
    startOfWeek.setHours(0, 0, 0, 0)

    const filteredByTime = todoList.filter((todo) => {
      const todoDate = new Date(todo.addedAt)
      switch (filterByTime.value) {
        case 'today':
          return todoDate.toDateString() === now.toDateString()
        case 'week':
          return (
            todoDate >= startOfWeek &&
            todoDate < new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
          )
        default:
          return true
      }
    })
    return filteredByTime.filter(
      (todo) => todo.completed === (filter.value === 'true')
    )
  }

  return todoList.filter((todo) => todo.completed === (filter.value === 'true'))
}

const filteredTodoList = computed(() => {
  return filterTodoList(todoList.value)
})

onMounted(() => {
  todoList.value = loadTodoListFromLocalStorage()
})

onUnmounted(() => {
  localStorage.removeItem('todoList')
})
</script>
<style lang="scss">
.list-container {
  .list-main {
    margin: 0 auto;
    width: 60%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    &__add-list {
      display: flex;
      gap: 10px;
    }
  }
}
</style>
