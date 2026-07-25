import { storage } from "@vendetta/plugin"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { useProxy } from "@vendetta/storage"

import { Forms, General } from "@vendetta/ui/components";
const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormSliderRow } = Forms;

const togglePatch = [
	{
		id: "enableMD",
		default: true,
		label: "开关消息删除记录",
		subLabel: "记录已删除消息",
	},
	{
		id: "enableMU",
		default: true,
		label: "开关消息编辑记录",
		subLabel: "记录已编辑消息",
	},
]

export default function PatchesComponent({ styles }) {
	useProxy(storage)

	return (<>
		<View style={[styles.subText]}>{
			togglePatch?.map((obj, index) => {
				return (<>
					<FormRow
						label={obj?.label}
						subLabel={obj?.subLabel}
						leading={obj?.icon && <FormIcon style={{ opacity: 1 }} source={getAssetIDByName(obj?.icon)} />}
						trailing={
							("id" in obj) ? (
								<FormSwitch
								value={storage?.switches[obj?.id] ?? obj?.default}
								onValueChange={ (value) => (storage.switches[obj?.id] = value) }
								/>
							) : undefined
						}
					/>
					{index !== togglePatch?.length - 1 && <FormDivider />}
				</>)
			})
		}
		</View>
	</>)
}
