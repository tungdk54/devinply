<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="<?php echo '#canho'.$data->nid; ?>">Print</button>
<!-- Modal -->
<div id="<?php echo 'canho'.$data->nid; ?>" class="modal fade" role="dialog">
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
            <?php if(isset($data->field_field_nguoi_thue[0]['rendered']['#title'])): ?>
              <p>Tên khách hàng: <strong><?php echo $data->field_field_nguoi_thue[0]['rendered']['#title']; ?></strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mã khách hàng: <?php  if(isset($data->field_field_ma_khach_hang_1[0]['raw']['value'])) echo $data->field_field_ma_khach_hang_1[0]['raw']['value'];?></p>
            <?php else: ?>
              <p>Tên khách hàng: <strong><?php echo $data->field_field_ten_chu_so_huu[0]['rendered']['#title']; ?></strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mã khách hàng: <?php  if(isset($data->field_field_ma_khach_hang[0]['raw']['value'])) echo $data->field_field_ma_khach_hang[0]['raw']['value'];?></p>
            <?php endif; ?>
            
            <p>Địa chỉ: <strong>Phòng <?php echo $data->node_title; ?> - <?php echo $data->field_field_du_an[0]['rendered']['#title']; ?></strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Diện tích: <?php echo $data->field_field_dien_tich[0]['raw']['value'] . " (m&sup2;)"?></p>
            <p>Số hóa đơn: </p>
            
            <p>Nội dung thanh toán: ......&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hình thức thanh toán: ......</p>
            <p>Bằng chữ: </p>
          </div>
          <div class="chuky">
            <div class="content-chuky">
              <p>Hà Nội, <?php echo "ngày ".date('d')." tháng ".date('m')." năm ".date('Y'); ?></p>
              <p>Người nộp tiền</p>
              <i>(Ký, ghi rõ họ tên)</i>
              <p></p>
              <?php if(isset($data->field_field_nguoi_thue[0]['rendered']['#title'])): ?>
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