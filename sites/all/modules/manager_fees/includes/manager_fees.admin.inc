<?php

function _manager_feeds_steps(){
  return array(
    1 => array(
      'form' => 'form_flats_fees_calculate_info',
    ),
    2 => array(
      'form' => 'form_flats_fees_pays_info',
    )
  );
}



function manager_fees_form($form, &$form_state) {
  if (empty($form_state['step'])) {
    $form_state['step'] = 1;
    $form_state['step_information'] = _manager_feeds_steps();
  }

  $step = &$form_state['step'];
  $form = $form_state['step_information'][$step]['form']($form, $form_state);

  if ($step < count($form_state['step_information'])) {
    $form['next'] = array(
      '#type' => 'submit',
      '#value' => t('Thành tiền'),
      '#name' => 'next',
      '#submit' => array('_manager_fees_form_calculate_submit'),
    );
  }
  else {
    $form['finish'] = array(
      '#type' => 'submit',
      '#value' => t('Nộp'),
    );
  }

  if (function_exists($form_state['step_information'][$step]['form'] . '_validate')) {
    $form['next']['#validate'] = array($form_state['step_information'][$step]['form'] . '_validate');
  }

  return $form;
}


function form_flats_fees_calculate_info($form, &$form_state) {
  $form = array();
  $options_month = array();
  $options_year = array();
  $terms_month = taxonomy_get_tree(13);
  foreach ($terms_month as $key => $term) {
    $options_month[$term->tid] = $term->name;
  }
  $terms_year = taxonomy_get_tree(14);
  foreach ($terms_year as $key => $term) {
    $options_year[$term->tid] = $term->name;;
  }


  $form['flats'] = array(
    '#title' => t('Chọn căn hộ'),
    '#type' => 'textfield',
    '#autocomplete_path' => 'get-flast',
  );

  $form['month'] = array(
    '#title' => t('Chọn tháng'),
    '#type' => 'checkboxes',
    '#options' => $options_month,
  );

  $form['year'] = array(
    '#title' => t('Chọn năm'),
    '#type' => 'select',
    '#options' => $options_year,
  );

  return $form;
}

function form_flats_fees_calculate_info_validate($form, &$form_state) {
  $values = $form_state['values'];
  //Validate title of Flast
  $title = $values['flats'];
  $matches = array();
  $result = preg_match('/\[([0-9]+)\]$/', $title, $matches);
  if ($result > 0) {
    $nid = $matches[$result];
    $node = node_load($nid);
    if (empty($node)) {
      form_error($form['node'], t('Sorry, no node with nid %nid can be found', array('%nid' => $nid)));
      return;
    }
  }
  else {
    $nid = db_select('node')
      ->fields('node', array('nid'))
      ->condition('title', db_like($title) . '%', 'LIKE')
      ->range(0, 1)
      ->execute()
      ->fetchField();
  }
  if (!empty($nid)) {
    $form_state['values']['flats'] = $nid;
  }
  else {
    form_error($form['flats'], t('Sorry, no node starting with %title can be found', array('%title' => $title)));
  }

  //Check fees node exited and create if not exit
  $flats = $form_state['values']['flats'];
  $months = array_values($values['month']);
  $year = $values['year'];
  $fees_nids = array();
  foreach ($months as $month) {
    if ($month > 0){
      $nids = _check_node_fees_exit($flats, $month, $year);
      if (is_array($nids)) {
        foreach ($nids as $key => $nid) {
          $fees_nids[$nid] = array(
            'month' => $month,
            'year' => $year
          );
        }

      }
      if ($nids == 0) {
        $nid = _create_node_fees($title, $flats, $month, $year);
        $fees_nids[$nid] = array(
          'month' => $month,
          'year' => $year
        );
      }
    }
  }
  $form_state['values']['fees_nids'] = $fees_nids;
}


