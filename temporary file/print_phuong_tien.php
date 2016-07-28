<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="<?php echo '#QuanLyPhuongtien'.$data->nid; ?>">Print</button>
<!-- Modal -->
<div id="<?php echo 'QuanLyPhuongtien'.$data->nid; ?>" class="modal fade" role="dialog">
  	<div class="modal-dialog">
    <!-- Modal content-->
	    <div class="modal-content">
	      	<div class="modal-header">
	        	<button type="button" class="close" data-dismiss="modal">&times;</button>
	      	</div>
	      	<div class="modal-body">
		        <div class="hoadonWrapper printPage">
		          	<div class="tieude center">
		            	<p>Công ty TNHH Tư vấn Thương Mại và Dịch Vụ Inply - Ban quản lý tòa nhà</p>
		            	<h4 class="modal-title">Biên nhận thu phí</h4>
		            	<p class="center"><?php echo "Ngày ".date('d')." tháng ".date('m')." năm ".date('Y'); ?></p>
		          	</div>
			        <div class="noidungThanhToan">
			            <?php if(isset($data->field_field_nguoi_thue[0]['rendered']['#title']) && isset($data->field_field_ngay_het_han[0]['raw']['value']) && $data->field_field_ngay_het_han[0]['raw']['value'] > date("Y-m-d H:i:s") ): ?>
			              <p>Tên khách hàng: <strong><?php echo $data->field_field_nguoi_thue[0]['rendered']['#title']; ?></strong></p>
			              <p>Mã khách hàng: <?php  if(isset($data->field_field_ma_khach_hang[0]['raw']['value'])) echo $data->field_field_ma_khach_hang[0]['raw']['value'];?></p>
			            <?php else: ?>
			              <p>Tên khách hàng: <strong><?php echo $data->field_field_ten_chu_so_huu[0]['rendered']['#title']; ?></strong></p>
			              <p>Mã khách hàng: <?php  if(isset($data->field_field_ma_khach_hang_1[0]['raw']['value'])) echo $data->field_field_ma_khach_hang_1[0]['raw']['value'];?></p>
			            <?php endif; ?>
			            
			            <p>Địa chỉ: <strong>Phòng <?php echo $data->node_title; ?> - <?php echo $data->field_field_du_an[0]['rendered']['#title']; ?></strong><span class="space-tab">    </span>Diện tích: <?php echo $data->field_field_dien_tich[0]['raw']['value'] . " (m&sup2;)"?></p>
			            <p>Số hóa đơn: </p>
			            <p>Hình thức thanh toán: <?php  if(isset($data->field_field_ht_thanhtoan[0]['raw']['value'])) echo $data->field_field_ht_thanhtoan[0]['raw']['value'];?></p>
			            <p>Nội dung thanh toán: Thanh toán tiền gửi xe</p>
			            <p>Bằng chữ: </p>

			            <table class="guixe-table">
			            	<thead>
			            		<th>Nội dung</th>
			            		<th>Biển số</th>
			            		<th>Đơn giá (VNĐ)</th>
			            		<th>Tháng sử dụng</th>
			            		<th>Thành tiền</th>
			            	</thead>
			            	<tbody>
			            		<?php
			            			$DIEN_TICH = (int)$data->field_field_dien_tich[0]['raw']['value'];
			            			$CURRENT_DATE = date('Y-m-d');
			            			$CURRENT_MONTH = (int)date('m');
												$CURRENT_YEAR = (int)date('Y');
			            			//So sanh ngay nop tien voi $CURRENT_DATE de xuat ra hoa don
			            			//$PAYMENT_DATE_DICHVU = substr(date, 0, 10);

			            			//============ PHI DICH VU ===============//
			            			if(isset($data->field_field_phi_dich_vu)){

													$dichvu_id = (int)$data->field_field_phi_dich_vu[0]['raw']['value'];

													if (isset($data->field_field_phi_dich_vu[0]['rendered']['entity']['field_collection_item'][$dichvu_id]['field_start_date']['#items'][0]['value'])) {
														$start_month_paid = (int)substr($data->field_field_phi_dich_vu[0]['rendered']['entity']['field_collection_item'][$dichvu_id]['field_start_date']['#items'][0]['value'], 5, 2);
													}
													if (isset($data->field_field_phi_dich_vu[0]['rendered']['entity']['field_collection_item'][$dichvu_id]['field_end_month_paid']['#items'][0]['value'])) {
														$end_month_paid = (int)substr($data->field_field_phi_dich_vu[0]['rendered']['entity']['field_collection_item'][$dichvu_id]['field_end_month_paid']['#items'][0]['value'], 5, 2);
														$year_paid = (int)substr($data->field_field_phi_dich_vu[0]['rendered']['entity']['field_collection_item'][$dichvu_id]['field_end_month_paid']['#items'][0]['value'], 0, 4);
													}
													
													//Noi dung
													$output = "<tr><td> Phí dịch vụ";

													//Bien so
													$output .= "</td><td> ";

													//Don gia
													$output .= "</td><td>";
													if (isset($data->field_field_phi_dich_vu[0]['rendered']['entity']['field_collection_item'][$dichvu_id]['field_don_gia_khac']['#items'][0]['value'])) {
														$output .= number_format($data->field_field_phi_dich_vu[0]['rendered']['entity']['field_collection_item'][$dichvu_id]['field_don_gia_khac']['#items'][0]['value']) . "/m&sup2;";
													} elseif (isset($data->field_field_phi_dich_vu[0]['rendered']['entity']['field_collection_item'][$dichvu_id]['field_loai_phi']['#items'][0]['value'])) {
														$output .= number_format($data->field_field_phi_dich_vu[0]['rendered']['entity']['field_collection_item'][$dichvu_id]['field_loai_phi']['#items'][0]['value']) . "/m&sup2;";
													} else {
														$output .= "";
													}

													//Thang su dung
													$output .= "</td><td>";
													if (!isset($end_month_paid)) {
														$output .= "Chưa nộp";
													} elseif (($year_paid < $CURRENT_YEAR) && ($end_month_paid < 12)) {
														$output .= "Chưa nộp từ tháng " . ($end_month_paid + 1) . " năm " . $year_paid;
													} elseif (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH == $end_month_paid)) {
														$output .= $CURRENT_MONTH;
													} elseif (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH < $end_month_paid)) {
														for ($i=$start_month_paid; $i<=$end_month_paid; $i++) {
															$output .= $i . ", ";
														}
													} elseif (($year_paid == $CURRENT_YEAR) && (($CURRENT_MONTH - $end_month_paid) == 1)) {
														$output .= "Chưa nộp tháng " . $CURRENT_MONTH;
													} elseif (($year_paid == $CURRENT_YEAR) && (($CURRENT_MONTH - $end_month_paid) > 1)) {
														$output .= "Chưa nộp tháng từ tháng " . ($end_month_paid + 1) . " đến tháng ". $CURRENT_MONTH;
													}

													//thanh tien
													$output .= "</td><td>";
													if (isset($year_paid) && ($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH == $end_month_paid)) {
														if (isset($data->field_field_phi_dich_vu[0]['rendered']['entity']['field_collection_item'][$dichvu_id]['field_don_gia_khac']['#items'][0]['value'])) {
															$output .= number_format((int)$data->field_field_phi_dich_vu[0]['rendered']['entity']['field_collection_item'][$dichvu_id]['field_don_gia_khac']['#items'][0]['value'] * $DIEN_TICH);
														} elseif (isset($data->field_field_phi_dich_vu[0]['rendered']['entity']['field_collection_item'][$dichvu_id]['field_loai_phi']['#items'][0]['value'])) {
															$output .= number_format((int)$data->field_field_phi_dich_vu[0]['rendered']['entity']['field_collection_item'][$dichvu_id]['field_loai_phi']['#items'][0]['value'] * $DIEN_TICH);
														} else {
															$output .= "0";
														}
													} elseif (isset($year_paid) && ($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH < $end_month_paid)) {
														if (isset($data->field_field_phi_dich_vu[0]['rendered']['entity']['field_collection_item'][$dichvu_id]['field_don_gia_khac']['#items'][0]['value'])) {
															$output .= number_format((int)$data->field_field_phi_dich_vu[0]['rendered']['entity']['field_collection_item'][$dichvu_id]['field_don_gia_khac']['#items'][0]['value'] * ($end_month_paid-$CURRENT_MONTH+1) * $DIEN_TICH);
														} elseif (isset($data->field_field_phi_dich_vu[0]['rendered']['entity']['field_collection_item'][$dichvu_id]['field_loai_phi']['#items'][0]['value'])) {
															$output .= number_format((int)$data->field_field_phi_dich_vu[0]['rendered']['entity']['field_collection_item'][$dichvu_id]['field_loai_phi']['#items'][0]['value'] * ($end_month_paid-$CURRENT_MONTH+1) * $DIEN_TICH);
														} else {
															$output .= "0";
														}
													} else {
														$output .= "0";
													}

													$output .= "</td></tr>";
													echo $output;
												}


			            			//============ PHI VE SINH ===============//
												if(isset($data->field_field_phi_ve_sinh)){
													$vesinh_id = (int)$data->field_field_phi_ve_sinh[0]['raw']['value'];

													if (isset($data->field_field_phi_ve_sinh[0]['rendered']['entity']['field_collection_item'][$vesinh_id]['field_start_date']['#items'][0]['value'])) {
														$start_month_paid = (int)substr($data->field_field_phi_ve_sinh[0]['rendered']['entity']['field_collection_item'][$vesinh_id]['field_start_date']['#items'][0]['value'], 5, 2);
													}
													if (isset($data->field_field_phi_ve_sinh[0]['rendered']['entity']['field_collection_item'][$vesinh_id]['field_end_month_paid']['#items'][0]['value'])) {
														$end_month_paid = (int)substr($data->field_field_phi_ve_sinh[0]['rendered']['entity']['field_collection_item'][$vesinh_id]['field_end_month_paid']['#items'][0]['value'], 5, 2);
														$year_paid = (int)substr($data->field_field_phi_ve_sinh[0]['rendered']['entity']['field_collection_item'][$vesinh_id]['field_end_month_paid']['#items'][0]['value'], 0, 4);
													}
													
													//Noi dung
													$output = "<tr><td> Phí vệ sinh";

													//Bien so
													$output .= "</td><td> ";

													//Don gia
													$output .= "</td><td>";
													if (isset($data->field_field_phi_ve_sinh[0]['rendered']['entity']['field_collection_item'][$vesinh_id]['field_don_gia_khac']['#items'][0]['value'])) {
														$output .= number_format($data->field_field_phi_ve_sinh[0]['rendered']['entity']['field_collection_item'][$vesinh_id]['field_don_gia_khac']['#items'][0]['value']) . "/m&sup2;";
													} elseif (isset($data->field_field_phi_ve_sinh[0]['rendered']['entity']['field_collection_item'][$vesinh_id]['field_loai_phi']['#items'][0]['value'])) {
														$output .= number_format($data->field_field_phi_ve_sinh[0]['rendered']['entity']['field_collection_item'][$vesinh_id]['field_loai_phi']['#items'][0]['value']) . "/m&sup2;";
													} else {
														$output .= "";
													}

													//Thang su dung
													$output .= "</td><td>";
													if (!isset($end_month_paid)) {
														$output .= "Chưa nộp";
													} elseif (($year_paid < $CURRENT_YEAR) && ($end_month_paid < 12)) {
														$output .= "Chưa nộp từ tháng " . ($end_month_paid + 1) . " năm " . $year_paid;
													} elseif (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH == $end_month_paid)) {
														$output .= $CURRENT_MONTH;
													} elseif (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH < $end_month_paid)) {
														for ($i=$start_month_paid; $i<=$end_month_paid; $i++) {
															$output .= $i . ", ";
														}
													} elseif (($year_paid == $CURRENT_YEAR) && (($CURRENT_MONTH - $end_month_paid) == 1)) {
														$output .= "Chưa nộp tháng " . $CURRENT_MONTH;
													} elseif (($year_paid == $CURRENT_YEAR) && (($CURRENT_MONTH - $end_month_paid) > 1)) {
														$output .= "Chưa nộp tháng từ tháng " . ($end_month_paid + 1) . " đến tháng ". $CURRENT_MONTH;
													}

													//thanh tien
													$output .= "</td><td>";
													if (isset($year_paid) && ($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH == $end_month_paid)) {
														if (isset($data->field_field_phi_ve_sinh[0]['rendered']['entity']['field_collection_item'][$vesinh_id]['field_don_gia_khac']['#items'][0]['value'])) {
															$output .= number_format((int)$data->field_field_phi_ve_sinh[0]['rendered']['entity']['field_collection_item'][$vesinh_id]['field_don_gia_khac']['#items'][0]['value'] * $DIEN_TICH);
														} elseif (isset($data->field_field_phi_ve_sinh[0]['rendered']['entity']['field_collection_item'][$vesinh_id]['field_loai_phi']['#items'][0]['value'])) {
															$output .= number_format((int)$data->field_field_phi_ve_sinh[0]['rendered']['entity']['field_collection_item'][$vesinh_id]['field_loai_phi']['#items'][0]['value'] * $DIEN_TICH);
														} else {
															$output .= "0";
														}
													} elseif (isset($year_paid) && ($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH < $end_month_paid)) {
														if (isset($data->field_field_phi_ve_sinh[0]['rendered']['entity']['field_collection_item'][$vesinh_id]['field_don_gia_khac']['#items'][0]['value'])) {
															$output .= number_format((int)$data->field_field_phi_ve_sinh[0]['rendered']['entity']['field_collection_item'][$vesinh_id]['field_don_gia_khac']['#items'][0]['value'] * ($end_month_paid-$CURRENT_MONTH+1) * $DIEN_TICH);
														} elseif (isset($data->field_field_phi_ve_sinh[0]['rendered']['entity']['field_collection_item'][$vesinh_id]['field_loai_phi']['#items'][0]['value'])) {
															$output .= number_format((int)$data->field_field_phi_ve_sinh[0]['rendered']['entity']['field_collection_item'][$vesinh_id]['field_loai_phi']['#items'][0]['value'] * ($end_month_paid-$CURRENT_MONTH+1) * $DIEN_TICH);
														} else {
															$output .= "0";
														}
													} else {
														$output .= "0";
													}

													$output .= "</td></tr>";
													echo $output;
												}


			            			//============ OTO ===============//
												if(isset($data->field_field_oto)){
													$number_of_oto = count($data->field_field_oto);

													for($i=1; $i<=$number_of_oto; $i++ ) {
														$oto_id = (int)$data->field_field_oto[$i-1]['raw']['value'];
														if (isset($data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_start_date']['#items'][0]['value'])) {
															$start_month_paid = (int)substr($data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_start_date']['#items'][0]['value'], 5, 2);
														}
														if (isset($data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_end_month_paid']['#items'][0]['value'])) {
															$end_month_paid = (int)substr($data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_end_month_paid']['#items'][0]['value'], 5, 2);
															$year_paid = (int)substr($data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_end_month_paid']['#items'][0]['value'], 0, 4);
														}
														
														//Loai xe
														$output = "<tr><td>";
														if (isset($data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_loai_xe_oto'][0]['#markup'])) {
															$output .= "Ôtô (" . $data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_loai_xe_oto'][0]['#markup'] . ")";
														}

														//Bien so
														$output .= "</td><td>";
														if (isset($data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_bien_so'][0]['#title'])) {
															$output .= $data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_bien_so'][0]['#title'];
														}

														//Don gia
														$output .= "</td><td>";
														if (isset($data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_don_gia_khac']['#items'][0]['value'])) {
															$output .= number_format($data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_don_gia_khac']['#items'][0]['value']);
														} elseif (isset($data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_loai_phi']['#items'][0]['value'])) {
															$output .= number_format($data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_loai_phi']['#items'][0]['value']);
														} else {
															$output .= "";
														}

														//Thang su dung
														$output .= "</td><td>";
														if (!isset($end_month_paid)) {
															$output .= "Chưa nộp";
														} elseif (($year_paid < $CURRENT_YEAR) && ($end_month_paid < 12)) {
															$output .= "Chưa nộp từ tháng " . ($end_month_paid + 1) . " năm " . $year_paid;
														} elseif (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH == $end_month_paid)) {
															$output .= $CURRENT_MONTH;
														} elseif (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH < $end_month_paid)) {
															for ($i=$start_month_paid; $i<=$end_month_paid; $i++) {
																$output .= $i . ", ";
															}
														} elseif (($year_paid == $CURRENT_YEAR) && (($CURRENT_MONTH - $end_month_paid) == 1)) {
															$output .= "Chưa nộp tháng " . $CURRENT_MONTH;
														} elseif (($year_paid == $CURRENT_YEAR) && (($CURRENT_MONTH - $end_month_paid) > 1)) {
															$output .= "Chưa nộp tháng từ tháng " . ($end_month_paid + 1) . " đến tháng ". $CURRENT_MONTH;
														}

														//thanh tien
														$output .= "</td><td>";
														if (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH == $end_month_paid)) {
															if (isset($data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_don_gia_khac']['#items'][0]['value'])) {
																$output .= number_format($data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_don_gia_khac']['#items'][0]['value']);
															} elseif (isset($data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_loai_phi']['#items'][0]['value'])) {
																$output .= number_format($data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_loai_phi']['#items'][0]['value']);
															} else {
																$output .= "0";
															}
														} elseif (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH < $end_month_paid)) {
															if (isset($data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_don_gia_khac']['#items'][0]['value'])) {
																$output .= number_format((int)$data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_don_gia_khac']['#items'][0]['value'] * ($end_month_paid-$CURRENT_MONTH+1));
															} elseif (isset($data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_loai_phi']['#items'][0]['value'])) {
																$output .= number_format((int)$data->field_field_oto[$i-1]['rendered']['entity']['field_collection_item'][$oto_id]['field_loai_phi']['#items'][0]['value'] * ($end_month_paid-$CURRENT_MONTH+1));
															} else {
																$output .= "0";
															}
														} else {
															$output .= "0";
														}

														$output .= "</td></tr>";
														echo $output;
													}
												}//End oto


												//============= XE MAY ===========//
												if(isset($data->field_field_xe_may)){
													$number_of_xemay = count($data->field_field_xe_may);

													for($i=1; $i<=$number_of_xemay; $i++ ) {
														$xemay_id = (int)$data->field_field_xe_may[$i-1]['raw']['value'];
														if (isset($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_start_date']['#items'][0]['value'])) {
															$start_month_paid = (int)substr($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_start_date']['#items'][0]['value'], 5, 2);
														}
														if (isset($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_end_month_paid']['#items'][0]['value'])) {
															$end_month_paid = (int)substr($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_end_month_paid']['#items'][0]['value'], 5, 2);
															$year_paid = (int)substr($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_end_month_paid']['#items'][0]['value'], 0, 4);
														}
														
														//Loai xe
														$output = "<tr><td>";
														if (isset($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_loai_xe'][0]['#markup'])) {
															$output .= "Xe máy (" . $data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_loai_xe'][0]['#markup'] . ")";
														}

														//Bien so
														$output .= "</td><td>";
														if (isset($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_bien_so'][0]['#title'])) {
															$output .= $data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_bien_so'][0]['#title'];
														}

														//Don gia
														$output .= "</td><td>";
														if (isset($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_don_gia_khac']['#items'][0]['value'])) {
															$output .= number_format($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_don_gia_khac']['#items'][0]['value']);
														} elseif (isset($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_loai_phi']['#items'][0]['value'])) {
															$output .= number_format($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_loai_phi']['#items'][0]['value']);
														} else {
															$output .= "";
														}

														//Thang su dung
														$output .= "</td><td>";
														if (!isset($end_month_paid)) {
															$output .= "Chưa nộp";
														} elseif (($year_paid < $CURRENT_YEAR) && ($end_month_paid < 12)) {
															$output .= "Chưa nộp từ tháng " . ($end_month_paid + 1) . " năm " . $year_paid;
														} elseif (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH == $end_month_paid)) {
															$output .= $CURRENT_MONTH;
														} elseif (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH < $end_month_paid)) {
															for ($i=$start_month_paid; $i<=$end_month_paid; $i++) {
																$output .= $i . ", ";
															}
														} elseif (($year_paid == $CURRENT_YEAR) && (($CURRENT_MONTH - $end_month_paid) == 1)) {
															$output .= "Chưa nộp tháng " . $CURRENT_MONTH;
														} elseif (($year_paid == $CURRENT_YEAR) && (($CURRENT_MONTH - $end_month_paid) > 1)) {
															$output .= "Chưa nộp tháng từ tháng " . ($end_month_paid + 1) . " đến tháng ". $CURRENT_MONTH;
														}

														//thanh tien
														$output .= "</td><td>";
														if (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH == $end_month_paid)) {
															if (isset($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_don_gia_khac']['#items'][0]['value'])) {
																$output .= number_format($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_don_gia_khac']['#items'][0]['value']);
															} elseif (isset($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_loai_phi']['#items'][0]['value'])) {
																$output .= number_format($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_loai_phi']['#items'][0]['value']);
															} else {
																$output .= "0";
															}
														} elseif (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH < $end_month_paid)) {
															if (isset($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_don_gia_khac']['#items'][0]['value'])) {
																$output .= number_format((int)$data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_don_gia_khac']['#items'][0]['value'] * ($end_month_paid-$CURRENT_MONTH+1));
															} elseif (isset($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_loai_phi']['#items'][0]['value'])) {
																$output .= number_format((int)$data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_loai_phi']['#items'][0]['value'] * ($end_month_paid-$CURRENT_MONTH+1));
															} else {
																$output .= "0";
															}
														} else {
															$output .= "0";
														}

														$output .= "</td></tr>";
														echo $output;
													}
												}//End xe may


												//============= XE DAP ===========//
												if(isset($data->field_field_xe_dap)){
													$number_of_xedap = count($data->field_field_xe_dap);

													for($i=1; $i<=$number_of_xedap; $i++ ) {
														$xedap_id = (int)$data->field_field_xe_dap[$i-1]['raw']['value'];
														if (isset($data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_start_date']['#items'][0]['value'])) {
															$start_month_paid = (int)substr($data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_start_date']['#items'][0]['value'], 5, 2);
														}
														if (isset($data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_end_month_paid']['#items'][0]['value'])) {
															$end_month_paid = (int)substr($data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_end_month_paid']['#items'][0]['value'], 5, 2);
															$year_paid = (int)substr($data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_end_month_paid']['#items'][0]['value'], 0, 4);
														}
														
														//Loai xe
														$output = "<tr><td>Xe đạp ";

														//Bien so
														$output .= "</td><td>";
														if (isset($data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_bien_so'][0]['#title'])) {
															$output .= $data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_bien_so'][0]['#title'];
														}

														//Don gia
														$output .= "</td><td>";
														if (isset($data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_don_gia_khac']['#items'][0]['value'])) {
															$output .= number_format($data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_don_gia_khac']['#items'][0]['value']);
														} elseif (isset($data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_loai_phi']['#items'][0]['value'])) {
															$output .= number_format($data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_loai_phi']['#items'][0]['value']);
														} else {
															$output .= "";
														}

														//Thang su dung
														$output .= "</td><td>";
														if (!isset($end_month_paid)) {
															$output .= "Chưa nộp";
														} elseif (($year_paid < $CURRENT_YEAR) && ($end_month_paid < 12)) {
															$output .= "Chưa nộp từ tháng " . ($end_month_paid + 1) . " năm " . $year_paid;
														} elseif (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH == $end_month_paid)) {
															$output .= $CURRENT_MONTH;
														} elseif (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH < $end_month_paid)) {
															for ($i=$start_month_paid; $i<=$end_month_paid; $i++) {
																$output .= $i . ", ";
															}
														} elseif (($year_paid == $CURRENT_YEAR) && (($CURRENT_MONTH - $end_month_paid) == 1)) {
															$output .= "Chưa nộp tháng " . $CURRENT_MONTH;
														} elseif (($year_paid == $CURRENT_YEAR) && (($CURRENT_MONTH - $end_month_paid) > 1)) {
															$output .= "Chưa nộp tháng từ tháng " . ($end_month_paid + 1) . " đến tháng ". $CURRENT_MONTH;
														}

														//thanh tien
														$output .= "</td><td>";
														if (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH == $end_month_paid)) {
															if (isset($data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_don_gia_khac']['#items'][0]['value'])) {
																$output .= number_format($data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_don_gia_khac']['#items'][0]['value']);
															} elseif (isset($data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_loai_phi']['#items'][0]['value'])) {
																$output .= number_format($data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_loai_phi']['#items'][0]['value']);
															} else {
																$output .= "0";
															}
														} elseif (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH < $end_month_paid)) {
															if (isset($data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_don_gia_khac']['#items'][0]['value'])) {
																$output .= number_format((int)$data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_don_gia_khac']['#items'][0]['value'] * ($end_month_paid-$CURRENT_MONTH+1));
															} elseif (isset($data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_loai_phi']['#items'][0]['value'])) {
																$output .= number_format((int)$data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_loai_phi']['#items'][0]['value'] * ($end_month_paid-$CURRENT_MONTH+1));
															} else {
																$output .= "0";
															}
														} else {
															$output .= "0";
														}

														$output .= "</td></tr>";
														echo $output;
													}
												}//End xe dap


												//============ XE DAP DIEN ============//
												if(isset($data->field_field_xe_dap_dien)){
													$number_of_xedapdien = count($data->field_field_xe_dap_dien);

													for($i=1; $i<=$number_of_xedapdien; $i++ ) {
														$xedapdien_id = (int)$data->field_field_xe_dap_dien[$i-1]['raw']['value'];
														if (isset($data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_start_date']['#items'][0]['value'])) {
															$start_month_paid = (int)substr($data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_start_date']['#items'][0]['value'], 5, 2);
														}
														if (isset($data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_end_month_paid']['#items'][0]['value'])) {
															$end_month_paid = (int)substr($data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_end_month_paid']['#items'][0]['value'], 5, 2);
															$year_paid = (int)substr($data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_end_month_paid']['#items'][0]['value'], 0, 4);
														}
														
														//Loai xe
														$output = "<tr><td>Xe đạp điện";

														//Bien so
														$output .= "</td><td>";
														if (isset($data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_bien_so'][0]['#title'])) {
															$output .= $data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_bien_so'][0]['#title'];
														}

														//Don gia
														$output .= "</td><td>";
														if (isset($data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_don_gia_khac']['#items'][0]['value'])) {
															$output .= number_format($data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_don_gia_khac']['#items'][0]['value']);
														} elseif (isset($data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_loai_phi']['#items'][0]['value'])) {
															$output .= number_format($data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_loai_phi']['#items'][0]['value']);
														} else {
															$output .= "";
														}

														//Thang su dung
														$output .= "</td><td>";
														if (!isset($end_month_paid)) {
															$output .= "Chưa nộp";
														} elseif (($year_paid < $CURRENT_YEAR) && ($end_month_paid < 12)) {
															$output .= "Chưa nộp từ tháng " . ($end_month_paid + 1) . " năm " . $year_paid;
														} elseif (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH == $end_month_paid)) {
															$output .= $CURRENT_MONTH;
														} elseif (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH < $end_month_paid)) {
															for ($i=$start_month_paid; $i<=$end_month_paid; $i++) {
																$output .= $i . ", ";
															}
														} elseif (($year_paid == $CURRENT_YEAR) && (($CURRENT_MONTH - $end_month_paid) == 1)) {
															$output .= "Chưa nộp tháng " . $CURRENT_MONTH;
														} elseif (($year_paid == $CURRENT_YEAR) && (($CURRENT_MONTH - $end_month_paid) > 1)) {
															$output .= "Chưa nộp tháng từ tháng " . ($end_month_paid + 1) . " đến tháng ". $CURRENT_MONTH;
														}

														//thanh tien
														$output .= "</td><td>";
														if (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH == $end_month_paid)) {
															if (isset($data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_don_gia_khac']['#items'][0]['value'])) {
																$output .= number_format($data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_don_gia_khac']['#items'][0]['value']);
															} elseif (isset($data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_loai_phi']['#items'][0]['value'])) {
																$output .= number_format($data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_loai_phi']['#items'][0]['value']);
															} else {
																$output .= "0";
															}
														} elseif (($year_paid == $CURRENT_YEAR) && ($CURRENT_MONTH < $end_month_paid)) {
															if (isset($data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_don_gia_khac']['#items'][0]['value'])) {
																$output .= number_format((int)$data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_don_gia_khac']['#items'][0]['value'] * ($end_month_paid-$CURRENT_MONTH+1));
															} elseif (isset($data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_loai_phi']['#items'][0]['value'])) {
																$output .= number_format((int)$data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_loai_phi']['#items'][0]['value'] * ($end_month_paid-$CURRENT_MONTH+1));
															} else {
																$output .= "0";
															}
														} else {
															$output .= "0";
														}

														$output .= "</td></tr>";
														echo $output;
													}
												}//End Xe dap dien
											?>
											<tr class="row-tongtien"><td></td><td></td><td></td><td><label>Tổng tiền: </label></td><td class="tongtien"></td></tr>
			            	</tbody>
			            </table>
			        </div>

			        <div class="nguoithutien">
			        	<p>Người thu tiền</p>
			        	<i>(Ký tên, đóng dấu)</i>
						<p></p>
						<p><?php echo $data->users_node_name; ?></p>
			        </div>

					<div class="chuky">
						<div class="content-chuky">
						  <p>Hà Nội, <?php echo "ngày ".date('d')." tháng ".date('m')." năm ".date('Y'); ?></p>
						  <p>Người nộp tiền</p>
						  <i>(Ký, ghi rõ họ tên)</i>
						  <p></p>
						  <?php if(isset($data->field_field_nguoi_thue[0]['rendered']['#title']) && isset($data->field_field_ngay_het_han[0]['raw']['value']) && $data->field_field_ngay_het_han[0]['raw']['value'] > date("Y-m-d H:i:s") ): ?>
						    <p><?php echo $data->field_field_nguoi_thue[0]['rendered']['#title']; ?></p>
						  <?php else: ?>
						    <p><?php echo $data->field_field_ten_chu_so_huu[0]['rendered']['#title']; ?></p>
						  <?php endif; ?>
						</div>
					</div>
		        </div>
	      	</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
			</div>
	  	</div>
	</div>
</div>