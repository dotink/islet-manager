import Vue from 'vue';
import template from './views/component.html';

export default Vue.component('is-component', {
    template: template,

    props: [
        'node',
        'selected',
        'focusable'
    ],


    mounted: function() {

    },

    data: function() {
        return {
            module: {
                label: null,
                description: null,
                thumb: null
            }
        };
    },

    computed: {
        label: function() {
            if (this.module.label) {
                return this.module.label;
            }

            switch(this.node.nodeName) {
                case 'P': return 'Paragraph';
                case 'H1': return 'Heading';
                case 'UL': return 'Unordered List';
                case 'OL': return 'Ordered List';
                case 'DL': return 'Definition List';
                case 'DIV': return 'Division';
                case 'SECTION': return 'Section';
                default: return 'Unknown';
            }
        },

        summary: function() {
            return this.node.innerText.slice(0, 60) + '...';
        },

        thumb: function() {
            if (this.module.thumb) {
                return this.module.thumb;
            }

            return 'http://via.placeholder.com/128x72?text=</>';
        }
    }
});
