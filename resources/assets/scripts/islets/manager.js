import Vue from 'vue';
import IsletComponent from './component';
import IsletModule from './module';

export default Vue.extend({
    data: function() {
        return {
            on: false,
            api: null,
            body: null,
            view: 'help',
            handle: null,
            islets: [],
            sorting: false,
            selected: 0,
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


    methods: {

        //
        //
        //

        add: function(module, event) {
            var template       = document.createElement('template');
            template.innerHTML = module.content.trim();

            for (var i = 0; i < template.content.children.length; i++) {
                this.components.push(new IsletComponent({
                    el: this.container.appendChild(template.content.children.item(i)),
                    data: {
                        manager: this
                    }
                }));
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
                var nodes   = this.container.children;
                var subject = this.container.removeChild(nodes[event.oldIndex]);

                if (event.newIndex == nodes.length) {
                    this.container.appendChild(subject, null);

                } else {
                    this.container.insertBefore(subject, nodes[event.newIndex]);

                }
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
                    this.components[i].deselect();
                    this.components[i].$el.parentNode.removeChild(this.components[i].$el);

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

        select: function(component, event) {
            if (event.ctrlKey || event.metaKey) {
                component.toggleSelected();

            } else if (component.selected) {
                component.deselect();

            } else {
                for (var i = 0; i < this.components.length; i++) {
                    if (this.components[i] != component) {
                        this.components[i].deselect();

                    } else {
                        this.components[i].select();
                    }
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

        sort: function(component) {
            this.components.forEach(function(component) {
                component.deselect();
            });

            if (!this.sorting) {
                this.sorting = true;
                component.select();

            } else {
                this.sorting = false;
            }
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
        selected: function(newValue, oldValue) {
            if (newValue > 0) {
                this.container.classList.add('is-has-selected');

            } else {
                this.container.classList.remove('is-has-selected');
            }
        },

        container: function(newValue, oldValue) {
            this.components = [];
            this.selected   = 0;

            if (oldValue) {
                oldValue.classList.remove('is-has-selected');
                oldValue.classList.remove('is-focused');
            }

            if (newValue) {
                for (var i = 0; i < newValue.children.length; i++) {
                    this.components.push(new IsletComponent({
                        el: newValue.children.item(i),
                        data: { manager: this }
                    }));
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
    }
});
