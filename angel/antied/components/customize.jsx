import { storage } from "@vendetta/plugin"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { useProxy } from "@vendetta/storage"

import { findByName } from "@vendetta/metro"

import { Forms, General } from "@vendetta/ui/components";

const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated } = General;
const { FormRow, FormIcon, FormSwitch, FormDivider } = Forms
const HelpMessage = findByName("HelpMessage");

const customizeableSwitches = [
	{
		id: "minimalistic",
		default: true,
		label: "极简设置",
		subLabel: "移除全部样式（默认启用）",
	},
	{
		id: "useBackgroundColor",
		default: false,
		label: "启用背景颜色",
		subLabel: "为已删除消息添加可自定义的背景颜色，类似提及高亮。",
	},
	{
		id: "useSemRawColors",
		default: false,
		label: "使用语义/原始颜色",
		subLabel: "背景使用语义/原始颜色而非自定义颜色；不影响侧栏颜色。",
	},
	{
		id: "ignoreBots",
		default: false,
		label: "忽略机器人",
		subLabel: "忽略机器人的已删除消息。",
	},
	{
		id: "removeDismissButton",
		default: false,
		label: "移除“关闭消息”",
		subLabel: "移除已删除临时消息中可点击的“关闭消息”文字。",
	},
	{
		id: "addTimestampForEdits",
		default: false,
		label: "添加编辑时间戳",
		subLabel: "为已编辑消息添加时间戳。",
	},
	{
		id: "useEphemeralForDeleted",
		default: true,
		label: "已删除消息使用临时消息",
		subLabel: "消息删除后使用临时消息而不是普通消息（默认启用）。",
	},
	{
		id: "useIndicatorForDeleted",
		default: false,
		label: "为“此消息已删除”使用提示标记",
		subLabel: "已删除消息显示“仅你可见”提示，而不是“已编辑”。",
	},
	{
		id: "overrideIndicator",
		default: false,
		label: "移除临时消息提示",
		subLabel: "消息删除后，文字下方会显示“仅你可见”等提示；此选项会移除该提示。",
	},
	{
		id: "useCustomPluginName",
		default: false,
		label: "使用自定义名称覆盖插件名称",
		subLabel: "启用后以自定义名称替代插件名称"
	}
]

export default function CustomizationComponent({ styles }) {
	useProxy(storage)

	return (<>
		<View style={[styles.subText]}>
		{
			storage?.switches.minimalistic && (
				<HelpMessage messageType={0}>若要使用样式，请关闭“极简设置”选项。</HelpMessage>
			)
		}
		{
			customizeableSwitches?.map((obj, index) => {
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
					{index !== customizeableSwitches?.length - 1 && <FormDivider />}
				</>)
			})
		}
		</View>
	</>)
}
