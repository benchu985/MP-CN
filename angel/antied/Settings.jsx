import { constants, React, ReactNative, stylesheet, NavigationNative } from "@vendetta/metro/common";
import { findByName } from '@vendetta/metro';
import { useProxy } from "@vendetta/storage";
import { storage } from "@vendetta/plugin";
import { semanticColors } from "@vendetta/ui";
import { Forms, General } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets"

import ColorPickComponent from './components/colorpick';
import CustomizationComponent from './components/customize';
import IgnoreListComponent from './components/ignorelist';
import NerdComponent from './components/nerd';
import PatchesComponent from './components/patches';
import TextComponent from './components/texts';
import TimestampComponent from './components/timestamp';
import CreditsPage from './components/credits';

import bugs from "./knowbug";
import VersionChange from "../../lib/components/versionChange";

const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormSliderRow } = Forms;

const LinearGradient = findByName("LinearGradient");
const styles = stylesheet.createThemedStyleSheet({
	text: {
		color: semanticColors.HEADER_SECONDARY,
		paddingLeft: "5.5%",
		paddingRight: 10,
		marginBottom: 10,
		letterSpacing: 0.25,
		fontFamily: constants.Fonts.PRIMARY_BOLD,
		fontSize: 16
	},
	subText: {
		color: semanticColors.TEXT_POSITIVE,
		paddingLeft: "6%",
		paddingRight: 10,
		marginBottom: 10,
		letterSpacing: 0.25,
		fontFamily: constants.Fonts.DISPLAY_NORMAL,
		fontSize: 12
	},
	input: {
		fontSize: 16,
		fontFamily: constants.Fonts.PRIMARY_MEDIUM,
		color: semanticColors.TEXT_NORMAL
	},
	placeholder: {
		color: semanticColors.INPUT_PLACEHOLDER_TEXT
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	colorPreview: {
		width: "75%",
		height: 100,
		marginBottom: 20,
	},
	row: {
		flexDirection: "row",
		height: 80,
		width: "90%",
		marginBottom: 20
	},
	border: {
		borderRadius: 12
	},
	lnBorder: {
		borderRadius: 12,
		overflow: "hidden"
	},
	shadowTemplate: {
		shadowOffset: {
			width: 1,
			height: 3,
		},
		shadowOpacity: 0.9,
		shadowRadius: 24.00,
		elevation: 16,
	},
	lnShadow: {
		flex: 1,
		margin: "1%",
		shadowColor: "#b8ff34"
	},
	darkMask: {
		backgroundColor: "rgba(10, 10, 10, 0.9)",
		margin: 2,
		padding: "3%"
	},
	padBot: {
		paddingBottom: 20
	}
});

export default function SettingPage() {
	useProxy(storage);

	const [animation] = React.useState(new Animated.Value(0));
	const [isKnownBugOpen, setKnownBugOpen] = React.useState(false)

	const navigation = NavigationNative.useNavigation();

	const openCreditPage = () => {
		navigation.push("VendettaCustomPage", {
			title: `鸣谢与支持`,
			render: () => React.createElement(CreditsPage, { styles: styles })
		})
	}

	React.useEffect(() => {
		Animated.loop(
			Animated.timing(
				animation,
				{
					toValue: 4,
					duration: 8000,
					useNativeDriver: true,
				}
			)
		).start();
	}, []);

	const bgStyle = {
		backgroundColor: animation.interpolate({
			inputRange: [0, 1, 2, 3, 4],
			outputRange: [
				"rgba(188,31,31,0.5)",
				"rgba(46,168,30,0.5)",
				"rgba(48,179,173,0.5)",
				"rgba(183,40,198,0.5)",
				"rgba(188,31,31,0.5)",
			],
		}),
	};

	const createChild = (id, title, label, subLabel, props, propsData) => {
		return { id, title, label, subLabel, props, propsData }
	}

	const ComponentChildren = [
		createChild("patches", "插件补丁", "显示补丁选项", "开关插件要应用的补丁", PatchesComponent, styles),
		createChild("customize", "自定义", "自定义", null, CustomizationComponent, styles),
		createChild("text", "文本变量", "自定义文本", null, TextComponent, styles),
		createChild("timestamp", "时间戳", "时间戳样式", null, TimestampComponent, styles),
		createChild("colorpick", "颜色", "自定义颜色", null, ColorPickComponent, styles),
		createChild("ingorelist", "忽略列表", "显示忽略列表", null, IgnoreListComponent, null),
		createChild("nerd", "高级选项", "打开高级选项", null, NerdComponent, null, styles),
	]

	// const currentOS = ReactNative?.Platform?.OS || null;

	const entireUIList = (<>
		<View style={[ styles.lnBorder, bgStyle, styles.darkMask ]}>
			{
				ComponentChildren.map((element) => {
					return (<>
						<FormSection title={element?.title}>
							<FormRow
								label={element?.label}
								subLabel={element?.subLabel}
								onPress={() => {
									storage.setting[element?.id] = !storage.setting[element?.id];
								}}
								trailing={
									(storage.setting[element?.id] == true) ?
									(<FormRow.Icon source={getAssetIDByName("ic_arrow_down")} />) :
									(<FormRow.Icon source={getAssetIDByName("ic_arrow_right")} />)
								}
							/>
							{
								storage.setting[element.id] &&
								element.props && (
									<View style={{
										margin: 5,
										padding: 10,
										borderRadius: 10,
										backgroundColor: "rgba(0, 0, 0, 0.15)"
									}}>
										{React.createElement(element.props, { styles: element.propsData })}
									</View>
								)
							}
						</FormSection>
					</>)
				})
			}

			{
				bugs && (
					<FormSection title="已知问题">
						<FormRow
							label="点击查看已知问题"
							style={{padding: 2 }}
							onPress={() => {
								setKnownBugOpen(!isKnownBugOpen)
							}}
						/>
						{

							isKnownBugOpen && (
								<View style={{
									margin: 5,
									padding: 5,
									borderRadius: 10,
									backgroundColor: "rgba(59, 30, 55, 0.15)"
								}}>
									{
										bugs.map((data, index) => {
											return (
												<FormRow
													label={data.bugType}
													subLabel={data.bugDescription}
													style={[styles.padBot]}
												/>
											)
										})
									}
									</View>
							)
						}
					</FormSection>
				)
			}
		</View>
	</>)

	return (<>
		<ScrollView>
			<LinearGradient
				start={{x: 0.8, y: 0}}
				end={{x: 0, y: 0.8}}
				colors={[ "#b8ff34", "#4bff61", "#44f6ff", "#4dafff", "#413dff", "#d63efd" ]}
				style={[ styles.lnBorder, styles.shadowTemplate, styles.lnShadow, styles.padBot ]}
			>
				<FormRow
					label="鸣谢"
					subLabel="查看插件贡献者及支持开发的方式。"
					onPress={openCreditPage}
					style={[ styles.lnBorder, bgStyle, styles.darkMask ]}
					trailing={<FormRow.Icon source={getAssetIDByName("ic_arrow_right")} />}
				/>

				{entireUIList}
			</LinearGradient>
			<View style={{ height: 60 }} />
		</ScrollView>
	</>)
}