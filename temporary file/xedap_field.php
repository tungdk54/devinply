<?php
	if(isset($data->field_field_xe_dap)){
		$number_of_xedap = count($data->field_field_xe_dap);

		if ($number_of_xedap > 0) {
			$output = "<table><thead><th>Biển số</th></thead><tbody>";
			for($i=1; $i<=$number_of_xedap; $i++ ) {
				$xedap_id = (int)$data->field_field_xe_dap[$i-1]['raw']['value'];
				
				$output .= "<tr>";

				if (isset($data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_bien_so'][0]['#title'])) {
					$output .= "<td><a href=".$data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_bien_so'][0]['#href'].">".$data->field_field_xe_dap[$i-1]['rendered']['entity']['field_collection_item'][$xedap_id]['field_bien_so'][0]['#title']."</a></td>";
				}

				$output .= "</tr>";
			}
			$output .= "</tbody></table>";
			echo $output;
		}

	}
?>