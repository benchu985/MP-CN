const knownBugs = [
	{
		bugType: "SELF_EDIT_MESSAGE",
		bugDescription: "开始编辑消息时，旧历史可能会一并带入。可使用 BetterBetterChatGestrure 插件中的 Antied Watch 功能强制编辑消息。"
	},
	{
		bugType: "MESSAGE_DELETION_BOT_DISMISS",
		bugDescription: "极少数情况下，删除补丁可能无法关闭临时消息，常见于机器人消息。"
	},
]


export default knownBugs;