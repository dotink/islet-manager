import Dock from './dock/dock';
import API from  './islets/api';
import IsletManager from './islets/manager';

let api     = new API('/api/v1/islets/');
let dock    = new Dock({el: document.querySelector('#dock')});
let manager = new IsletManager({el: document.querySelector('#manager'), data: {api: api}});
let islets  = document.querySelectorAll('[data-islet]');

if (islets.length) {
    dock.add(
        'start-editing',
        [null],
        'Click here to begin editing the page content.',
        function(dock, event) {
            dock.switch('editing');

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
        [null],
        'Click here to manage components on the page.',
        function(dock, event) {
            dock.switch('managing');

            manager.start();
        }
    );

    dock.add(
        'save-editing',
        ['editing', 'managing'],
        'Click here to save your current content.',
        function(dock, event) {
            if (dock.isMode('editing')) {
                for (let i = 0; i < islets.length; i++) {
                    if (islets.item(i).editor) {
                        islets.item(i).editor.destroy();
                        islets.item(i).editor = null;
                    }
                }
            }

            if (dock.isMode('managing')) {
                manager.stop();
            }

            dock.switch(null);
        }
    );

    dock.add(
        'exit-mode',
        ['editing', 'managing'],
        'Click here to return to the tool selector.',
        function(dock, event) {
            if (dock.isMode('editing')) {
                for (let i = 0; i < islets.length; i++) {
                    if (islets.item(i).editor) {
                        islets.item(i).editor.destroy();
                        islets.item(i).editor = null;
                    }
                }
            }

            if (dock.isMode('managing')) {
                manager.stop();
            }

            dock.switch(null);
        }
    );
}


dock.add(
    'test',
    [null],
    'Yep',
    '/test'
)
