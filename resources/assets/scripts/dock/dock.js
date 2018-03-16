import Vue from 'vue';
import template from './views/dock.html';

export default Vue.component('dock', {
    template: template,
    data: function() {
        return {
            mode: null,
            actions: []
        };
    },

    methods: {
        add: function (name, modes, tooltip, click) {
            this.actions.push({
                name: name,
                modes: modes,
                tooltip: tooltip,
                click: click
            });
        },

        click: function(event) {
            var name = event.target.getAttribute('data-name');

            for (var item of this.actions) {
                if (item.name == name) {
                    if (typeof item.click == 'string') {
                        document.location = item.click;
                    } else {
                        item.click(this, event);
                    }
                }
            }

            event.stopPropagation();
        },

        isMode: function(mode) {
            return this.mode == mode;
        },

        switch: function(mode) {
            if (this.mode) {
                document.body.classList.remove(this.mode)
            }

            if (mode) {
                document.body.classList.add(mode);
            }

            this.mode = mode;
        }
    }
});
