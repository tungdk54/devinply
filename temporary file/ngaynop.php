<?php
	if (isset($data->field_field_start_date[0]['raw']['value2'])) {
		$month_paid = (int)substr($data->field_field_start_date[0]['raw']['value2'], 5, 2);
	}
	if (isset($data->field_field_start_date[0]['raw']['value'])) {
		$start_date = $data->field_field_start_date[0]['raw']['value'];
	}

	if (isset($month_paid) && ($month_paid >= date('m'))) {
		echo substr($start_date, 0, 10);
	} else {
		echo "Chưa nộp";
	}
?>