function _manager_fees_form_calculate_submit($formm, &$form_state) {
  $current_step = &$form_state['step'];
  $form_state['step_information'][$current_step]['stored_values'] = $form_state['values'];
  if ($current_step < count($form_state['step_information'])) {
    $current_step++;
    if (!empty($form_state['step_information'][$current_step]['stored_values'])) {
      $form_state['values'] = $form_state['step_information'][$current_step]['stored_values'];
    }
    else {
      $form_state['values'] = array();
    }
    // Force rebuild with next step.
    $form_state['rebuild'] = TRUE;
    return;
  }

}


function form_flats_fees_pays_info($form, &$form_state) {
  $form = array();

  $fees_nids = $form_state['step_information'][1]['stored_values']['fees_nids'];
  $flats = $form_state['step_information'][1]['stored_values']['flats'];
  $flats_node = node_load($flats);
  $area = $flats_node->field_dien_tich['und'][0]['value'];
  $flats_type = 1;
  if ($flats_node->field_loai_can_ho['und'][0]['tid']) {
    $flats_type = 2;
  }
  $header = array('Thang', 'Phi Dich Vu', 'Phi Ve Sinh', 'Phi Gui xe');
  $rows = array();
  $vehicles = _get_vehicles($flats);
  $fees_nodes = array();
  $fees_total = 0;
  foreach ($fees_nids as $nid => $fees) {
    $term_month = taxonomy_term_load($fees['month']);
    $month_name = $term_month->name;
    $time = _convert_taxonomy_to_time($fees['month'], $fees['year']);
    if ($time !== date('n-Y')) {
      $fees_nodes[$nid]['fees_total'] = 0;
    }
    $fees_price = _get_table_fees_price($fees['month'], $fees['year']);
    $rows[$fees['month']]['month'] = $month_name;
    $fees_vehicles = 0;
    foreach ($vehicles as $key => $type) {
      $fees_vehicles += $fees_price[$type];
    }
    $fees_total += $fees_vehicles;
    $fees_nodes[$nid]['vehicles'] = $vehicles;
    $fees_service = $area * $fees_price['service_fees_' . $flats_type];
    $fees_total += $fees_service;
    $fees_nodes[$nid]['fees_service'] = $fees_service;
    $rows[$fees['month']]['service'] = money_format( "%i VND", $fees_service);
    $fees_clean = $area * $fees_price['clean_fees_' . $flats_type];
    $fees_nodes[$nid]['fees_clean'] = $fees_clean;
    $fees_total += $fees_clean;
    $rows[$fees['month']]['clean'] = money_format( "%i VND", $fees_clean);
    $fees_nodes[$nid]['fees_vehicles'] = $fees_vehicles;
    $rows[$fees['month']]['vehicles'] = money_format( "%i VND", $fees_vehicles);
  }
  $rows[] = array(
    'data' => array(
      array(
        'data' => 'Tong tien:   ' . money_format( "%i VND", $fees_total),
        'colspan' => 4
      )
    )
  );

  $form['info_fees'] = array(
    '#type' => 'markup',
    '#markup' => theme('table', array('header' => $header, 'rows' => $rows))
  );

  $form['fees_total'] = array(
    '#type' => 'hidden',
    '#value' => $fees_total
  );

  $form['fees_nodes'] = array(
    '#type' => 'hidden',
    '#value' => serialize($fees_nodes)
  );

  return $form;
}



function manager_fees_form_submit($form, &$form_state) {
  $current_step = &$form_state['step'];
  $form_state['step_information'][$current_step]['stored_values'] = $form_state['values'];
  $fees_total = $form_state['values']['fees_total'];
  $fees_nodes = $form_state['values']['fees_nodes'];
  $fees_nodes = unserialize($fees_nodes);
  foreach ($fees_nodes as $nid => $fees) {
    _update_node_fees($nid, $fees, $fees_total);
  }
}



function ajax_get_flast($string = "") {
  $matches = array();
  if ($string) {
    $result = db_select('node')
      ->fields('node', array('title', 'nid'))
      ->condition('title', db_like($string) . '%', 'LIKE')
      ->condition('type', 'can_ho', '=')
      ->range(0, 10)
      ->execute();
    foreach ($result as $node) {
      $matches[$node->title] = check_plain($node->title) . " (nid=$node->nid)";
    }
  }

  drupal_json_output($matches);
}
