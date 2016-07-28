<?php
	if(isset($data->field_field_xe_may)){
		$number_of_xemay = count($data->field_field_xe_may);

		if ($number_of_xemay > 0) {
			$output = "<table><thead><th>Loại xe</th><th>Biển số</th></thead><tbody>";
			for($i=1; $i<=$number_of_xemay; $i++ ) {
				$xemay_id = (int)$data->field_field_xe_may[$i-1]['raw']['value'];
				
				$output .= "<tr><td>";

				if (isset($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_loai_xe'][0]['#markup'])) {
					$output .= $data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_loai_xe'][0]['#markup'];
				}

				$output .= "</td><td>";

				if (isset($data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_bien_so'][0]['#title'])) {
					$output .= "<a href=".$data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_bien_so'][0]['#href'].">".$data->field_field_xe_may[$i-1]['rendered']['entity']['field_collection_item'][$xemay_id]['field_bien_so'][0]['#title']."</a>";
				}

				$output .= "</td></tr>";
			}
			$output .= "</tbody></table>";
			echo $output;
		}

	}
?>