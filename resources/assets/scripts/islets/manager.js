import Vue from 'vue';
import IsletComponent from './component';
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
            islets: [],
            sorting: false,
            container: null,
            components: [],
            selected: 0,
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

    methods: {

        //
        //
        //

        add: function(name) {
            var template       = document.createElement('template');
            var module         = this.modules[name];
            template.innerHTML = module.content.trim();

            if (template.content.children.length != 1) {
                console.error('Bad module template, must be a single element.');

            } else {
                var node = template.content.children.item(0);

                node.dataset.module = name;

                this.container.appendChild(node);
                this.components.push({node: node});
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
            if (this.container) {
                for (var i = 0; i < this.components.length; i++) {
                    if (this.components[i].selected) {
                        this.select(i);
                    }
                }

                this.container.classList.remove('is-focused');
            }

            while (el) {
                if (this.canFocus(el)) {
                    break;
                }

                el = el.parentNode;
            }

            this.components = [];

            if (el) {
                for (var i = 0; i < el.children.length; i++) {
                    this.components.push({node: el.children.item(i)});
                }

                el.classList.remove('is-highlighted');
                el.classList.add('is-focused');
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

            this.selected   = 0;
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

        select: function(key) {
            if (this.components[key].selected) {
                this.components[key].selected = false;
                console.log(this.components[key].node);
                this.components[key].node.classList.remove('is-selected');
                console.log(this.components[key].node);
                this.selected--;

            } else {
                this.components[key].selected = true;
                this.components[key].node.classList.add('is-selected');
                this.selected++;
            }

            if (this.selected) {
                this.container.classList.add('is-has-selected');
            } else {
                this.container.classList.remove('is-has-selected');
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
                if (this.components[i].selected) {
                    this.select(i);
                }
            }

            this.select(key);
        },

        //
        //
        //

        start: function() {
            if (this.on) {
                return;
            }

            this.on = true;

            this.$el.ownerDocument.body.addEventListener('click', this.listener);
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

            this.$el.ownerDocument.body.removeEventListener('click', this.listener);
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

        this.api.getModules();
    }
});
