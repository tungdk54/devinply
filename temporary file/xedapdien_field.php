<?php
	if(isset($data->field_field_xe_dap_dien)){
		$number_of_xedapdien = count($data->field_field_xe_dap_dien);

		if ($number_of_xedapdien > 0) {
			$output = "<table><thead><th>Biển số</th></thead><tbody>";
			for($i=1; $i<=$number_of_xedapdien; $i++ ) {
				$xedapdien_id = (int)$data->field_field_xe_dap_dien[$i-1]['raw']['value'];
				
				$output .= "<tr>";

				if (isset($data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_bien_so'][0]['#title'])) {
					$output .= "<td><a href=".$data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_bien_so'][0]['#href'].">".$data->field_field_xe_dap_dien[$i-1]['rendered']['entity']['field_collection_item'][$xedapdien_id]['field_bien_so'][0]['#title']."</a></td>";
				}

				$output .= "</tr>";
			}
			$output .= "</tbody></table>";
			echo $output;
		}

	}
?>