<script setup>
import { onMounted, ref } from 'vue'
import { sample_tasks } from '../utils/sample-tasks'

const tasks = ref([])
const loading = ref(true)

onMounted(() => {
    tasks.value = sample_tasks
    loading.value = false
})

const hours = Array.from({ length: 24 }, (_, i) => i)

// Configurable height mapping to keep JS and CSS in sync
const HOUR_HEIGHT = 80 

function getTaskStyle(task) {
    const start = new Date(task.startAt * 1000)
    const end = new Date(task.endAt * 1000) // Ensure your sample data has endAt

    const startHour = start.getHours()
    const startMinutes = start.getMinutes()
    
    // Calculate duration in hours
    const durationInMs = end - start
    const durationInHours = durationInMs / (1000 * 60 * 60)

    // Calculate position
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
                    <div
                        v-for="task in tasks"
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
    padding: 1.5rem;
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

.loading {
    margin-top: 2rem;
    color: #6b7280;
}

/* Flex layout keeps the labels and grid perfectly separated */
.slots-container {
    display: flex;
    padding: 0 1.5rem;
}

.timeline-labels {
    width: 3.5rem;
    flex-shrink: 0;
}

.hour-label-slot {
    height: 80px; /* Matches HOUR_HEIGHT */
    position: relative;
}

.hour-label {
    position: absolute;
    right: 0.75rem;
    top: -0.5rem;
    font-size: 0.75rem;
    color: #6b7280;
}

/* The true relative canvas where tasks and grid overlap safely */
.grid-canvas {
    flex-grow: 1;
    position: relative;
    border-left: 1px solid #d1d5db; /* The vertical line */
}

.grid-row {
    height: 80px; /* Matches HOUR_HEIGHT */
    border-top: 1px solid #e5e7eb;
    box-sizing: border-box;
}

/* Absolute positioning layer constrained entirely to the grid area */
.task-layer {
    position: absolute;
    inset: 0;
    pointer-events: none; /* Allows scrolling/clicking through blank areas */
}

/* Event cards */
.task {
    position: absolute;
    pointer-events: auto; /* Restores interactivity to the actual task */
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