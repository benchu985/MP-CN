import { storage } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"
import { React, url } from "@vendetta/metro/common";
import { Forms, General } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets"
import { findByStoreName } from "@vendetta/metro";

const UserStore = findByStoreName("UserStore");

const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated } = General;
const { FormLabel, FormArrow, FormRow, FormSection, FormDivider, FormInput } = Forms;

const me = { name: 'Angel', role: '作者与维护者', uuid: "692632336961110087" };

const qa   = [
	{ name: 'Rairof', role: '质量保证', uuid: "923212189123346483" },
	{ name: 'Moodle',   role: '质量保证', uuid: "807170846497570848" },
	{ name: 'Catinette', role: '质量保证', uuid: "1302022854740807730" },
	{ name: 'Win8.1VMUser', role: "质量保证", uuid: "793935599702507542" }
	// { name: 'Dave',  role: '质量保证' }
];
const links = [
	{
		label: '源代码',
		url: 'https://github.com/benchu985/MP-CN',
	},
	{
		label: '通过 PayPal 打赏',
		url: 'https://paypal.me/alixymizuki',
	},
	{
		label: '请我喝杯 Ko-fi',
		url: 'https://ko-fi.com/angel_wolf',
	},
];


export default function CreditsPage() {
	useProxy(storage)

	const open = (uri) => url.openURL(uri).catch(() => {});

	const getUser = id => UserStore?.getUser(id) || Object.values(UserStore?.getUsers()).find(u => u.id === id) || null;

	const getUserPng = id => {
		const u = getUser(id);
		return u?.getAvatarURL?.()?.replace('webp', 'png') || null
	};

	const box = u => (<Image source={{ uri: u }} style={{ width: 40, height: 40, borderRadius: 20 }} />);

	return (<>
		<ScrollView>
			{/* ---- Dev ---- */}
			<FormSection title="开发者">
				<FormRow
					label={me.name}
					subLabel={me.role}
					leading={box(getUserPng(me?.uuid))}
				/>
			</FormSection>

			{/* ---- QA ---- */}
			<FormSection title="测试者">
				{qa.map((p, i) => {

					const avatarUri = getUserPng(p?.uuid)

					return (<FormRow
						key={i}
						label={p.name}
						subLabel={p.role}
						leading={avatarUri ? box(avatarUri) : null}
					/>)
				})}
			</FormSection>
			<FormDivider />

			{/* ---- Links ---- */}
			<FormSection title="支持与源代码">
				<View style={{ margin: 50 }}>
					{links.map((l, i) => {

						let finalIcon = l.icon ? (
							l.icon?.startsWith("https") ?
							(<Image source={{ uri: l.icon }} style={{ width: 120, height: 40 }} />) :
							(<FormRow.Icon source={getAssetIDByName(l.icon)}/>)
						) :	null;


						return (
							<FormRow
								key={i}
								label={l.label}
								leading={finalIcon}
								trailing={<FormArrow />}
								onPress={() => open(l.url)}
							/>
						)
					})}
			</View>
			</FormSection>
			<FormDivider />

			{/* extra bottom pad so last row isn’t hidden by inset */}
			<View style={{ height: 40 }} />
		</ScrollView>
	</>)
}

