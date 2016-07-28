<?php
	if (isset($data->field_field_start_date[0]['raw']['value2'])) {
		$end_month_paid = (int)substr($data->field_field_start_date[0]['raw']['value2'], 5, 2);
	}
	if (isset($data->field_field_start_date[0]['raw']['value2'])) {
		$year_paid = (int)substr($data->field_field_start_date[0]['raw']['value2'], 0, 4);
	}
	
	$current_month = (int)date('m');
	$current_year = (int)date('Y');

	if (!isset($data->field_field_start_date[0]['raw']['value2'])) {
		echo "Chưa đóng phí";
	} elseif (($year_paid < $current_year) && ($end_month_paid == 12)) {
		echo "Đã thanh toán hết năm " . $year_paid;
	} elseif (($year_paid < $current_year) && ($end_month_paid < 12)) {
		echo "Chưa nộp từ tháng " . ($end_month_paid + 1) . " năm " . $year_paid;
	} elseif (($year_paid == $current_year) && ($current_month <= $end_month_paid)) {
		echo "Đã nộp tiền tháng " . $current_month;
	} elseif (($year_paid == $current_year) && (($current_month - $end_month_paid) == 1)) {
		echo "Chưa nộp tháng " . $current_month;
	} elseif (($year_paid == $current_year) && (($current_month - $end_month_paid) > 1)) {
		echo "Chưa nộp tháng từ tháng " . ($end_month_paid + 1) . " đến tháng ". $current_month;
	}
?>