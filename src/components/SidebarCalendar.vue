<script setup>
import { onMounted, ref, computed } from 'vue'
import { sample_tasks } from '../utils/sample-tasks'

const tasks = ref([])
const loading = ref(true)

onMounted(async () => {
    tasks.value = await window.callAmplenotePlugin("GetTasks");
    loading.value = false
})

// 1. Separate tasks using computed properties
const allDayTasks = computed(() => {
    return tasks.value.filter(task => task.endAt - task.startAt >= 86400);
})

const hourlyTasks = computed(() => {
    return tasks.value.filter(task => task.endAt - task.startAt <= 86400);
})

const hours = Array.from({ length: 24 }, (_, i) => i)
const HOUR_HEIGHT = 80 

function getTaskStyle(task) {
    const start = new Date(task.startAt * 1000)
    const end = new Date(task.endAt * 1000)

    const startHour = start.getHours()
    const startMinutes = start.getMinutes()
    
    const durationInMs = end - start
    const durationInHours = durationInMs / (1000 * 60 * 60)

    const top = startHour * HOUR_HEIGHT + (startMinutes / 60) * HOUR_HEIGHT
    const height = durationInHours * HOUR_HEIGHT

    return {
        top: `${top}px`,
        height: `${height}px`
    }
}

const today = new Date().toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
})
</script>

<template>
    <section class="calendar-page">
        <div class="calendar-header">
            <h1 class="date">Today's Schedule</h1>
            <p class="subtitle">{{ today }}</p>
            <p v-if="loading" class="loading">Loading tasks...</p>
        </div>

        <!-- 2. Dedicated All-Day Section outside of the hourly grid -->
        <div v-if="!loading && allDayTasks.length" class="all-day-section">
            <div class="all-day-label">all-day</div>
            <div class="all-day-track">
                <div 
                    v-for="task in allDayTasks" 
                    :key="task.content" 
                    class="all-day-badge"
                >
                    {{ task.content }}
                </div>
            </div>
        </div>

        <!-- Hourly Timeline Area -->
        <div v-if="!loading" class="slots-container">
            <div class="timeline-labels">
                <div v-for="hour in hours" :key="'label-' + hour" class="hour-label-slot">
                    <span class="hour-label">
                        {{ hour.toString().padStart(2, '0') }}:00
                    </span>
                </div>
            </div>

            <div class="grid-canvas">
                <div v-for="hour in hours" :key="'grid-' + hour" class="grid-row"></div>

                <div class="task-layer">
                    <!-- Iterates only over filtered hourly tasks -->
                    <div
                        v-for="task in hourlyTasks"
                        :key="task.content"
                        class="task"
                        :style="getTaskStyle(task)"
                    >
                        <span class="task-content">
                            {{ task.content }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.calendar-page {
    min-height: 100vh;
    background: #ffffff;
    font-family: system-ui, sans-serif;
    color: #111827;
}

.calendar-header {
    padding: 1.5rem 1.5rem 0.5rem 1.5rem;
}

.date {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
}

.subtitle {
    margin-top: 0.35rem;
    font-size: 0.9rem;
    color: #6b7280;
}

/* New All-Day Container Styles */
.all-day-section {
    display: flex;
    padding: 0.75rem 1.5rem;
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
    margin-bottom: 1rem;
}

.all-day-label {
    width: 3.5rem;
    flex-shrink: 0;
    font-size: 0.70rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #9ca3af;
    text-align: right;
    padding-right: 0.75rem;
    box-sizing: border-box;
}

.all-day-track {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.all-day-badge {
    background: #e0f2fe;
    border-left: 3px solid #0284c7;
    color: #0369a1;
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
}

/* Core Slots Layout */
.slots-container {
    display: flex;
    padding: 0 1.5rem;
}

.timeline-labels {
    width: 3.5rem;
    flex-shrink: 0;
}

.hour-label-slot {
    height: 80px;
    position: relative;
}

.hour-label {
    position: absolute;
    right: 0.75rem;
    top: -0.5rem;
    font-size: 0.75rem;
    color: #6b7280;
}

.grid-canvas {
    flex-grow: 1;
    position: relative;
    border-left: 1px solid #d1d5db;
}

.grid-row {
    height: 80px;
    border-top: 1px solid #e5e7eb;
    box-sizing: border-box;
}

.task-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.task {
    position: absolute;
    pointer-events: auto;
    left: 0.5rem;
    right: 0.5rem;
    background: #eef2ff;
    border-left: 3px solid #3b82f6;
    border-radius: 8px;
    padding: 0.5rem;
    box-sizing: border-box;
    overflow: hidden;
}

.task-content {
    font-size: 0.85rem;
    font-weight: 500;
    color: #111827;
    display: block;
}
</style>