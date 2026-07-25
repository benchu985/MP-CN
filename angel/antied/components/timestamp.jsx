import { useProxy } from "@vendetta/storage"
import { storage } from "@vendetta/plugin"
import { SelectRow } from "../lib/SelectRow"
import { Forms } from "@vendetta/ui/components"

const timestamps = [
	{
		type: "t",
		label: "短时间",
		subLabel: "16:20",
	},
	{
		type: "T",
		label: "长时间",
		subLabel: "16:20:30",
	},
	{
		type: "d",
		label: "短日期",
		subLabel: "20/04/2021",
	},
	{
		type: "D",
		label: "长日期",
		subLabel: "2021年4月20日",
	},
	{
		type: "f",
		label: "短日期/时间",
		subLabel: "2021年4月20日 16:20",
	},
	{
		type: "F",
		label: "长日期/时间",
		subLabel: "2021年4月20日 星期二 16:20",
	},
	{
		type: "R",
		label: "相对时间",
		subLabel: "2 个月前",
	},
]

const timestampsPosition = [
	{
		label: "前置",
		subLabel: "旧消息（2 分钟前）[已编辑] 新消息",
		key: "BEFORE"
	},
	{
		label: "后置",
		subLabel: "旧消息 [已编辑]（2 分钟前）新消息",
		key: "AFTER"
	},
]


const { FormRow, FormDivider } = Forms


export default function TimestampComponent() {
	useProxy(storage)

	return (<>
		<FormRow label="时间戳样式"/>
		{
			timestamps.map(({ type, label, subLabel }, i) => {
				return (<>
					<SelectRow
						label={label}
						subLabel={`示例：${subLabel}`}
						selected={storage.switches.timestampStyle == type}
						onPress={() => storage.switches.timestampStyle = type}
					/>
					{i !== timestamps.length - 1 && <FormDivider />}
				</>)
			})
		}
		<FormDivider />
		<FormRow label="时间戳位置"/>
		{
			timestampsPosition.map(({ key, label, subLabel }, i) => {
				return (<>
					<SelectRow
						label={label}
						subLabel={`示例：${subLabel}`}
						selected={storage.misc?.timestampPos == key}
						onPress={() => storage.misc.timestampPos = key}
					/>
					{i !== timestampsPosition.length - 1 && <FormDivider />}
				</>)
			})
		}
	</>)
}
