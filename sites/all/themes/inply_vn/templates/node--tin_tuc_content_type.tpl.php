<div class="node-tin-tuc">
  <?php
    echo '<h1>'.$node->title.'</h1>';
    if(isset($node->field_short_description['und'][0]['value']))
    echo '<div class="short_des">'.$node->field_short_description['und'][0]['value'].'</div>';
    if(isset($node->body['und'][0]['value']))
    echo '<div class="body_node">'.$node->body['und'][0]['value'].'</div>';  
  ?>
</div>