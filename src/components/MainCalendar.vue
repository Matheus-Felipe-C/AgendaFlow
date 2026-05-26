<script setup>
import { computed, onMounted, ref } from 'vue';
import DayColumn from './DayColumn.vue';
import Taskcard from './Taskcard.vue';
import { Plus, Minus } from 'lucide-vue-next';
import { sample_tasks } from '../utils/sample-tasks';

const tasks = ref([]);

onMounted(async () => {
    // tasks.value = await window.callAmplenotePlugin("getTasks");
    tasks.value = sample_tasks;
})

const daysToShow = 3;

const startOffset = ref(0)

const dates = computed(() => {
    return Array.from({ length: daysToShow }, (_, index) => {
        const date = new Date();

        date.setDate(
            date.getDate() + startOffset.value + index
        )

        return date;
    })
}) 

function nextDays() {
    startOffset.value++;
}

function previousDays() {
    startOffset.value--;
}

function resetDays() {
    startOffset.value = 0;
}
</script>

<template>
    <div class="navigation-btn">
        <button @click="previousDays"><Minus :size="16"></Minus></button>
        <button @click="nextDays"><Plus :size="16"></Plus></button>
        <button @click="resetDays">Today</button>
    </div>
    <div class="main-container">
        <div class="task-container">
            <DayColumn 
                v-for="date in dates" 
                :key="date.toISOString()" 
                :date="date" 
                :tasks="tasks"
                >
            </DayColumn>
        </div>
        <div class="sidebar-container">
            <h1>Sidebar</h1>
        </div>
    </div>
</template>

<style>
body {
    margin: 0;
}

.main-container {
    display: flex;
    min-height: 100vh;

    background: #f9f9f8;
    color: #1a1a18;
    font-family: system-ui, sans-serif;
}

.task-container {
    display: flex;
    gap: 20px;

    overflow-x: auto;

    flex: 1;
    padding: 20px;
}


.sidebar-container {
    width: 200px;

    background: 20px;
    padding: 20px;
    border-left: 1px solid #ddd;
}

.navigation-btn {
    margin-top: 12px;
    margin-left: 12px;
    display: flex;
    gap: 8px;
    padding: 12px 20px;
}

.navigation-btn button {
    background: white;
    border: 1px solid #eceae7;
    width: 60px;
    height: 30px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.navigation-btn button:hover {
    background: #f3f2f0;
    border-color: #d6d3cf;
    transform: translateY(-1px);
}

.navigation-btn button:active {
    transform: translateY(0);
}
</style>