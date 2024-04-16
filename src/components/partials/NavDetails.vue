<template>
    <li class="has-submenu" v-if="items">
        <a :href="link" @click="toggleElement" :class="{ 'open': isOpen }">
            <i :class="icon"></i>{{ title }} <div class="arrow-down"></div>
        </a>
        <ul class="submenu" :class="{ 'open': isOpen }">
            <li v-for="(item, index) in items" :key="index" :class="{ 'has-submenu': Array.isArray(item.subitems) }">
                <a v-if="!Array.isArray(item.subitems)" :href="item.link"><i v-if="item.icon" :class="item.icon"></i> {{ item.label }}</a>
                <a v-else @click="toggleSubMenu(index)" :href="item.link"><i v-if="item.icon" :class="item.icon"></i> {{ item.label }}<div class="arrow-down"></div></a>
                <ul class="submenu" v-if="Array.isArray(item.subitems)" :class="{ 'open': isSubMenuOpen[index] }">
                    <li v-for="(subitem, subindex) in item.subitems" :key="subindex">
                        <a :href="subitem.link">{{ subitem.label }}</a>
                    </li>
                </ul>
            </li>
        </ul>
    </li>
    <li v-else>
        <a :href="link">
            <i :class="icon"></i>{{ title }}
        </a>
    </li>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        link: {
            type: String,
            default: '#'
        },
        icon: {
            type: String,
            required: true
        },
        items: {
            type: Array,
            default: null
        }
    },
    data() {
        return {
            isOpen: false,
            isSubMenuOpen: []
        };
    },
    methods: {
        toggleElement(){
            this.isSubMenuOpen = this.isSubMenuOpen.map(() => false);
            this.isOpen = !this.isOpen;
        },
        toggleSubMenu(index) {
            this.isSubMenuOpen[index] = !this.isSubMenuOpen[index];
        }
    }
};
</script>