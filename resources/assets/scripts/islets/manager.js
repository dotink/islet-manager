import Vue from 'vue';
import IsletComponent from './component';
import IsletModule from './module';
import template from './views/manager.html';

var Sortable = require('sortablejs/Sortable.js');

export default Vue.component('is-manager', {
    template: template,
    components: {IsletComponent},

    data: function() {
        return {
            on: false,
            api: null,
            body: null,
            view: 'help',
            handle: null,
            islets: [],
            sorting: false,
            container: null,
            components: [],
            modules: {
                'section': {
                    label: 'Section',
                    thumb: 'http://via.placeholder.com/128x72?text=</>',
                    description: 'A section, nothing more.',
                    content: '<section data-container data-module="section"></section>'
                },
                'paragraph': {
                    label: 'Paragraph',
                    thumb: 'http://via.placeholder.com/128x72?text=</>',
                    description: 'A paragraph.',
                    content: '<p data-module="paragraph">Lorem ipsum dolor sit ami...</p>'
                }
            }
        };
    },


    computed: {
        selected: function() {
            var count = 0;

            for (var i = 0; i < this.components.length; i++) {
                if (this.components[i].selected) {
                    count++;
                }
            }

            return count;
        }
    },

    methods: {

        //
        //
        //

        add: function(module, event) {
            var template       = document.createElement('template');
            template.innerHTML = module.content.trim();

            for (var i = 0; i < template.content.children.length; i++) {
                this.components.push({
                    node: this.container.appendChild(template.content.children.item(i)),
                    selected: false,
                    manager: this
                });
            }

            this.show('list');
        },

        //
        //
        //

        canFocus: function(el) {
            if (!el.matches) {
                return false;
            } else if (!el.matches('div,section')) {
                return false;
            } else if (!el.matches('[data-islet] *') && !el.matches('[data-islet]')) {
                return false;
            }

            return true;
        },

        //
        //
        //

        canRemove: function(el) {
            if (el.matches('[data-islet]')) {
                return false;
            }

            if (el.children.length > 0) {
                return false;
            }

            if (el.innerText.match(/^\s*$/)) {
                return false;
            }

            return true;
        },

        //
        //
        //

        focus: function(el) {
            while (el) {
                if (this.canFocus(el)) {
                    break;
                }

                el = el.parentNode;
            }

            this.container = el;

            this.$nextTick(function() {
                if (this.components.length == 0) {
                    this.show('help');
                } else {
                    this.show('list');
                }
            });
        },

        //
        //
        //

        highlight: function(islet) {
            this.islets.forEach(function(islet) {
                islet.classList.remove('is-highlighted');
            });

            islet.classList.add('is-highlighted');
        },

        //
        //
        //

        listener: function(e) {
            this.focus(e.target);
        },

        //
        //
        //

        move: function(event) {
            if (event.oldIndex != event.newIndex) {
                var nodes     = this.container.children;
                var subject   = this.container.removeChild(nodes[event.oldIndex]);
                var component = this.components.splice(event.oldIndex, 1)[0];

                //
                // This next if/else is stupid, but it's necessary.  Basically, we undo the DOM
                // move that Sortable just did, cause when we modify the components below Vue will
                // re-render the component list.
                //

                if (event.newIndex < event.oldIndex) {
                    event.from.insertBefore(event.item, event.from.children.item(event.oldIndex).nextSibling);
                } else {
                    event.from.insertBefore(event.item, event.from.children.item(event.oldIndex));
                }

                //
                // Move our components and the associated DOM nodes.
                //

                if (event.newIndex == nodes.length) {
                    this.components.push(component);
                    this.container.appendChild(subject, null);
                } else {
                    this.components.splice(event.newIndex, 0, component);
                    this.container.insertBefore(subject, nodes[event.newIndex]);
                }

                this.sorting = false;
            }
        },

        //
        //
        //

        remove: function() {
            var safe = [];
            var next = this.container;
            var old  = null;

            for (var i = 0; i < this.components.length; i++) {
                if (this.components[i].selected) {
                    this.components[i].node.parentNode.removeChild(this.components[i].node);

                } else {
                    safe.push(this.components[i]);
                }
            }

            this.components = safe;

            while (this.canRemove(next)) {
                old  = next;
                next = old.parentNode;

                next.removeChild(old);
            }

            if (next.innerText.trim() == '') {
                next.innerText = '';
            }

            this.focus(next);
        },

        //
        //
        //

        select: function(key, event) {
            if (!event.ctrlKey && !event.metaKey) {
                for (var i = 0; i < this.components.length; i++) {
                    this.components[i].selected = false;
                }

                this.components[key].selected = true;

            } else {
                if (this.components[key].selected) {
                    this.components[key].selected = false;

                } else {
                    this.components[key].selected = true;
                }
            }
        },

        //
        //
        //

        show: function(view) {
            this.view = view;
        },

        //
        //
        //

        sort: function(key) {
            this.sorting = true;

            for (var i = 0; i < this.components.length; i++) {
                this.components[i].selected = false;
            }

            this.components[key].selected = true;
        },

        //
        //
        //

        start: function() {
            if (this.on) {
                return;
            }

            this.on     = true;
            this.handle = this.$el.ownerDocument.body.addEventListener('click', this.listener);

            this.$el.ownerDocument.body.classList.add('managing');

            this.focus(this.container);
        },

        //
        //
        //

        stop: function() {
            if (!this.on) {
                return;
            }

            this.on = false;

            this.$el.ownerDocument.body.classList.remove('managing');
            this.$el.ownerDocument.body.removeEventListener('click', this.listener);
        }
    },


    watch: {
        container: function(newValue, oldValue) {
            if (oldValue) {
                for (var i = 0; i < this.components.length; i++) {
                    this.components[i].selected = false;
                }

                oldValue.classList.remove('is-focused');
            }

            this.components = [];

            if (newValue) {
                for (var i = 0; i < newValue.children.length; i++) {
                    this.components.push({
                        node: newValue.children.item(i),
                        selected: false,
                        manager: this
                    });
                }

                newValue.classList.remove('is-highlighted');
                newValue.classList.add('is-focused');
            }
        }
    },


    mounted: function() {
        //
        // Don't let our own events bubble up to the event handler.
        //

        this.$el.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        //
        // Load islets
        //

        this.islets = document.querySelectorAll('[data-islet]');

        //
        // Initialize sortable on our component list.
        //

        new Sortable(this.$el.querySelector('.list ol'), {
            handle: '.handle',
            onEnd: this.move
        });

        /*



        */
    }
});
