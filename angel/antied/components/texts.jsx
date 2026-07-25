import { storage } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"
import { plugin } from "@vendetta"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { Forms, General } from "@vendetta/ui/components"

const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormSliderRow } = Forms;

const customizedableTexts = [
	{
		id: "deletedMessageBuffer",
		title: "自定义已删除消息文本",
		type: "default",
		placeholder: "此消息已删除",
	},
	{
		id: "editedMessageBuffer",
		title: "自定义编辑分隔符",
		type: "default",
		placeholder: "`[ EDITED ]`",
	},
	{
		id: "historyToast",
		title: "自定义清除历史提示文本",
		type: "default",
		placeholder: "历史记录已清除",
	},
	{
		id: "customIndicator",
		title: "自定义临时消息“仅你可见”提示（启用已删除消息提示标记后将覆盖此设置）",
		type: "default",
		placeholder: "仅你可见 • ",
	}
]

export default function TextComponent({ styles }) {
	useProxy(storage)

	return (<>
		<View style={[styles.subText]}>
		{
			customizedableTexts?.map((obj, index) => {
				return (<>
					<FormInput
						title={obj?.title}
						keyboardType={obj?.type}
						placeholder={obj?.placeholder?.toString()}
						value={storage?.inputs[obj.id] ?? obj?.placeholder}
						onChange={(val) => (storage.inputs[obj.id] = val.toString())}
					/>
					{index !== customizedableTexts.length - 1 && <FormDivider />}
				</>)
			})
		}
		<FormInput
			title="自定义插件名称"
			keyboardType="default"
			placeholder={storage?.inputs?.customPluginName || plugin?.manifest?.name || "ANTIED"}
			value={storage?.inputs?.customPluginName}
			onChange={(val) => {
				storage.inputs.customPluginName = val.toString()
				plugin.manifest.name = val.toString()
			}}
		/>
		<FormDivider/>
		<FormRow
			label={`当前使用图标 - ${storage?.misc?.editHistoryIcon || "ic_edit_24px"}`}
			subLabel="“历史记录已清除”提示使用的图标"
			trailing={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName(storage?.misc?.editHistoryIcon)} />}
		/>
		<FormDivider/>
		<FormInput
			title="图标名称"
			keyboardType="default"
			placeholder="ic_edit_24px"
			value={storage?.misc?.editHistoryIcon || "ic_edit_24px"}
			onChange={(val) => (storage.misc.editHistoryIcon = val.toString())}
		/>
		</View>
	</>)
}
