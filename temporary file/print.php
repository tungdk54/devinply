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
            <h4 class="modal-title">Thông tin chủ sở hữu, sử dụng căn hộ</h4>
            <p class="center"><?php echo "Ngày ".date('d')." tháng ".date('m')." năm ".date('Y'); ?></p>
          </div>
          <div class="thong tin">
            <p>Phòng <strong><?php echo $data->node_title; ?> - <?php echo $data->field_field_du_an[0]['rendered']['#title']; ?></strong></p>
            <p>Diện tích: <?php echo $data->field_field_dien_tich[0]['raw']['value'] . " (m&sup2;)"?></p>
            <p>Tình trạng căn hộ: <strong><?php echo $data->field_field_tinh_trang[0]['raw']['value']?></strong></p>
            <p>Họ tên chủ hộ: <strong><?php echo $data->field_field_ten_chu_so_huu[0]['rendered']['#title']; ?></strong></p>
            <?php $chu_sohuu_nid = $data->field_field_ten_chu_so_huu[0]['raw']['nid']; $chu_sohuu_node = node_load($chu_sohuu_nid);?>
            <p>Năm sinh: <?php echo substr($chu_sohuu_node->field_nam_sinh['und'][0]['value'], 0, 4);?><?php if (isset($chu_sohuu_node->field_nghe_nghiep['und'][0]['value'])) echo "<span class='space-tab'>    </span> Nghề nghiệp: " . $chu_sohuu_node->field_nghe_nghiep['und'][0]['value'];?></p>
            <?php if (isset($data->field_field_ngay_mua[0]['raw']['value'])) echo "Ngày tiếp nhận sử dụng: " . substr($data->field_field_ngay_mua[0]['raw']['value'], 0, 10); ?>

            <?php if(isset($data->field_field_nguoi_thue[0]['rendered']['#title']) && isset($data->field_field_ngay_het_han[0]['raw']['value']) && $data->field_field_ngay_het_han[0]['raw']['value'] > date("Y-m-d H:i:s") ): ?>
              <?php $nguoi_thue_nid = $data->field_field_nguoi_thue[0]['raw']['nid']; $nguoi_thue_node = node_load($nguoi_thue_nid);?>
              <hr>
              <p>Bên thuê sử dụng: <strong><?php echo $data->field_field_nguoi_thue[0]['rendered']['#title']; ?></strong></p>
              <p>Năm sinh: <?php echo substr($nguoi_thue_node->field_nam_sinh['und'][0]['value'], 0, 4);?><?php if (isset($nguoi_thue_node->field_nghe_nghiep['und'][0]['value'])) echo "<span class='space-tab'>    </span> Nghề nghiệp: " . $nguoi_thue_node->field_nghe_nghiep['und'][0]['value'];?></p>
              <p>
                <?php if (isset($data->field_field_ngay_thue[0]['raw']['value'])) echo "Ngày thuê: " . substr($data->field_field_ngay_thue[0]['raw']['value'], 0, 10); ?>
                <?php if (isset($data->field_field_ngay_het_han[0]['raw']['value'])) echo "<span class='space-tab'>    </span> Ngày hết hạn hợp đồng: " . substr($data->field_field_ngay_het_han[0]['raw']['value'], 0, 10); ?>
              </p>
            <?php endif;?>

          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>