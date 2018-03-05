import IsletManager from './islets/manager';
import Dock from './dock';

var islet_manager = new IsletManager({el: document.querySelector('#manager')});
var dock          = new Dock({el: document.querySelector('#dock')});
var islets        = document.querySelectorAll('[data-islet]');


if (islets.length) {
  dock.add(
    'start-editing',
    'Click here to begin editing the page content.',
    function(event) {
      event.target.ownerDocument.body.classList.add('editing');

      for (let i = 0; i < islets.length; i++) {
          // InlineEditor
          //   .create(islets.item(i))
          //   .then(editor => {
          //     islets.item(i).editor = editor;
          //   }).catch(error => {
          //     console.error(error);
          //   });

          islets.item(i).editor = AlloyEditor.editable(islets.item(i));
      }
    }
  );

    dock.add(
        'start-managing',
        'Click here to manage components on the page.',
        function(event) {
            islet_manager.start();
        }
    );

    dock.add(
        'save-editing',
        'Click here to save your current content.',
        function(event) {
            for (let i = 0; i < islets.length; i++) {
                if (islets.item(i).editor) {
                    islets.item(i).editor.destroy();
                    islets.item(i).editor = null;
                }
            }

            event.target.ownerDocument.body.classList.remove('editing');

            islet_manager.stop();
        }
    );

    dock.add(
        'exit-mode',
        'Click here to return to the tool selector.',
        function(event) {
            for (let i = 0; i < islets.length; i++) {
                if (islets.item(i).editor) {
                    islets.item(i).editor.destroy();
                    islets.item(i).editor = null;
                }
            }

            event.target.ownerDocument.body.classList.remove('editing');

            islet_manager.stop();
        }
    );
}
