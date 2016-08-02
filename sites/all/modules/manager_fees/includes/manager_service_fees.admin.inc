<?php

function _manager_service_feeds_steps(){
  return array(
    1 => array(
      'form' => 'form_flats_service_fees_calculate_info',
    ),
    2 => array(
      'form' => 'form_flats_service_fees_pays_info',
    )
  );
}



function manager_service_fees_form($form, &$form_state) {
  if (empty($form_state['step'])) {
    $form_state['step'] = 1;
    $form_state['step_information'] = _manager_service_feeds_steps();
  }

  $step = &$form_state['step'];
  $form = $form_state['step_information'][$step]['form']($form, $form_state);

  if ($step < count($form_state['step_information'])) {
    $form['next'] = array(
      '#type' => 'submit',
      '#value' => t('Tính toán'),
      '#name' => 'next',
      '#submit' => array('_manager_service_fees_form_calculate_submit'),
    );
  }
  else {
    $form['finish'] = array(
      '#type' => 'submit',
      '#value' => t('Nộp Phí'),
    );
  }

  if (function_exists($form_state['step_information'][$step]['form'] . '_validate')) {
    $form['next']['#validate'] = array($form_state['step_information'][$step]['form'] . '_validate');
  }

  return $form;
}


function form_flats_service_fees_calculate_info($form, &$form_state) {
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
    '#type' => 'select',
    '#options' => $options_month,
  );

  $form['year'] = array(
    '#title' => t('Chọn năm'),
    '#type' => 'select',
    '#options' => $options_year,
  );

  return $form;
}

function form_flats_service_fees_calculate_info_validate($form, &$form_state) {
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
  $month = $values['month'];
  $year = $values['year'];
  $service_fees_nid = array();
  if ($month > 0){
    $nid = _check_node_fees_exit($flats, $month, $year, 'service_fees');
    if ($nid > 0) {
        $node = node_load($nid);
        if ($node->field_fees_status[LANGUAGE_NONE][0]['value'] == 0) {
          $service_fees_nid = $nid;
        }
        else{
          drupal_set_message('Thang nay nop rui', 'status');
          return FALSE;
        }
    }
    else {
      $service_fees_nid = _create_node_service_fees($title, $flats, $month, $year);
    }
  }
  $form_state['values']['service_fees_nid'] = $service_fees_nid;
}


function _manager_service_fees_form_calculate_submit($formm, &$form_state) {
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


function form_flats_service_fees_pays_info($form, &$form_state) {
  $form = array();
  $month = $form_state['step_information'][1]['stored_values']['month'];
  $year = $form_state['step_information'][1]['stored_values']['year'];
  $term_month = taxonomy_term_load($month);
  $month_name = $term_month->name;
  $fees_nid = $form_state['step_information'][1]['stored_values']['service_fees_nid'];
  $flats = $form_state['step_information'][1]['stored_values']['flats'];
  $flats_node = node_load($flats);
  $area = $flats_node->field_dien_tich['und'][0]['value'];
  $flats_type = 1;
  if ($flats_node->field_loai_can_ho['und'][0]['tid']) {
    $flats_type = 2;
  }
  $header = array('Tháng','Diện tích', 'Giá', 'Thành tiền');
  $fees_price = _get_table_fees_price($month, $year);
  $fees_service = $area * $fees_price['service_fees_' . $flats_type];
  $rows = array();
  $rows[]= array(
      'month' => $month_name,
      'area' => $area . ' m2',
      'price' => number_format($fees_price['service_fees_' . $flats_type]),
      'fees' => $fees_service
  );
  $rows[] = array(
    'data' => array(
      array(
        'data' => 'Tổng tiền: ' . number_format($fees_cleaning) . ' VNĐ',
        'colspan' => 4
      )
    )
  );

  $form['info_fees'] = array(
    '#type' => 'markup',
    '#markup' => theme('table', array('header' => $header, 'rows' => $rows))
  );
  $form['nid'] = array(
      '#type' => 'hidden',
      '#value' => $fees_nid
  );

  $form['fees_total'] = array(
    '#type' => 'hidden',
    '#value' => $fees_service
  );


  return $form;
}



function manager_service_fees_form_submit($form, &$form_state) {
  $current_step = &$form_state['step'];
  $form_state['step_information'][$current_step]['stored_values'] = $form_state['values'];
  $fees_total = $form_state['values']['fees_total'];
  $nid = $form_state['values']['nid'];
  _update_node_service_fees($nid, $fees_total);
}
