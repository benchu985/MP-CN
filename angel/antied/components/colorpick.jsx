import { storage } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"
import { NavigationNative, React } from "@vendetta/metro/common"
import { findByName } from "@vendetta/metro"
import { rawColors, semanticColors } from "@vendetta/ui"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { Forms, General } from "@vendetta/ui/components";

import SemRawComponent from "./semRaw"
import { colorConverter, convert, openSheet, transparentBase64 } from "../../../lib/utility"

const CustomColorPickerActionSheet = findByName("CustomColorPickerActionSheet");

const { alphaToHex, hexAlphaToPercent } = convert;

const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormSliderRow } = Forms;

const customizeableColors = [
	{
		id: "textColor",
		label: "已删除消息文字颜色",
		subLabel: "点击自定义已删除消息的文字颜色",
		defaultColor: "#E40303",
	},
	{
		id: "backgroundColor",
		label: "已删除消息背景颜色",
		subLabel: "点击自定义背景颜色",
		defaultColor: "#FF2C2F",
	},
	{
		id: "gutterColor",
		label: "已删除消息背景侧栏颜色",
		subLabel: "点击自定义背景侧栏颜色",
		defaultColor: "#FF2C2F",
	}
]

export default function ColorPickComponent({ styles }) {
	useProxy(storage)

	const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

	const [BGAlpha, setBGAlpha] = React.useState(
		clamp((hexAlphaToPercent(storage?.colors?.backgroundColorAlpha) ?? 100), 0, 100)
	)
	const [gutterAlpha, setGutterAlpha] = React.useState(
		clamp((hexAlphaToPercent(storage?.colors?.gutterColorAlpha) ?? 100), 0, 100)
	)

	const [useText, setUseText] = React.useState(false);

	const navigation = NavigationNative.useNavigation();

	const handleSemRaw = prefix => {
		if(!prefix) return null;
		const [pref, col] = prefix.split('.');

		if(pref == "semanticColors") {
			return semanticColors[col];
		} else {
			return rawColors[col];
		}
	}

	return (<>
		<View style={[styles.subText]}>
			{
				storage?.switches?.useSemRawColors && (<>
					<FormRow
						label="语义与原始颜色"
						subLabel="启用“使用语义/原始颜色”后，可在此选择颜色。"
						leading={<FormRow.Icon source={getAssetIDByName("ic_audit_log_24px")} />}
						trailing={FormRow.Arrow}
						onPress={() =>
							navigation.push("VendettaCustomPage", {
								title: "语义与原始颜色",
								render: () => <SemRawComponent/>,
							})
						}
					/>
				</>)
			}
			{
				customizeableColors?.map((obj) => {
					const whenPressed = () => openSheet(
						CustomColorPickerActionSheet, {
							color: colorConverter?.toInt(storage.colors[obj.id] || obj?.defaultColor || "#000"),
							onSelect: (color) => {
								const value = colorConverter?.toHex(color)
								// console.log(color, value)
								storage.colors[obj.id] = value
							}
						}
					);

					return (<>
						<FormRow
							label={obj?.label}
							subLabel={obj?.subLabel || "点击更新"}
							onPress={whenPressed}
							trailing={
								<TouchableOpacity onPress={whenPressed}>
									<Image
										source={{ uri: transparentBase64 }}
										style={{
											width: 32,
											height: 32,
											borderRadius: 10,
											backgroundColor: storage?.colors[obj.id] || customizeableColors.find(x => x?.id == obj?.id)?.defaultColor || "#000"
										}}
									/>
								</TouchableOpacity>
							}
						/>
					</>)
				})
			}
			<View style={styles.container}>
				<FormRow
					style={{ justifyContent: 'center', alignItems: 'center' }}
					label={`预览样式：${storage?.switches?.darkMode ? "深色" : "浅色"}模式`}
					subLabel={`点击切换模式`}
					trailing={
						<FormSwitch
							value={storage?.switches?.darkMode ?? true}
							onValueChange={ (value) => (storage.switches.darkMode = value) }
						/>
					}
				/>

				<View style={[styles.row, styles.border, {overflow: "hidden", marginRight: 10}]}>
					<View style={
						{
							width: "2%",
							backgroundColor: `${storage.colors.gutterColor}${storage.colors.gutterColorAlpha}`,
						}
					}/>

					{
						// console.log(`${storage.colors.gutterColor}  ${storage.colors.gutterColor}`)
					}
					{
						// console.log(`${storage.switches.useSemRawColors ? (handleSemRaw(storage?.colors?.semRawColorPrefix) || storage.colors.backgroundColor) : storage.colors.backgroundColor}${storage.colors.backgroundColorAlpha}`)
					}

					<View style={
						{
							flex: 1,
							backgroundColor: `${
								storage.switches.useSemRawColors ?
									(handleSemRaw(storage?.colors?.semRawColorPrefix) || storage.colors.backgroundColor) :
									storage.colors.backgroundColor
							}${storage.colors.backgroundColorAlpha}`,
							justifyContent: 'center',
							alignItems: 'center',
						}
					}>
						<Text style={{
								fontSize: 20,
								color: storage?.switches?.darkMode ? "black" : "white"
							}
						}> 普通示例消息 </Text>
						<Text style={{
								fontSize: 20,
								color: storage.colors.textColor || "#000000"
							}
						}> 已删除示例消息 </Text>
					</View>
				</View>

				<FormRow
					label="点击切换输入方式"
					subLabel="在滑块和数值输入之间切换"
					onPress={() => {
						setUseText(!useText)
					}}
				/>

				{
					useText ? (<>
							<FormInput
								title={`背景颜色透明度：${BGAlpha}%`}
								keyboardType="numeric"
								style={{ width: "90%" }}
								value={`${BGAlpha}`}
								onChange={(val) => {
									val = clamp(val, 0, 100)

									setBGAlpha(Number(val))
									storage.colors.backgroundColorAlpha = alphaToHex(val);
								}}
							/>
						</>) : (<>
							<FormSliderRow
								label={`背景颜色透明度：${BGAlpha}%`}
								value={BGAlpha}
								minVal={0}
								maxVal={100}
								style={{ width: "90%" }}
								onValueChange={(v) => {
									setBGAlpha(Number(v))
									storage.colors.backgroundColorAlpha = alphaToHex(v);
								}}
							/>
						</>)
				}

				<FormDivider/>

				{
					useText ? (<>
							<FormInput
								title={`背景侧栏透明度：${gutterAlpha}%`}
								keyboardType="numeric"
								style={{ width: "90%" }}
								value={`${gutterAlpha}`}
								onChange={(val) => {
									val = clamp(val, 0, 100)

									setGutterAlpha(Number(val))
									storage.colors.gutterColorAlpha = alphaToHex(val);
								}}
							/>
						</>) : (<>
							<FormSliderRow
								label={`背景侧栏透明度：${gutterAlpha}%`}
								value={gutterAlpha}
								minVal={0}
								maxVal={100}
								style={{ width: "90%" }}
								onValueChange={(v) => {
									setGutterAlpha(Number(v))
									storage.colors.gutterColorAlpha = alphaToHex(v);
								}}
							/>
						</>)
				}

			</View>
		</View>
	</>)
}
