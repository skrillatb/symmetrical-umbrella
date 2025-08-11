<template>
    <button
        class="!cursor-pointer flex whitespace-nowrap rounded-full items-center backdrop-blur-md justify-center tracking-tightest select-none font-[410] transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 gap-2 bg-black text-white hover:bg-black/80 shadow"
        @click="handleClick">
        {{ buttonText }}
    </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    directUrl: {
        type: String,
        required: true
    },
    siteUrl: {
        type: String,
        required: true
    },
    buttonText: {
        type: String,
        required: true
    }
})

const clickCount = ref(0)

const handleClick = (e) => {
    e.preventDefault()

    if (clickCount.value === 0) {
        window.open(props.directUrl, '_blank')
        clickCount.value = 1
    } else if (clickCount.value === 1) {
        window.open(props.siteUrl, '_blank')
        clickCount.value = 0
    }
}

onMounted(() => {
    clickCount.value = 0
})


</script>
