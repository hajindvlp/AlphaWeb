<?php

  $fn = $_POST['fn'];
  $content = $_POST['content'];
  $dest = "/var/www/html/doc/".$fn;

  file_put_contents($dest, $content);

  fclose($file);

?>