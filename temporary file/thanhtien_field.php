<?php
	if (isset($data->field_field_loai_phi[0]['raw']['value'])) {
		$loai_phi = (int)$data->field_field_loai_phi[0]['raw']['value'];
	}
	if (isset($data->field_field_start_date[0]['raw']['value2'])) {
		$end_month_paid = (int)substr($data->field_field_start_date[0]['raw']['value2'], 5, 2);
	}
	if (isset($data->field_field_don_gia_khac[0]['raw']['value'])) {
		$gia_khac = (int)$data->field_field_don_gia_khac[0]['raw']['value'];
	}
	$dien_tich = (int)$data->field_field_dien_tich[0]['raw']['value'];
	$current_month = (int)date('m');

	if (isset($gia_khac) && isset($dien_tich) && ($end_month_paid >= $current_month)) {
		echo number_format($gia_khac * $dien_tich);
	} elseif (isset($loai_phi) && isset($dien_tich) && ($end_month_paid >= $current_month)) {
		echo number_format($loai_phi * $dien_tich);
	} else {
		echo '0';
	}
?>