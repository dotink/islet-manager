<?php if ($_SERVER['REQUEST_URI'] == '/api/v1/islets/modules') { ?>
    <?php header('Content-Type: application/json'); ?>
    {
        "section": {
            "label": "Section",
            "thumb": "http://via.placeholder.com/128x72?text=</>",
            "description": "A section, nothing more.",
            "content": <?= json_encode(file_get_contents(__DIR__ . '../../resources/components/section.html')) ?>,
            "allows": ["html"],
            "types": ["html"]
        },
        "word": {
            "label": "Word",
            "thumb": "http://via.placeholder.com/128x72?text=Word",
            "description": "A paragraph.",
            "content": <?= json_encode(file_get_contents(__DIR__ . '../../resources/components/paragraph.html')) ?>
        }
    }

<?php } else { ?>
    <!doctype html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
        <link href="/assets/styles/main.css" rel="stylesheet">

      </head>
      <body>
        <header>

        </header>
        <main>
          <h1>Example Page</h1>
          <section data-islet="Primary">Test</section>
          <section data-islet="Secondary">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            <p>Nesciunt error deleniti quia, unde vitae doloremque!</p>
            <p>Eum quas at veritatis sunt architecto quos veniam ullam perferendis, atque consectetur, eos, ducimus nemo ipsum consequuntur accusantium!</p>
            <p>Cumque ea ad, reprehenderit.</p>
          </section>
        </main>
        <footer>

        </footer>

        <?php include(__DIR__ . '/islets.php') ?>
      </body>
    </html>
<?php } ?>
