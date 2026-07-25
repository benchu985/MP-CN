import { useProxy } from "@vendetta/storage"
import { storage } from "@vendetta/plugin"
import { SelectRow } from "../lib/SelectRow"
import { Forms } from "@vendetta/ui/components"
import { plugin } from "@vendetta";
import { findByName } from "@vendetta/metro";
import { showToast } from "@vendetta/ui/toasts";

const HelpMessage = findByName("HelpMessage");

const { FormRow, FormDivider, FormInput, FormSwitch } = Forms


export default function NerdComponent({ stx }) {
	useProxy(storage)

	const [plugUri, setPlugUri] = React.useState(plugin.id)

	return (<>
		<HelpMessage messageType={0}>更改插件网址可能会将后续更新重定向到新来源，或导致无法更新。</HelpMessage>
		<FormInput
			title="更改插件网址"
			keyboardType="default"
			placeholder="https://benchu985.github.io/MP-CN/angel/antied"
			value={plugUri}
			onChange={(val) => {
				plugin.id = val?.toString()
				setPlugUri(val?.toString())
			}}
		/>
		<FormDivider />
		<FormRow
			label="恢复原始网址"
			subLabel="点击切换到正式版网址（将退出调试版本）。"
			onPress={() => {
				plugin.id = "https://benchu985.github.io/MP-CN/angel/antied";
				showToast("插件网址已恢复为原始网址。")
			}}
		/>
		<FormDivider />
		<FormRow
			label="恢复原始插件名称"
			subLabel="点击重置为默认名称。"
			onPress={() => {
				plugin.manifest.name = plugin.manifest.originalName;
				showToast("插件名称已恢复为原始名称。")
			}}
		/>
		<FormDivider />
		<FormRow
			label="调试"
			subLabel="启用常规控制台日志"
			style={{ paddingBottom: 20 }}
			trailing={
				<FormSwitch
					value={storage.debug}
					onValueChange={(value) => {
						storage.debug = value
					}}
				/>
			}
		/>
		<FormDivider />
		<FormRow
			label="调试 updateRows"
			subLabel="启用 updateRows 控制台日志"
			style={{ paddingBottom: 20 }}
			trailing={
				<FormSwitch
					value={storage.debugUpdateRows}
					onValueChange={(value) => {
						storage.debugUpdateRows = value
					}}
				/>
			}
		/>
	</>)
}
