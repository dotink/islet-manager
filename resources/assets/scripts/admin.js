import IsletManager from './islets/manager';
import Vue from 'vue';

var islet_manager = new IsletManager({el: document.querySelector('.islet.manager')});
var admin_actions = new Vue({
    el: '#actions',
    data: {
        actions: [

        ]
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
})

let nodes = document.querySelectorAll('[data-islet]');

if (nodes.length) {
  admin_actions.add(
    'start-editing',
    'Click here to begin editing the page content.',
    function(event) {
      event.target.ownerDocument.body.classList.add('editing');

      for (let i = 0; i < nodes.length; i++) {
          // InlineEditor
          //   .create(nodes.item(i))
          //   .then(editor => {
          //     nodes.item(i).editor = editor;
          //   }).catch(error => {
          //     console.error(error);
          //   });

          nodes.item(i).editor = AlloyEditor.editable(nodes.item(i));
      }
    }
  );

  admin_actions.add(
    'start-managing',
    'Click here to manage components on the page.',
    function(event) {
      islet_manager.start();
    }
  );

  admin_actions.add(
    'save-editing',
    'Click here to save your current content.',
    function(event) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes.item(i).editor) {
          nodes.item(i).editor.destroy();
          nodes.item(i).editor = null;
        }
      }

      event.target.ownerDocument.body.classList.remove('editing');

      islet_manager.stop();
    }
  );

  admin_actions.add(
    'exit-mode',
    'Click here to return to the tool selector.',
    function(event) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes.item(i).editor) {
          nodes.item(i).editor.destroy();
          nodes.item(i).editor = null;
        }
      }

      event.target.ownerDocument.body.classList.remove('editing');

      islet_manager.stop();
    }
  );
}
