import { storage } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { NavigationNative } from "@vendetta/metro/common"

import ListUsers from "../pages/listUsers"

import { Forms, General } from "@vendetta/ui/components";
const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormSliderRow } = Forms;

export default function IgnoreListComponent() {
	useProxy(storage)

	const navigation = NavigationNative.useNavigation();

	const listIgnore = () => {
		navigation.push("VendettaCustomPage", {
			title: `已忽略用户列表`,
			render: () => <ListUsers/>
		})
	}


	return (<>
		<FormRow
			label="添加用户到列表"
			subLabel="插件将忽略这些用户"
			leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_members")} />}
			onPress={listIgnore}
			trailing={
				<TouchableOpacity onPress={listIgnore}>
					<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_add_24px")} />
				</TouchableOpacity>
			}
		/>
		<FormDivider />
	</>)
}

