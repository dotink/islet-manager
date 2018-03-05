import Vue from 'vue';
import template from './views/dock.html';

export default Vue.component('dock', {
    template: template,
    data: function() {
        return {
            actions: []
        };
    },

    methods: {
        add: function (name, tooltip, click, data) {
            this.actions.push({
                name: name,
                tooltip: tooltip,
                click: click,
                data: data
            });
        },

        remove: function(name) {
            this.actions = this.actions.filter(function(item) {
                return item.name != name;
            });
        },

        click: function(event) {
            var name = event.target.getAttribute('data-name');

            this.actions.forEach(function(item, index) {
                if (item.name == name) {
                    item.click(event, item.data);
                }
            });

            event.stopPropagation();
        }
    }
});
