(function(exports,_vendetta,metro,components,patcher$1,plugin,toasts,common,Assets,plugins,utils,storage,ui,alerts){'use strict';function _interopNamespaceDefault(e){var n=Object.create(null);if(e){Object.keys(e).forEach(function(k){if(k!=='default'){var d=Object.getOwnPropertyDescriptor(e,k);Object.defineProperty(n,k,d.get?d:{enumerable:true,get:function(){return e[k]}});}})}n.default=e;return Object.freeze(n)}var Assets__namespace=/*#__PURE__*/_interopNamespaceDefault(Assets);const { openLazy, hideActionSheet } = metro.findByProps("openLazy", "hideActionSheet");
function makeDefaults(object, defaults) {
  if (object != void 0) {
    if (defaults != void 0) {
      for (const key of Object.keys(defaults)) {
        if (typeof defaults[key] === "object" && !Array.isArray(defaults[key])) {
          if (typeof object[key] !== "object")
            object[key] = {};
          makeDefaults(object[key], defaults[key]);
        } else {
          object[key] ?? (object[key] = defaults[key]);
        }
      }
    }
  }
}
function openSheet(sheet, props) {
  try {
    openLazy(new Promise(function(call) {
      return call({
        default: sheet
      });
    }), "ActionSheet", props);
  } catch (e) {
    _vendetta.logger.error(e.stack);
    showToast("Got error when opening ActionSheet! Please check debug logs");
  }
}
const colorConverter = {
  toInt(hex) {
    hex = hex.replace(/^#/, "");
    return parseInt(hex, 16);
  },
  toHex(integer) {
    const hex = integer.toString(16).toUpperCase();
    return "#" + hex;
  },
  HSLtoHEX(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = function(n) {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
};
const transparentBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mJsrQAAAgwBAJ9P6qYAAAAASUVORK5CYII=";
const convert = {
  alphaToHex: function(percentageValue) {
    percentageValue = Number(percentageValue);
    const clampedPercentage = Math.min(Math.max(percentageValue, 0), 100);
    const hexValue = Math.round(clampedPercentage / 100 * 255).toString(16).toUpperCase();
    return hexValue.length === 1 ? "0" + hexValue : hexValue;
  },
  hexAlphaToPercent: function(hexAlpha) {
    const decimalAlpha = parseInt(hexAlpha, 16);
    if (isNaN(decimalAlpha)) {
      return 0;
    }
    return Math.round(decimalAlpha / 255 * 100);
  }
};const ChannelStore$1 = metro.findByProps("getChannel", "getDMFromUserId");
const ChannelMessages$2 = metro.findByProps("_channelMessages");
const MessageStore$1 = metro.findByProps("getMessage", "getMessages");
const now = function() {
  return Date.now();
};
const tsStyle = function() {
  const s = plugin.storage.switches?.timestampStyle;
  return s && "tTdDfFR".includes(s) ? s : "R";
};
function fluxDispatchPatch(deletedMessageArray) {
  return patcher$1.before("dispatch", common.FluxDispatcher, function(args) {
    if (exports.isEnabled) {
      try {
        const ev = args[0];
        if (!ev || !ev.type)
          return;
        const cfg = plugin.storage;
        if (cfg.debug)
          console.log("[ANTIED flux]", ev);
        if (ev.type === "MESSAGE_DELETE") {
          if (!cfg.switches?.enableMD || ev.otherPluginBypass)
            return;
          const orig = ChannelMessages$2.get(ev.channelId)?.get(ev.id);
          if (!orig?.author?.id || !orig.author.username)
            return;
          if (orig?.author?.bot && orig?.flags == 64)
            return;
          if (!orig.content && !orig.attachments?.length && !orig.embeds?.length)
            return;
          if (cfg.switches.ignoreBots && orig.author.bot)
            return;
          if (cfg.inputs?.ignoredUserList?.length) {
            const list = cfg.inputs.ignoredUserList;
            if (list.some(function(u) {
              return u.id === orig.author.id || u.username === orig.author.username;
            }))
              return;
          }
          const entry = deletedMessageArray.get(ev.id);
          if (entry?.stage === 2)
            return;
          if (entry?.stage === 1) {
            entry.stage = 2;
            return entry.message || args;
          }
          const guildId = ChannelStore$1.getChannel(orig.channel_id || ev.channelId)?.guild_id;
          ev.message = {
            ...orig,
            content: orig.content,
            channel_id: orig.channel_id || ev.channelId,
            guild_id: guildId,
            was_deleted: true,
            message_reference: orig?.message_reference || orig?.messageReference || null
          };
          if (cfg.switches.useEphemeralForDeleted)
            ev.message.flags = 64;
          ev.type = "MESSAGE_UPDATE";
          ev.channelId = orig.channel_id || ev.channelId;
          ev.optimistic = false;
          ev.sendMessageOptions = {};
          ev.isPushNotification = false;
          deletedMessageArray.set(ev.id, {
            message: args,
            stage: 1
          });
          return args;
        }
        if (ev.type === "MESSAGE_UPDATE") {
          if (!cfg.switches?.enableMU || ev.otherPluginBypass)
            return;
          const msg = ev.message;
          if (!msg || msg.author?.bot)
            return;
          const chId = msg.channel_id || ev.channelId;
          const id = msg.id || ev.id;
          const orig = MessageStore$1.getMessage(chId, id) || ChannelMessages$2.get(chId)?.get(id);
          if (!orig?.author?.id || !orig.author.username)
            return;
          if (!orig.content && !orig.attachments?.length && !orig.embeds?.length)
            return;
          if (!msg.content || msg.content === orig.content)
            return;
          if (cfg.inputs?.ignoredUserList?.length) {
            const list = cfg.inputs.ignoredUserList;
            if (list.some(function(u) {
              return u.id === orig.author.id || u.username === orig.author.username;
            }))
              return;
          }
          const editedTag = cfg.inputs?.editedMessageBuffer || "`[ EDITED ]`";
          const time = cfg.switches?.addTimestampForEdits ? `(<t:${Math.floor(now() / 1e3)}:${tsStyle()}>)` : null;
          const tsPos = cfg.misc?.timestampPos === "BEFORE";
          let prefix = `${editedTag}`;
          prefix = time ? tsPos ? `${time} ${prefix}

` : `${prefix} ${time}

` : `${prefix}

`;
          ev.message = {
            ...msg,
            content: `${orig.content} ${prefix}${msg.content}`,
            guild_id: ChannelStore$1.getChannel(chId)?.guild_id ?? msg.guild_id,
            edited_timestamp: "invalid_timestamp",
            message_reference: msg?.message_reference || orig?.messageReference || null
          };
          return args;
        }
      } catch (e) {
        toasts.showToast("[ANTIED] FluxDispatcher \u53D1\u751F\u9519\u8BEF\uFF0C\u8BF7\u67E5\u770B\u65E5\u5FD7\u3002");
        console.error("[ANTIED] Flux patch\n", e);
      }
    }
  });
}const Message = metro.findByProps("sendMessage", "startEditMessage");
function selfEditPatch() {
  return patcher$1.before("startEditMessage", Message, function(args) {
    if (!exports.isEnabled)
      return;
    let Edited = plugin.storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`";
    const DAN = regexEscaper(Edited);
    const regexPattern = new RegExp(`(?:(?:\\s${DAN}(\\s\\(<t:\\d+:[tTdDfFR]>\\))?\\n{2})|(?:(?:\\s\\(<t:\\d+:[tTdDfFR]>\\) ${DAN}\\n{2})))`, "gm");
    const [channelId, messageId, msg] = args;
    const lats = msg.split(regexPattern);
    const f = lats[lats.length - 1];
    args[2] = f;
  });
}const rowsController = metro.findByProps("updateRows", "getConstants") || metro.findByProps("updateRows");
if (!rowsController) {
  console.error("[ANTIED] rowsController not found \u2013 patch will not be applied");
}
function updateRowsPatch(deletedMessagesArray) {
  return patcher$1.before("updateRows", rowsController, function(args) {
    if (exports.isEnabled) {
      if (!args?.length)
        return;
      const raw = args[1];
      if (!raw)
        return;
      let rows;
      let isString = false;
      if (typeof raw === "string") {
        try {
          rows = JSON.parse(raw);
          isString = true;
        } catch {
          return;
        }
      } else if (Array.isArray(raw)) {
        rows = raw;
      } else {
        return;
      }
      const hasDeleted = rows.some(function(r) {
        return r?.message && deletedMessagesArray.has(r.message.id);
      });
      if (!hasDeleted)
        return;
      const { colors: { textColor, backgroundColor, backgroundColorAlpha, gutterColor, gutterColorAlpha }, switches: { useBackgroundColor, minimalistic, removeDismissButton, overrideIndicator, useIndicatorForDeleted, useEphemeralForDeleted }, inputs: { deletedMessageBuffer, customIndicator } } = plugin.storage;
      const toHex = function(v, fallback) {
        const s = String(v || "").trim();
        const hex = s.startsWith("#") ? s.slice(1) : s;
        return /^[0-9a-fA-F]{6}$/.test(hex) ? `#${hex.toUpperCase()}` : fallback;
      };
      const bufferSymbol = " \u2022 ";
      for (const row of rows) {
        if (row?.type !== 1)
          continue;
        const msg = row.message;
        if (!msg || !deletedMessagesArray.has(msg.id))
          continue;
        if (useIndicatorForDeleted && useEphemeralForDeleted) {
          msg.ephemeralIndication.content[0].content = `${deletedMessageBuffer}${bufferSymbol}  `;
        } else if (deletedMessageBuffer) {
          msg.edited = deletedMessageBuffer;
        }
        if (!minimalistic) {
          msg.textColor = common.ReactNative.processColor(toHex(textColor, "#E40303"));
        }
        if (overrideIndicator) {
          msg.ephemeralIndication.content = [];
        } else if (!useIndicatorForDeleted && customIndicator) {
          msg.ephemeralIndication.content[0].content = `${customIndicator}  `;
        }
        if (removeDismissButton && msg.ephemeralIndication?.content) {
          msg.ephemeralIndication?.content?.splice?.(1, 1);
        }
        if (!minimalistic && useBackgroundColor) {
          row.backgroundHighlight = {
            backgroundColor: common.ReactNative.processColor(toHex(backgroundColor, "#FF2C2F") + backgroundColorAlpha),
            gutterColor: common.ReactNative.processColor(toHex(gutterColor, "#FF2C2F") + gutterColorAlpha)
          };
        }
      }
      if (isString)
        args[1] = JSON.stringify(rows);
      else
        args[1] = rows;
      return args;
    }
  });
}const MessageRecordUtils$1 = metro.findByProps("updateMessageRecord", "createMessageRecord");
function createMessageRecord() {
  return patcher$1.after("createMessageRecord", MessageRecordUtils$1, function([message], record) {
    if (exports.isEnabled) {
      record.was_deleted = message.was_deleted;
    }
  });
}const MessageRecord = metro.findByName("MessageRecord", false);
function messageRecordDefault() {
  return patcher$1.after("default", MessageRecord, function([props], record) {
    if (exports.isEnabled) {
      record.was_deleted = !!props.was_deleted;
    }
  });
}const MessageRecordUtils = metro.findByProps("updateMessageRecord", "createMessageRecord");
function updateMessageRecord() {
  return patcher$1.instead("updateMessageRecord", MessageRecordUtils, function([oldRecord, newRecord], orig) {
    if (newRecord.was_deleted) {
      return MessageRecordUtils.createMessageRecord(newRecord, oldRecord.reactions);
    }
    return orig.apply(this, [
      oldRecord,
      newRecord
    ]);
  });
}const ActionSheet = metro.findByProps("openLazy", "hideActionSheet");
const MessageStore = metro.findByProps("getMessage", "getMessages");
const ChannelStore = metro.findByProps("getChannel", "getDMFromUserId");
const ChannelMessages$1 = metro.findByProps("_channelMessages");
const { ActionSheetRow } = metro.findByProps("ActionSheetRow");
function actionsheet(deletedMessageArray) {
  return patcher$1.before("openLazy", ActionSheet, function([component, args, actionMessage]) {
    if (exports.isEnabled) {
      try {
        const message = actionMessage?.message;
        if (args !== "MessageLongPressActionSheet" || !message)
          return;
        component.then(function(instance) {
          const unpatch = patcher$1.after("default", instance, function(_, comp) {
            try {
              let someFunc = function(a) {
                return a?.props?.label?.toLowerCase?.() == "reply";
              };
              common.React.useEffect(function() {
                return function() {
                  unpatch();
                };
              }, []);
              if (plugin.storage.debug)
                console.log(`[ANTIED ActionSheet]`, message);
              const buttons = utils.findInReactTree(comp, function(c) {
                return c?.find?.(someFunc);
              });
              if (!buttons)
                return comp;
              const position = Math.max(buttons.findIndex(someFunc), buttons.length - 1);
              let originalMessage = null;
              if (message?.channel_id && message?.id) {
                originalMessage = MessageStore.getMessage(message?.channel_id, message?.id);
                if (!originalMessage) {
                  const channel = ChannelMessages$1.get(message?.channel_id);
                  originalMessage = channel?.get(message?.id);
                }
              }
              if (!originalMessage)
                return comp;
              const escapedBuffer = regexEscaper(plugin.storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`");
              const separator = new RegExp(escapedBuffer, "gmi");
              const checkIfBufferExist = separator.test(message.content);
              if (checkIfBufferExist) {
                const targetPos = position || 1;
                buttons.splice(targetPos, 0, /* @__PURE__ */ common.React.createElement(ActionSheetRow, {
                  label: "\u6E05\u9664\u7F16\u8F91\u5386\u53F2",
                  subLabel: `\u7531 ${stripVersions(_vendetta.plugin?.manifest?.name) || "ANTIED"} \u6DFB\u52A0`,
                  icon: /* @__PURE__ */ common.React.createElement(ActionSheetRow.Icon, {
                    source: Assets.getAssetIDByName("ic_edit_24px")
                  }),
                  onPress: function() {
                    const DAN = escapedBuffer;
                    const regexPattern = new RegExp(`(?:(?:\\s${DAN}(\\s\\(<t:\\d+:[tTdDfFR]>\\))?\\n{2})|(?:(?:\\s\\(<t:\\d+:[tTdDfFR]>\\) ${DAN}\\n{2})))`, "gm");
                    const lats = message?.content?.split(regexPattern);
                    if (plugin.storage.debug) {
                      console.log([
                        [
                          escapedBuffer
                        ],
                        message?.content?.split(regexPattern),
                        lats
                      ]);
                    }
                    const targetMessage = lats[lats.length - 1];
                    common.FluxDispatcher.dispatch({
                      type: "MESSAGE_UPDATE",
                      message: {
                        ...message,
                        message_reference: message?.message_reference || message?.messageReference || null,
                        content: `${targetMessage}`,
                        guild_id: ChannelStore.getChannel(originalMessage.channel_id).guild_id
                      },
                      otherPluginBypass: true
                    });
                    ActionSheet.hideActionSheet();
                    if (plugin.storage?.inputs?.historyToast?.length > 0 || plugin.storage?.inputs?.historyToast != "") {
                      toasts.showToast(plugin.storage?.inputs?.historyToast?.toString?.(), Assets.getAssetIDByName(plugin.storage?.misc?.editHistoryIcon || "ic_edit_24px"));
                    }
                  }
                }));
              }
              if (plugin.storage.debug)
                console.log(`[ANTIED ActionSheet]`, "useEphemeralForDeleted", !plugin.storage?.switches?.useEphemeralForDeleted, "msgExist?", Boolean(deletedMessageArray.has(message.id)));
              if (!plugin.storage?.switches?.useEphemeralForDeleted && deletedMessageArray.has(message.id)) {
                const targetPos = position || 1;
                buttons.splice(targetPos, 0, /* @__PURE__ */ common.React.createElement(ActionSheetRow, {
                  label: "\u79FB\u9664\u5DF2\u5220\u9664\u6D88\u606F",
                  subLabel: `\u7531 ${stripVersions(_vendetta.plugin?.manifest?.name) || "ANTIED"} \u6DFB\u52A0`,
                  isDestructive: true,
                  icon: /* @__PURE__ */ common.React.createElement(ActionSheetRow.Icon, {
                    source: Assets.getAssetIDByName("ic_edit_24px")
                  }),
                  onPress: function() {
                    common.FluxDispatcher.dispatch({
                      type: "MESSAGE_DELETE",
                      guildId: ChannelStore.getChannel(originalMessage.channel_id).guild_id,
                      id: message?.id,
                      channelId: message?.channel_id,
                      otherPluginBypass: true
                    });
                    ActionSheet.hideActionSheet();
                    if (plugin.storage?.inputs?.historyToast?.length > 0 || plugin.storage?.inputs?.historyToast != "") {
                      toasts.showToast(`[ANTIED] \u6D88\u606F\u5DF2\u79FB\u9664`, Assets.getAssetIDByName("ic_edit_24px"));
                    }
                  }
                }));
              }
            } catch (e) {
              toasts.showToast("[ANTIED] \u64CD\u4F5C\u83DC\u5355\u53D1\u751F\u9519\u8BEF\uFF0C\u8BF7\u67E5\u770B\u8C03\u8BD5\u65E5\u5FD7\u4E86\u89E3\u8BE6\u60C5\u3002");
              console.error("[ANTIED Error > ActionSheet:Component Patch\n", e);
            }
          });
        });
      } catch (e) {
        toasts.showToast("[ANTIED] \u64CD\u4F5C\u83DC\u5355\u53D1\u751F\u9519\u8BEF\uFF0C\u8BF7\u67E5\u770B\u8C03\u8BD5\u65E5\u5FD7\u4E86\u89E3\u8BE6\u60C5\u3002");
        console.error("[ANTIED Error > ActionSheet Patch\n", e);
      }
    }
  });
}const { FormRow: FormRow$d } = components.Forms;
const RowCheckmark = metro.findByName("RowCheckmark");
function SelectRow({ label, subLabel, selected, onPress }) {
  return /* @__PURE__ */ React.createElement(FormRow$d, {
    label,
    subLabel,
    trailing: /* @__PURE__ */ React.createElement(RowCheckmark, {
      selected
    }),
    onPress
  });
}const SC = Object.keys(ui.semanticColors).map(function(x) {
  return `semanticColors.${x}`;
});
const RC = Object.keys(ui.rawColors).map(function(x) {
  return `rawColors.${x}`;
});
const semRaw = [
  ...SC,
  ...RC
];
const { FormRow: FormRow$c, FormDivider: FormDivider$c, ScrollView: ScrollView$a } = components.Forms;
function SemRawComponent() {
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ScrollView$a, null, /* @__PURE__ */ React.createElement(FormRow$c, {
    label: "\u9009\u62E9\u989C\u8272"
  }), semRaw.map(function(NAME, i) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SelectRow, {
      label: NAME,
      selected: plugin.storage.colors.semRawColorPrefix == NAME,
      onPress: function() {
        return plugin.storage.colors.semRawColorPrefix = NAME;
      }
    }), i !== semRaw.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$c, null));
  })));
}const CustomColorPickerActionSheet = metro.findByName("CustomColorPickerActionSheet");
const { alphaToHex, hexAlphaToPercent } = convert;
const { ScrollView: ScrollView$9, View: View$9, Text: Text$9, TouchableOpacity: TouchableOpacity$9, TextInput: TextInput$9, Pressable: Pressable$6, Image: Image$8, Animated: Animated$8 } = components.General;
const { FormLabel: FormLabel$8, FormIcon: FormIcon$8, FormArrow: FormArrow$8, FormRow: FormRow$b, FormSwitch: FormSwitch$9, FormSwitchRow: FormSwitchRow$7, FormSection: FormSection$8, FormDivider: FormDivider$b, FormInput: FormInput$9, FormSliderRow: FormSliderRow$4 } = components.Forms;
const customizeableColors = [
  {
    id: "textColor",
    label: "\u5DF2\u5220\u9664\u6D88\u606F\u6587\u5B57\u989C\u8272",
    subLabel: "\u70B9\u51FB\u81EA\u5B9A\u4E49\u5DF2\u5220\u9664\u6D88\u606F\u7684\u6587\u5B57\u989C\u8272",
    defaultColor: "#E40303"
  },
  {
    id: "backgroundColor",
    label: "\u5DF2\u5220\u9664\u6D88\u606F\u80CC\u666F\u989C\u8272",
    subLabel: "\u70B9\u51FB\u81EA\u5B9A\u4E49\u80CC\u666F\u989C\u8272",
    defaultColor: "#FF2C2F"
  },
  {
    id: "gutterColor",
    label: "\u5DF2\u5220\u9664\u6D88\u606F\u80CC\u666F\u4FA7\u680F\u989C\u8272",
    subLabel: "\u70B9\u51FB\u81EA\u5B9A\u4E49\u80CC\u666F\u4FA7\u680F\u989C\u8272",
    defaultColor: "#FF2C2F"
  }
];
function ColorPickComponent({ styles }) {
  storage.useProxy(plugin.storage);
  const clamp = function(v, min, max) {
    return Math.max(min, Math.min(max, v));
  };
  const [BGAlpha, setBGAlpha] = common.React.useState(clamp(hexAlphaToPercent(plugin.storage?.colors?.backgroundColorAlpha) ?? 100, 0, 100));
  const [gutterAlpha, setGutterAlpha] = common.React.useState(clamp(hexAlphaToPercent(plugin.storage?.colors?.gutterColorAlpha) ?? 100, 0, 100));
  const [useText, setUseText] = common.React.useState(false);
  const navigation = common.NavigationNative.useNavigation();
  const handleSemRaw = function(prefix) {
    if (!prefix)
      return null;
    const [pref, col] = prefix.split(".");
    if (pref == "semanticColors") {
      return ui.semanticColors[col];
    } else {
      return ui.rawColors[col];
    }
  };
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(View$9, {
    style: [
      styles.subText
    ]
  }, plugin.storage?.switches?.useSemRawColors && /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$b, {
    label: "\u8BED\u4E49\u4E0E\u539F\u59CB\u989C\u8272",
    subLabel: "\u542F\u7528\u201C\u4F7F\u7528\u8BED\u4E49/\u539F\u59CB\u989C\u8272\u201D\u540E\uFF0C\u53EF\u5728\u6B64\u9009\u62E9\u989C\u8272\u3002",
    leading: /* @__PURE__ */ common.React.createElement(FormRow$b.Icon, {
      source: Assets.getAssetIDByName("ic_audit_log_24px")
    }),
    trailing: FormRow$b.Arrow,
    onPress: function() {
      return navigation.push("VendettaCustomPage", {
        title: "\u8BED\u4E49\u4E0E\u539F\u59CB\u989C\u8272",
        render: function() {
          return /* @__PURE__ */ common.React.createElement(SemRawComponent, null);
        }
      });
    }
  })), customizeableColors?.map(function(obj) {
    const whenPressed = function() {
      return openSheet(CustomColorPickerActionSheet, {
        color: colorConverter?.toInt(plugin.storage.colors[obj.id] || obj?.defaultColor || "#000"),
        onSelect: function(color) {
          const value = colorConverter?.toHex(color);
          plugin.storage.colors[obj.id] = value;
        }
      });
    };
    return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$b, {
      label: obj?.label,
      subLabel: obj?.subLabel || "\u70B9\u51FB\u66F4\u65B0",
      onPress: whenPressed,
      trailing: /* @__PURE__ */ common.React.createElement(TouchableOpacity$9, {
        onPress: whenPressed
      }, /* @__PURE__ */ common.React.createElement(Image$8, {
        source: {
          uri: transparentBase64
        },
        style: {
          width: 32,
          height: 32,
          borderRadius: 10,
          backgroundColor: plugin.storage?.colors[obj.id] || customizeableColors.find(function(x) {
            return x?.id == obj?.id;
          })?.defaultColor || "#000"
        }
      }))
    }));
  }), /* @__PURE__ */ common.React.createElement(View$9, {
    style: styles.container
  }, /* @__PURE__ */ common.React.createElement(FormRow$b, {
    style: {
      justifyContent: "center",
      alignItems: "center"
    },
    label: `\u9884\u89C8\u6837\u5F0F\uFF1A${plugin.storage?.switches?.darkMode ? "\u6DF1\u8272" : "\u6D45\u8272"}\u6A21\u5F0F`,
    subLabel: `\u70B9\u51FB\u5207\u6362\u6A21\u5F0F`,
    trailing: /* @__PURE__ */ common.React.createElement(FormSwitch$9, {
      value: plugin.storage?.switches?.darkMode ?? true,
      onValueChange: function(value) {
        return plugin.storage.switches.darkMode = value;
      }
    })
  }), /* @__PURE__ */ common.React.createElement(View$9, {
    style: [
      styles.row,
      styles.border,
      {
        overflow: "hidden",
        marginRight: 10
      }
    ]
  }, /* @__PURE__ */ common.React.createElement(View$9, {
    style: {
      width: "2%",
      backgroundColor: `${plugin.storage.colors.gutterColor}${plugin.storage.colors.gutterColorAlpha}`
    }
  }), /* @__PURE__ */ common.React.createElement(View$9, {
    style: {
      flex: 1,
      backgroundColor: `${plugin.storage.switches.useSemRawColors ? handleSemRaw(plugin.storage?.colors?.semRawColorPrefix) || plugin.storage.colors.backgroundColor : plugin.storage.colors.backgroundColor}${plugin.storage.colors.backgroundColorAlpha}`,
      justifyContent: "center",
      alignItems: "center"
    }
  }, /* @__PURE__ */ common.React.createElement(Text$9, {
    style: {
      fontSize: 20,
      color: plugin.storage?.switches?.darkMode ? "black" : "white"
    }
  }, " \u666E\u901A\u793A\u4F8B\u6D88\u606F "), /* @__PURE__ */ common.React.createElement(Text$9, {
    style: {
      fontSize: 20,
      color: plugin.storage.colors.textColor || "#000000"
    }
  }, " \u5DF2\u5220\u9664\u793A\u4F8B\u6D88\u606F "))), /* @__PURE__ */ common.React.createElement(FormRow$b, {
    label: "\u70B9\u51FB\u5207\u6362\u8F93\u5165\u65B9\u5F0F",
    subLabel: "\u5728\u6ED1\u5757\u548C\u6570\u503C\u8F93\u5165\u4E4B\u95F4\u5207\u6362",
    onPress: function() {
      setUseText(!useText);
    }
  }), useText ? /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormInput$9, {
    title: `\u80CC\u666F\u989C\u8272\u900F\u660E\u5EA6\uFF1A${BGAlpha}%`,
    keyboardType: "numeric",
    style: {
      width: "90%"
    },
    value: `${BGAlpha}`,
    onChange: function(val) {
      val = clamp(val, 0, 100);
      setBGAlpha(Number(val));
      plugin.storage.colors.backgroundColorAlpha = alphaToHex(val);
    }
  })) : /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormSliderRow$4, {
    label: `\u80CC\u666F\u989C\u8272\u900F\u660E\u5EA6\uFF1A${BGAlpha}%`,
    value: BGAlpha,
    minVal: 0,
    maxVal: 100,
    style: {
      width: "90%"
    },
    onValueChange: function(v) {
      setBGAlpha(Number(v));
      plugin.storage.colors.backgroundColorAlpha = alphaToHex(v);
    }
  })), /* @__PURE__ */ common.React.createElement(FormDivider$b, null), useText ? /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormInput$9, {
    title: `\u80CC\u666F\u4FA7\u680F\u900F\u660E\u5EA6\uFF1A${gutterAlpha}%`,
    keyboardType: "numeric",
    style: {
      width: "90%"
    },
    value: `${gutterAlpha}`,
    onChange: function(val) {
      val = clamp(val, 0, 100);
      setGutterAlpha(Number(val));
      plugin.storage.colors.gutterColorAlpha = alphaToHex(val);
    }
  })) : /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormSliderRow$4, {
    label: `\u80CC\u666F\u4FA7\u680F\u900F\u660E\u5EA6\uFF1A${gutterAlpha}%`,
    value: gutterAlpha,
    minVal: 0,
    maxVal: 100,
    style: {
      width: "90%"
    },
    onValueChange: function(v) {
      setGutterAlpha(Number(v));
      plugin.storage.colors.gutterColorAlpha = alphaToHex(v);
    }
  })))));
}const { ScrollView: ScrollView$8, View: View$8, Text: Text$8, TouchableOpacity: TouchableOpacity$8, TextInput: TextInput$8, Pressable: Pressable$5, Image: Image$7, Animated: Animated$7 } = components.General;
const { FormRow: FormRow$a, FormIcon: FormIcon$7, FormSwitch: FormSwitch$8, FormDivider: FormDivider$a } = components.Forms;
const HelpMessage$1 = metro.findByName("HelpMessage");
const customizeableSwitches = [
  {
    id: "minimalistic",
    default: true,
    label: "\u6781\u7B80\u8BBE\u7F6E",
    subLabel: "\u79FB\u9664\u5168\u90E8\u6837\u5F0F\uFF08\u9ED8\u8BA4\u542F\u7528\uFF09"
  },
  {
    id: "useBackgroundColor",
    default: false,
    label: "\u542F\u7528\u80CC\u666F\u989C\u8272",
    subLabel: "\u4E3A\u5DF2\u5220\u9664\u6D88\u606F\u6DFB\u52A0\u53EF\u81EA\u5B9A\u4E49\u7684\u80CC\u666F\u989C\u8272\uFF0C\u7C7B\u4F3C\u63D0\u53CA\u9AD8\u4EAE\u3002"
  },
  {
    id: "useSemRawColors",
    default: false,
    label: "\u4F7F\u7528\u8BED\u4E49/\u539F\u59CB\u989C\u8272",
    subLabel: "\u80CC\u666F\u4F7F\u7528\u8BED\u4E49/\u539F\u59CB\u989C\u8272\u800C\u975E\u81EA\u5B9A\u4E49\u989C\u8272\uFF1B\u4E0D\u5F71\u54CD\u4FA7\u680F\u989C\u8272\u3002"
  },
  {
    id: "ignoreBots",
    default: false,
    label: "\u5FFD\u7565\u673A\u5668\u4EBA",
    subLabel: "\u5FFD\u7565\u673A\u5668\u4EBA\u7684\u5DF2\u5220\u9664\u6D88\u606F\u3002"
  },
  {
    id: "removeDismissButton",
    default: false,
    label: "\u79FB\u9664\u201C\u5173\u95ED\u6D88\u606F\u201D",
    subLabel: "\u79FB\u9664\u5DF2\u5220\u9664\u4E34\u65F6\u6D88\u606F\u4E2D\u53EF\u70B9\u51FB\u7684\u201C\u5173\u95ED\u6D88\u606F\u201D\u6587\u5B57\u3002"
  },
  {
    id: "addTimestampForEdits",
    default: false,
    label: "\u6DFB\u52A0\u7F16\u8F91\u65F6\u95F4\u6233",
    subLabel: "\u4E3A\u5DF2\u7F16\u8F91\u6D88\u606F\u6DFB\u52A0\u65F6\u95F4\u6233\u3002"
  },
  {
    id: "useEphemeralForDeleted",
    default: true,
    label: "\u5DF2\u5220\u9664\u6D88\u606F\u4F7F\u7528\u4E34\u65F6\u6D88\u606F",
    subLabel: "\u6D88\u606F\u5220\u9664\u540E\u4F7F\u7528\u4E34\u65F6\u6D88\u606F\u800C\u4E0D\u662F\u666E\u901A\u6D88\u606F\uFF08\u9ED8\u8BA4\u542F\u7528\uFF09\u3002"
  },
  {
    id: "useIndicatorForDeleted",
    default: false,
    label: "\u4E3A\u201C\u6B64\u6D88\u606F\u5DF2\u5220\u9664\u201D\u4F7F\u7528\u63D0\u793A\u6807\u8BB0",
    subLabel: "\u5DF2\u5220\u9664\u6D88\u606F\u663E\u793A\u201C\u4EC5\u4F60\u53EF\u89C1\u201D\u63D0\u793A\uFF0C\u800C\u4E0D\u662F\u201C\u5DF2\u7F16\u8F91\u201D\u3002"
  },
  {
    id: "overrideIndicator",
    default: false,
    label: "\u79FB\u9664\u4E34\u65F6\u6D88\u606F\u63D0\u793A",
    subLabel: "\u6D88\u606F\u5220\u9664\u540E\uFF0C\u6587\u5B57\u4E0B\u65B9\u4F1A\u663E\u793A\u201C\u4EC5\u4F60\u53EF\u89C1\u201D\u7B49\u63D0\u793A\uFF1B\u6B64\u9009\u9879\u4F1A\u79FB\u9664\u8BE5\u63D0\u793A\u3002"
  },
  {
    id: "useCustomPluginName",
    default: false,
    label: "\u4F7F\u7528\u81EA\u5B9A\u4E49\u540D\u79F0\u8986\u76D6\u63D2\u4EF6\u540D\u79F0",
    subLabel: "\u542F\u7528\u540E\u4EE5\u81EA\u5B9A\u4E49\u540D\u79F0\u66FF\u4EE3\u63D2\u4EF6\u540D\u79F0"
  }
];
function CustomizationComponent({ styles }) {
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View$8, {
    style: [
      styles.subText
    ]
  }, plugin.storage?.switches.minimalistic && /* @__PURE__ */ React.createElement(HelpMessage$1, {
    messageType: 0
  }, "\u82E5\u8981\u4F7F\u7528\u6837\u5F0F\uFF0C\u8BF7\u5173\u95ED\u201C\u6781\u7B80\u8BBE\u7F6E\u201D\u9009\u9879\u3002"), customizeableSwitches?.map(function(obj, index) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$a, {
      label: obj?.label,
      subLabel: obj?.subLabel,
      leading: obj?.icon && /* @__PURE__ */ React.createElement(FormIcon$7, {
        style: {
          opacity: 1
        },
        source: Assets.getAssetIDByName(obj?.icon)
      }),
      trailing: "id" in obj ? /* @__PURE__ */ React.createElement(FormSwitch$8, {
        value: plugin.storage?.switches[obj?.id] ?? obj?.default,
        onValueChange: function(value) {
          return plugin.storage.switches[obj?.id] = value;
        }
      }) : void 0
    }), index !== customizeableSwitches?.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$a, null));
  })));
}const { ScrollView: ScrollView$7, View: View$7, Text: Text$7, TouchableOpacity: TouchableOpacity$7, TextInput: TextInput$7, Image: Image$6, Animated: Animated$6 } = components.General;
const { FormLabel: FormLabel$7, FormIcon: FormIcon$6, FormArrow: FormArrow$7, FormRow: FormRow$9, FormSwitch: FormSwitch$7, FormSwitchRow: FormSwitchRow$6, FormSection: FormSection$7, FormDivider: FormDivider$9, FormInput: FormInput$8 } = components.Forms;
const useIsFocused$1 = metro.findByName("useIsFocused");
const { BottomSheetFlatList: BottomSheetFlatList$1 } = metro.findByProps("BottomSheetScrollView");
const UserStore$2 = metro.findByStoreName("UserStore");
const Profiles = metro.findByProps("showUserProfile");
Assets.getAssetIDByName("ic_add_24px");
Assets.getAssetIDByName("ic_arrow");
Assets.getAssetIDByName("ic_minus_circle_24px");
Assets.getAssetIDByName("Check");
Assets.getAssetIDByName("Small");
function addIcon$1(i) {
  return /* @__PURE__ */ common.React.createElement(FormIcon$6, {
    style: {
      opacity: 1
    },
    source: Assets.getAssetIDByName(i)
  });
}
const styles$2 = common.stylesheet.createThemedStyleSheet({
  basicPad: {
    paddingRight: 10,
    marginBottom: 10,
    letterSpacing: 0.25
  },
  header: {
    color: ui.semanticColors.HEADER_PRIMARY,
    fontFamily: common.constants.Fonts.DISPLAY_BOLD,
    fontSize: 25,
    paddingLeft: "3%",
    letterSpacing: 0.25
  },
  sub: {
    color: ui.semanticColors.TEXT_POSITIVE,
    fontFamily: common.constants.Fonts.DISPLAY_NORMAL,
    paddingLeft: "4%",
    fontSize: 18
  },
  flagsText: {
    color: ui.semanticColors.HEADER_SECONDARY,
    fontFamily: common.constants.Fonts.PRIMARY_BOLD,
    paddingLeft: "4%",
    fontSize: 16
  },
  container: {
    marginTop: 25,
    marginLeft: "5%",
    marginBottom: -15,
    flexDirection: "row"
  },
  textContainer: {
    paddingLeft: 15,
    paddingTop: 5,
    flexDirection: "column",
    flexWrap: "wrap",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 8
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 8
  },
  mainText: {
    opacity: 0.975,
    letterSpacing: 0.25
  },
  subHeader: {
    color: ui.semanticColors.HEADER_SECONDARY,
    fontSize: 12.75
  }
});
function AddUser({ index }) {
  storage.useProxy(plugin.storage);
  let object = plugin.storage?.inputs?.ignoredUserList[index];
  const animatedButtonScale = common.React.useRef(new Animated$6.Value(1)).current;
  const onPressIn = function() {
    return Animated$6.spring(animatedButtonScale, {
      toValue: 1.1,
      duration: 10,
      useNativeDriver: true
    }).start();
  };
  const onPressOut = function() {
    return Animated$6.spring(animatedButtonScale, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true
    }).start();
  };
  const animatedScaleStyle = {
    transform: [
      {
        scale: animatedButtonScale
      }
    ]
  };
  let user = UserStore$2.getUser(object?.id);
  let cached = Object.values(UserStore$2.getUsers());
  if (!user)
    user = cached.find(function(u) {
      return u?.username == object?.username;
    });
  if (!user)
    user = cached.find(function(u) {
      return u?.username?.toLowerCase() == object?.username?.toLowerCase();
    });
  const navigation = common.NavigationNative.useNavigation();
  useIsFocused$1();
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(ScrollView$7, null, /* @__PURE__ */ common.React.createElement(View$7, {
    style: [
      styles$2.basicPad,
      styles$2.sub
    ]
  }, /* @__PURE__ */ common.React.createElement(FormSection$7, {
    title: "\u7528\u6237\u8BBE\u7F6E",
    style: [
      styles$2.header
    ]
  }, /* @__PURE__ */ common.React.createElement(FormRow$9, {
    label: "\u67E5\u627E\u7528\u6237 ID \u6216\u7528\u6237\u540D",
    leading: addIcon$1("ic_search"),
    onPress: function() {
      if (user && !object.username?.length) {
        object.username = user.username;
      } else if (user && !object.id?.length) {
        object.id = user.id;
      } else {
        toasts.showToast("\u627E\u4E0D\u5230\u7528\u6237 ID \u6216\u7528\u6237\u540D\u3002");
      }
    }
  }), /* @__PURE__ */ common.React.createElement(FormInput$8, {
    title: "\u7528\u6237\u540D\uFF5C\u533A\u5206\u5927\u5C0F\u5199",
    placeholder: "\u672A\u586B\u5199",
    value: object?.username,
    onChange: function(v) {
      return object.username = v;
    }
  }), /* @__PURE__ */ common.React.createElement(FormInput$8, {
    title: "\u7528\u6237 ID",
    placeholder: "\u672A\u586B\u5199",
    value: object?.id,
    onChange: function(v) {
      return object.id = v;
    }
  }), /* @__PURE__ */ common.React.createElement(FormRow$9, {
    label: "\u7528\u6237\u662F Webhook \u5417\uFF1F",
    subLabel: "\u8BE5\u7528\u6237\u662F Webhook \u6216\u7CFB\u7EDF\u7528\u6237\uFF0C\u800C\u975E\u673A\u5668\u4EBA\u6216\u666E\u901A\u7528\u6237\u3002",
    leading: addIcon$1("ic_webhook_24px"),
    trailing: /* @__PURE__ */ common.React.createElement(FormSwitch$7, {
      value: object?.isWebhook || false,
      onValueChange: function(value) {
        return object.isWebhook = value;
      }
    })
  })), user && /* @__PURE__ */ common.React.createElement(View$7, {
    style: [
      styles$2.container,
      {
        paddingBottom: 10
      }
    ]
  }, /* @__PURE__ */ common.React.createElement(TouchableOpacity$7, {
    onPress: function() {
      return Profiles.showUserProfile?.({
        userId: user?.id
      });
    },
    onPressIn,
    onPressOut
  }, /* @__PURE__ */ common.React.createElement(Animated$6.View, {
    style: animatedScaleStyle
  }, /* @__PURE__ */ common.React.createElement(Image$6, {
    source: {
      uri: user?.getAvatarURL?.()?.replace?.("webp", "png") || "https://cdn.discordapp.com/embed/avatars/2.png"
    },
    style: {
      width: 128,
      height: 128,
      borderRadius: 10
    }
  }))), /* @__PURE__ */ common.React.createElement(View$7, {
    style: styles$2.textContainer
  }, /* @__PURE__ */ common.React.createElement(TouchableOpacity$7, {
    onPress: function() {
      return Profiles.showUserProfile({
        userId: user?.id
      });
    }
  }, /* @__PURE__ */ common.React.createElement(Text$7, {
    style: [
      styles$2.mainText,
      styles$2.header
    ]
  }, user?.username || object?.username || "\u65E0\u540D\u79F0"))), /* @__PURE__ */ common.React.createElement(FormDivider$9, null)), /* @__PURE__ */ common.React.createElement(FormRow$9, {
    label: /* @__PURE__ */ common.React.createElement(FormLabel$7, {
      text: "\u4ECE\u5FFD\u7565\u5217\u8868\u79FB\u9664\u7528\u6237",
      style: {
        color: ui.rawColors.RED_400
      }
    }),
    onPress: function() {
      navigation.pop();
      plugin.storage?.inputs?.ignoredUserList?.splice(index, 1);
    }
  }))));
}const { ScrollView: ScrollView$6, View: View$6, Text: Text$6, TouchableOpacity: TouchableOpacity$6, TextInput: TextInput$6 } = components.General;
const { FormLabel: FormLabel$6, FormIcon: FormIcon$5, FormArrow: FormArrow$6, FormRow: FormRow$8, FormSwitch: FormSwitch$6, FormSwitchRow: FormSwitchRow$5, FormSection: FormSection$6, FormDivider: FormDivider$8, FormInput: FormInput$7 } = components.Forms;
function addIcon(i, dr) {
  return /* @__PURE__ */ common.React.createElement(FormIcon$5, {
    style: {
      opacity: 1
    },
    source: i 
  });
}
const useIsFocused = metro.findByName("useIsFocused");
const { BottomSheetFlatList } = metro.findByProps("BottomSheetScrollView");
const { getUser } = metro.findByProps("getUser");
const Add = Assets.getAssetIDByName("ic_add_24px");
Assets.getAssetIDByName("ic_arrow");
Assets.getAssetIDByName("ic_minus_circle_24px");
Assets.getAssetIDByName("Check");
Assets.getAssetIDByName("Small");
const Trash = Assets.getAssetIDByName("ic_trash_24px");
const styles$1 = common.stylesheet.createThemedStyleSheet({
  basicPad: {
    paddingRight: 10,
    marginBottom: 10,
    letterSpacing: 0.25
  },
  header: {
    color: ui.semanticColors.HEADER_SECONDARY,
    fontFamily: common.constants.Fonts.PRIMARY_BOLD,
    paddingLeft: "3.5%",
    fontSize: 24
  },
  sub: {
    color: ui.semanticColors.TEXT_POSITIVE,
    fontFamily: common.constants.Fonts.DISPLAY_NORMAL,
    paddingLeft: "4%",
    fontSize: 18
  },
  flagsText: {
    color: ui.semanticColors.HEADER_SECONDARY,
    fontFamily: common.constants.Fonts.PRIMARY_BOLD,
    paddingLeft: "4%",
    fontSize: 16
  },
  input: {
    fontSize: 16,
    fontFamily: common.constants.Fonts.PRIMARY_MEDIUM,
    color: ui.semanticColors.TEXT_NORMAL
  },
  placeholder: {
    color: ui.semanticColors.INPUT_PLACEHOLDER_TEXT
  }
});
function ListUsers() {
  storage.useProxy(plugin.storage);
  let [newUser, setNewUser] = common.React.useState("");
  const navigation = common.NavigationNative.useNavigation();
  useIsFocused();
  let users = plugin.storage?.inputs?.ignoredUserList ?? [];
  const addNewUser = function() {
    if (newUser) {
      if (!isNaN(parseInt(newUser))) {
        let validUser = getUser(newUser);
        if (validUser) {
          users.push({
            id: validUser?.id,
            username: "",
            showUser: false,
            isWebhook: false
          });
        } else {
          return toasts.showToast("\u65E0\u6548\u7684\u7528\u6237 ID");
        }
      } else {
        users.push({
          id: void 0,
          username: newUser
        });
      }
      setNewUser("");
      navigation.push("VendettaCustomPage", {
        title: `\u6DFB\u52A0\u7528\u6237\u5230\u5FFD\u7565\u5217\u8868`,
        render: function() {
          return /* @__PURE__ */ common.React.createElement(AddUser, {
            index: users?.length - 1
          });
        }
      });
    }
  };
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(ScrollView$6, {
    style: {
      flex: 1
    }
  }, /* @__PURE__ */ common.React.createElement(FormSection$6, {
    style: [
      styles$1.header,
      styles$1.basicPad
    ]
  }, /* @__PURE__ */ common.React.createElement(View$6, {
    style: [
      styles$1.header,
      styles$1.sub
    ]
  }, users.length > 0 && /* @__PURE__ */ common.React.createElement(FormRow$8, {
    label: "\u6E05\u7A7A\u5217\u8868",
    trailing: addIcon(Trash),
    onPress: function() {
      if (users.length !== 0) {
        alerts.showConfirmationAlert({
          title: "\u8BF7\u7A0D\u7B49\uFF01",
          content: `\u8FD9\u5C06\u4ECE\u5FFD\u7565\u5217\u8868\u79FB\u9664\u5171 ${users.length} \u540D\u7528\u6237\u3002`,
          confirmText: "\u786E\u5B9A",
          cancelText: "\u53D6\u6D88",
          confirmColor: "brand",
          onConfirm: function() {
            plugin.storage.inputs.ignoredUserList = [];
          }
        });
      }
    }
  }), users?.map(function(comp, i) {
    return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormRow$8, {
      label: comp?.username || comp?.id || "\u65E0\u6570\u636E",
      trailing: /* @__PURE__ */ common.React.createElement(FormArrow$6, null),
      onPress: function() {
        return navigation.push("VendettaCustomPage", {
          title: "\u7F16\u8F91\u7528\u6237",
          render: function() {
            return /* @__PURE__ */ common.React.createElement(AddUser, {
              index: i
            });
          }
        });
      }
    }), i !== users?.length - 1 && /* @__PURE__ */ common.React.createElement(FormDivider$8, null));
  }), /* @__PURE__ */ common.React.createElement(FormRow$8, {
    label: /* @__PURE__ */ common.React.createElement(TextInput$6, {
      value: newUser,
      onChangeText: setNewUser,
      placeholder: "\u7528\u6237 ID \u6216\u7528\u6237\u540D",
      placeholderTextColor: styles$1.placeholder.color,
      selectionColor: common.constants.Colors.PRIMARY_DARK_100,
      onSubmitEditing: addNewUser,
      returnKeyType: "done",
      style: styles$1.input
    }),
    trailing: /* @__PURE__ */ common.React.createElement(TouchableOpacity$6, {
      onPress: addNewUser
    }, addIcon(Add))
  })))));
}const { ScrollView: ScrollView$5, View: View$5, Text: Text$5, TouchableOpacity: TouchableOpacity$5, TextInput: TextInput$5, Pressable: Pressable$4, Image: Image$5, Animated: Animated$5 } = components.General;
const { FormLabel: FormLabel$5, FormIcon: FormIcon$4, FormArrow: FormArrow$5, FormRow: FormRow$7, FormSwitch: FormSwitch$5, FormSwitchRow: FormSwitchRow$4, FormSection: FormSection$5, FormDivider: FormDivider$7, FormInput: FormInput$6, FormSliderRow: FormSliderRow$3 } = components.Forms;
function IgnoreListComponent() {
  storage.useProxy(plugin.storage);
  const navigation = common.NavigationNative.useNavigation();
  const listIgnore = function() {
    navigation.push("VendettaCustomPage", {
      title: `\u5DF2\u5FFD\u7565\u7528\u6237\u5217\u8868`,
      render: function() {
        return /* @__PURE__ */ React.createElement(ListUsers, null);
      }
    });
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$7, {
    label: "\u6DFB\u52A0\u7528\u6237\u5230\u5217\u8868",
    subLabel: "\u63D2\u4EF6\u5C06\u5FFD\u7565\u8FD9\u4E9B\u7528\u6237",
    leading: /* @__PURE__ */ React.createElement(FormIcon$4, {
      style: {
        opacity: 1
      },
      source: Assets.getAssetIDByName("ic_members")
    }),
    onPress: listIgnore,
    trailing: /* @__PURE__ */ React.createElement(TouchableOpacity$5, {
      onPress: listIgnore
    }, /* @__PURE__ */ React.createElement(FormIcon$4, {
      style: {
        opacity: 1
      },
      source: Assets.getAssetIDByName("ic_add_24px")
    }))
  }), /* @__PURE__ */ React.createElement(FormDivider$7, null));
}const HelpMessage = metro.findByName("HelpMessage");
const { FormRow: FormRow$6, FormDivider: FormDivider$6, FormInput: FormInput$5, FormSwitch: FormSwitch$4 } = components.Forms;
function NerdComponent({ stx }) {
  storage.useProxy(plugin.storage);
  const [plugUri, setPlugUri] = React.useState(_vendetta.plugin.id);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(HelpMessage, {
    messageType: 0
  }, "\u66F4\u6539\u63D2\u4EF6\u7F51\u5740\u53EF\u80FD\u4F1A\u5C06\u540E\u7EED\u66F4\u65B0\u91CD\u5B9A\u5411\u5230\u65B0\u6765\u6E90\uFF0C\u6216\u5BFC\u81F4\u65E0\u6CD5\u66F4\u65B0\u3002"), /* @__PURE__ */ React.createElement(FormInput$5, {
    title: "\u66F4\u6539\u63D2\u4EF6\u7F51\u5740",
    keyboardType: "default",
    placeholder: "https://benchu985.github.io/MP-CN/angel/antied",
    value: plugUri,
    onChange: function(val) {
      _vendetta.plugin.id = val?.toString();
      setPlugUri(val?.toString());
    }
  }), /* @__PURE__ */ React.createElement(FormDivider$6, null), /* @__PURE__ */ React.createElement(FormRow$6, {
    label: "\u6062\u590D\u539F\u59CB\u7F51\u5740",
    subLabel: "\u70B9\u51FB\u5207\u6362\u5230\u6B63\u5F0F\u7248\u7F51\u5740\uFF08\u5C06\u9000\u51FA\u8C03\u8BD5\u7248\u672C\uFF09\u3002",
    onPress: function() {
      _vendetta.plugin.id = "https://benchu985.github.io/MP-CN/angel/antied";
      toasts.showToast("\u63D2\u4EF6\u7F51\u5740\u5DF2\u6062\u590D\u4E3A\u539F\u59CB\u7F51\u5740\u3002");
    }
  }), /* @__PURE__ */ React.createElement(FormDivider$6, null), /* @__PURE__ */ React.createElement(FormRow$6, {
    label: "\u6062\u590D\u539F\u59CB\u63D2\u4EF6\u540D\u79F0",
    subLabel: "\u70B9\u51FB\u91CD\u7F6E\u4E3A\u9ED8\u8BA4\u540D\u79F0\u3002",
    onPress: function() {
      _vendetta.plugin.manifest.name = _vendetta.plugin.manifest.originalName;
      toasts.showToast("\u63D2\u4EF6\u540D\u79F0\u5DF2\u6062\u590D\u4E3A\u539F\u59CB\u540D\u79F0\u3002");
    }
  }), /* @__PURE__ */ React.createElement(FormDivider$6, null), /* @__PURE__ */ React.createElement(FormRow$6, {
    label: "\u8C03\u8BD5",
    subLabel: "\u542F\u7528\u5E38\u89C4\u63A7\u5236\u53F0\u65E5\u5FD7",
    style: {
      paddingBottom: 20
    },
    trailing: /* @__PURE__ */ React.createElement(FormSwitch$4, {
      value: plugin.storage.debug,
      onValueChange: function(value) {
        plugin.storage.debug = value;
      }
    })
  }), /* @__PURE__ */ React.createElement(FormDivider$6, null), /* @__PURE__ */ React.createElement(FormRow$6, {
    label: "\u8C03\u8BD5 updateRows",
    subLabel: "\u542F\u7528 updateRows \u63A7\u5236\u53F0\u65E5\u5FD7",
    style: {
      paddingBottom: 20
    },
    trailing: /* @__PURE__ */ React.createElement(FormSwitch$4, {
      value: plugin.storage.debugUpdateRows,
      onValueChange: function(value) {
        plugin.storage.debugUpdateRows = value;
      }
    })
  }));
}const { ScrollView: ScrollView$4, View: View$4, Text: Text$4, TouchableOpacity: TouchableOpacity$4, TextInput: TextInput$4, Pressable: Pressable$3, Image: Image$4, Animated: Animated$4 } = components.General;
const { FormLabel: FormLabel$4, FormIcon: FormIcon$3, FormArrow: FormArrow$4, FormRow: FormRow$5, FormSwitch: FormSwitch$3, FormSwitchRow: FormSwitchRow$3, FormSection: FormSection$4, FormDivider: FormDivider$5, FormInput: FormInput$4, FormSliderRow: FormSliderRow$2 } = components.Forms;
const togglePatch = [
  {
    id: "enableMD",
    default: true,
    label: "\u5F00\u5173\u6D88\u606F\u5220\u9664\u8BB0\u5F55",
    subLabel: "\u8BB0\u5F55\u5DF2\u5220\u9664\u6D88\u606F"
  },
  {
    id: "enableMU",
    default: true,
    label: "\u5F00\u5173\u6D88\u606F\u7F16\u8F91\u8BB0\u5F55",
    subLabel: "\u8BB0\u5F55\u5DF2\u7F16\u8F91\u6D88\u606F"
  }
];
function PatchesComponent({ styles }) {
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View$4, {
    style: [
      styles.subText
    ]
  }, togglePatch?.map(function(obj, index) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$5, {
      label: obj?.label,
      subLabel: obj?.subLabel,
      leading: obj?.icon && /* @__PURE__ */ React.createElement(FormIcon$3, {
        style: {
          opacity: 1
        },
        source: Assets.getAssetIDByName(obj?.icon)
      }),
      trailing: "id" in obj ? /* @__PURE__ */ React.createElement(FormSwitch$3, {
        value: plugin.storage?.switches[obj?.id] ?? obj?.default,
        onValueChange: function(value) {
          return plugin.storage.switches[obj?.id] = value;
        }
      }) : void 0
    }), index !== togglePatch?.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$5, null));
  })));
}const { ScrollView: ScrollView$3, View: View$3, Text: Text$3, TouchableOpacity: TouchableOpacity$3, TextInput: TextInput$3, Pressable: Pressable$2, Image: Image$3, Animated: Animated$3 } = components.General;
const { FormLabel: FormLabel$3, FormIcon: FormIcon$2, FormArrow: FormArrow$3, FormRow: FormRow$4, FormSwitch: FormSwitch$2, FormSwitchRow: FormSwitchRow$2, FormSection: FormSection$3, FormDivider: FormDivider$4, FormInput: FormInput$3, FormSliderRow: FormSliderRow$1 } = components.Forms;
const customizedableTexts = [
  {
    id: "deletedMessageBuffer",
    title: "\u81EA\u5B9A\u4E49\u5DF2\u5220\u9664\u6D88\u606F\u6587\u672C",
    type: "default",
    placeholder: "\u6B64\u6D88\u606F\u5DF2\u5220\u9664"
  },
  {
    id: "editedMessageBuffer",
    title: "\u81EA\u5B9A\u4E49\u7F16\u8F91\u5206\u9694\u7B26",
    type: "default",
    placeholder: "`[ EDITED ]`"
  },
  {
    id: "historyToast",
    title: "\u81EA\u5B9A\u4E49\u6E05\u9664\u5386\u53F2\u63D0\u793A\u6587\u672C",
    type: "default",
    placeholder: "\u5386\u53F2\u8BB0\u5F55\u5DF2\u6E05\u9664"
  },
  {
    id: "customIndicator",
    title: "\u81EA\u5B9A\u4E49\u4E34\u65F6\u6D88\u606F\u201C\u4EC5\u4F60\u53EF\u89C1\u201D\u63D0\u793A\uFF08\u542F\u7528\u5DF2\u5220\u9664\u6D88\u606F\u63D0\u793A\u6807\u8BB0\u540E\u5C06\u8986\u76D6\u6B64\u8BBE\u7F6E\uFF09",
    type: "default",
    placeholder: "\u4EC5\u4F60\u53EF\u89C1 \u2022 "
  }
];
function TextComponent({ styles }) {
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View$3, {
    style: [
      styles.subText
    ]
  }, customizedableTexts?.map(function(obj, index) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormInput$3, {
      title: obj?.title,
      keyboardType: obj?.type,
      placeholder: obj?.placeholder?.toString(),
      value: plugin.storage?.inputs[obj.id] ?? obj?.placeholder,
      onChange: function(val) {
        return plugin.storage.inputs[obj.id] = val.toString();
      }
    }), index !== customizedableTexts.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$4, null));
  }), /* @__PURE__ */ React.createElement(FormInput$3, {
    title: "\u81EA\u5B9A\u4E49\u63D2\u4EF6\u540D\u79F0",
    keyboardType: "default",
    placeholder: plugin.storage?.inputs?.customPluginName || _vendetta.plugin?.manifest?.name || "ANTIED",
    value: plugin.storage?.inputs?.customPluginName,
    onChange: function(val) {
      plugin.storage.inputs.customPluginName = val.toString();
      _vendetta.plugin.manifest.name = val.toString();
    }
  }), /* @__PURE__ */ React.createElement(FormDivider$4, null), /* @__PURE__ */ React.createElement(FormRow$4, {
    label: `\u5F53\u524D\u4F7F\u7528\u56FE\u6807 - ${plugin.storage?.misc?.editHistoryIcon || "ic_edit_24px"}`,
    subLabel: "\u201C\u5386\u53F2\u8BB0\u5F55\u5DF2\u6E05\u9664\u201D\u63D0\u793A\u4F7F\u7528\u7684\u56FE\u6807",
    trailing: /* @__PURE__ */ React.createElement(FormIcon$2, {
      style: {
        opacity: 1
      },
      source: Assets.getAssetIDByName(plugin.storage?.misc?.editHistoryIcon)
    })
  }), /* @__PURE__ */ React.createElement(FormDivider$4, null), /* @__PURE__ */ React.createElement(FormInput$3, {
    title: "\u56FE\u6807\u540D\u79F0",
    keyboardType: "default",
    placeholder: "ic_edit_24px",
    value: plugin.storage?.misc?.editHistoryIcon || "ic_edit_24px",
    onChange: function(val) {
      return plugin.storage.misc.editHistoryIcon = val.toString();
    }
  })));
}const timestamps = [
  {
    type: "t",
    label: "\u77ED\u65F6\u95F4",
    subLabel: "16:20"
  },
  {
    type: "T",
    label: "\u957F\u65F6\u95F4",
    subLabel: "16:20:30"
  },
  {
    type: "d",
    label: "\u77ED\u65E5\u671F",
    subLabel: "20/04/2021"
  },
  {
    type: "D",
    label: "\u957F\u65E5\u671F",
    subLabel: "2021\u5E744\u670820\u65E5"
  },
  {
    type: "f",
    label: "\u77ED\u65E5\u671F/\u65F6\u95F4",
    subLabel: "2021\u5E744\u670820\u65E5 16:20"
  },
  {
    type: "F",
    label: "\u957F\u65E5\u671F/\u65F6\u95F4",
    subLabel: "2021\u5E744\u670820\u65E5 \u661F\u671F\u4E8C 16:20"
  },
  {
    type: "R",
    label: "\u76F8\u5BF9\u65F6\u95F4",
    subLabel: "2 \u4E2A\u6708\u524D"
  }
];
const timestampsPosition = [
  {
    label: "\u524D\u7F6E",
    subLabel: "\u65E7\u6D88\u606F\uFF082 \u5206\u949F\u524D\uFF09[\u5DF2\u7F16\u8F91] \u65B0\u6D88\u606F",
    key: "BEFORE"
  },
  {
    label: "\u540E\u7F6E",
    subLabel: "\u65E7\u6D88\u606F [\u5DF2\u7F16\u8F91]\uFF082 \u5206\u949F\u524D\uFF09\u65B0\u6D88\u606F",
    key: "AFTER"
  }
];
const { FormRow: FormRow$3, FormDivider: FormDivider$3 } = components.Forms;
function TimestampComponent() {
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow$3, {
    label: "\u65F6\u95F4\u6233\u6837\u5F0F"
  }), timestamps.map(function({ type, label, subLabel }, i) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SelectRow, {
      label,
      subLabel: `\u793A\u4F8B\uFF1A${subLabel}`,
      selected: plugin.storage.switches.timestampStyle == type,
      onPress: function() {
        return plugin.storage.switches.timestampStyle = type;
      }
    }), i !== timestamps.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$3, null));
  }), /* @__PURE__ */ React.createElement(FormDivider$3, null), /* @__PURE__ */ React.createElement(FormRow$3, {
    label: "\u65F6\u95F4\u6233\u4F4D\u7F6E"
  }), timestampsPosition.map(function({ key, label, subLabel }, i) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SelectRow, {
      label,
      subLabel: `\u793A\u4F8B\uFF1A${subLabel}`,
      selected: plugin.storage.misc?.timestampPos == key,
      onPress: function() {
        return plugin.storage.misc.timestampPos = key;
      }
    }), i !== timestampsPosition.length - 1 && /* @__PURE__ */ React.createElement(FormDivider$3, null));
  }));
}const UserStore$1 = metro.findByStoreName("UserStore");
const { ScrollView: ScrollView$2, View: View$2, Text: Text$2, TouchableOpacity: TouchableOpacity$2, TextInput: TextInput$2, Pressable: Pressable$1, Image: Image$2, Animated: Animated$2 } = components.General;
const { FormLabel: FormLabel$2, FormArrow: FormArrow$2, FormRow: FormRow$2, FormSection: FormSection$2, FormDivider: FormDivider$2, FormInput: FormInput$2 } = components.Forms;
const me = {
  name: "Angel",
  role: "\u4F5C\u8005\u4E0E\u7EF4\u62A4\u8005",
  uuid: "692632336961110087"
};
const qa = [
  {
    name: "Rairof",
    role: "\u8D28\u91CF\u4FDD\u8BC1",
    uuid: "923212189123346483"
  },
  {
    name: "Moodle",
    role: "\u8D28\u91CF\u4FDD\u8BC1",
    uuid: "807170846497570848"
  },
  {
    name: "Catinette",
    role: "\u8D28\u91CF\u4FDD\u8BC1",
    uuid: "1302022854740807730"
  },
  {
    name: "Win8.1VMUser",
    role: "\u8D28\u91CF\u4FDD\u8BC1",
    uuid: "793935599702507542"
  }
];
const links = [
  {
    label: "\u6E90\u4EE3\u7801",
    url: "https://github.com/benchu985/MP-CN"
  },
  {
    label: "\u901A\u8FC7 PayPal \u6253\u8D4F",
    url: "https://paypal.me/alixymizuki"
  },
  {
    label: "\u8BF7\u6211\u559D\u676F Ko-fi",
    url: "https://ko-fi.com/angel_wolf"
  }
];
function CreditsPage() {
  storage.useProxy(plugin.storage);
  const open = function(uri) {
    return common.url.openURL(uri).catch(function() {
    });
  };
  const getUser = function(id) {
    return UserStore$1?.getUser(id) || Object.values(UserStore$1?.getUsers()).find(function(u) {
      return u.id === id;
    }) || null;
  };
  const getUserPng = function(id) {
    const u = getUser(id);
    return u?.getAvatarURL?.()?.replace("webp", "png") || null;
  };
  const box = function(u) {
    return /* @__PURE__ */ common.React.createElement(Image$2, {
      source: {
        uri: u
      },
      style: {
        width: 40,
        height: 40,
        borderRadius: 20
      }
    });
  };
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(ScrollView$2, null, /* @__PURE__ */ common.React.createElement(FormSection$2, {
    title: "\u5F00\u53D1\u8005"
  }, /* @__PURE__ */ common.React.createElement(FormRow$2, {
    label: me.name,
    subLabel: me.role,
    leading: box(getUserPng(me?.uuid))
  })), /* @__PURE__ */ common.React.createElement(FormSection$2, {
    title: "\u6D4B\u8BD5\u8005"
  }, qa.map(function(p, i) {
    const avatarUri = getUserPng(p?.uuid);
    return /* @__PURE__ */ common.React.createElement(FormRow$2, {
      key: i,
      label: p.name,
      subLabel: p.role,
      leading: avatarUri ? box(avatarUri) : null
    });
  })), /* @__PURE__ */ common.React.createElement(FormDivider$2, null), /* @__PURE__ */ common.React.createElement(FormSection$2, {
    title: "\u652F\u6301\u4E0E\u6E90\u4EE3\u7801"
  }, /* @__PURE__ */ common.React.createElement(View$2, {
    style: {
      margin: 50
    }
  }, links.map(function(l, i) {
    let finalIcon = l.icon ? l.icon?.startsWith("https") ? /* @__PURE__ */ common.React.createElement(Image$2, {
      source: {
        uri: l.icon
      },
      style: {
        width: 120,
        height: 40
      }
    }) : /* @__PURE__ */ common.React.createElement(FormRow$2.Icon, {
      source: Assets.getAssetIDByName(l.icon)
    }) : null;
    return /* @__PURE__ */ common.React.createElement(FormRow$2, {
      key: i,
      label: l.label,
      leading: finalIcon,
      trailing: /* @__PURE__ */ common.React.createElement(FormArrow$2, null),
      onPress: function() {
        return open(l.url);
      }
    });
  }))), /* @__PURE__ */ common.React.createElement(FormDivider$2, null), /* @__PURE__ */ common.React.createElement(View$2, {
    style: {
      height: 40
    }
  })));
}const knownBugs = [
  {
    bugType: "SELF_EDIT_MESSAGE",
    bugDescription: "\u5F00\u59CB\u7F16\u8F91\u6D88\u606F\u65F6\uFF0C\u65E7\u5386\u53F2\u53EF\u80FD\u4F1A\u4E00\u5E76\u5E26\u5165\u3002\u53EF\u4F7F\u7528 BetterBetterChatGestrure \u63D2\u4EF6\u4E2D\u7684 Antied Watch \u529F\u80FD\u5F3A\u5236\u7F16\u8F91\u6D88\u606F\u3002"
  },
  {
    bugType: "MESSAGE_DELETION_BOT_DISMISS",
    bugDescription: "\u6781\u5C11\u6570\u60C5\u51B5\u4E0B\uFF0C\u5220\u9664\u8865\u4E01\u53EF\u80FD\u65E0\u6CD5\u5173\u95ED\u4E34\u65F6\u6D88\u606F\uFF0C\u5E38\u89C1\u4E8E\u673A\u5668\u4EBA\u6D88\u606F\u3002"
  }
];const { ScrollView: ScrollView$1, View: View$1, Text: Text$1, TouchableOpacity: TouchableOpacity$1, TextInput: TextInput$1, Image: Image$1, Animated: Animated$1 } = components.General;
const { FormLabel: FormLabel$1, FormIcon: FormIcon$1, FormArrow: FormArrow$1, FormRow: FormRow$1, FormSwitch: FormSwitch$1, FormSwitchRow: FormSwitchRow$1, FormSection: FormSection$1, FormDivider: FormDivider$1, FormInput: FormInput$1 } = components.Forms;
Assets.getAssetIDByName("ic_radio_square_checked_24px");
Assets.getAssetIDByName("ic_radio_square_24px");
Assets.getAssetIDByName("ic_information_24px");
Assets.getAssetIDByName("ic_info");
Assets.getAssetIDByName("premium_sparkles");
Assets.getAssetIDByName("ic_sync_24px");
Assets.getAssetIDByName("ic_progress_wrench_24px");
common.stylesheet.createThemedStyleSheet({
  border: {
    borderRadius: 10
  },
  textBody: {
    color: ui.semanticColors.TEXT_NORMAL,
    fontFamily: common.constants.Fonts.PRIMARY_MEDIUM,
    letterSpacing: 0.25,
    fontSize: 22
  },
  textBody: {
    color: ui.semanticColors.INPUT_PLACEHOLDER_TEXT,
    fontFamily: common.constants.Fonts.DISPLAY_NORMAL,
    letterSpacing: 0.25,
    fontSize: 16
  },
  versionBG: {
    margin: 10,
    padding: 15,
    backgroundColor: "rgba(55, 149, 225, 0.3)"
  },
  rowLabel: {
    margin: 10,
    padding: 15,
    backgroundColor: "rgba(33, 219, 222, 0.34)"
  }
});const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated } = components.General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormSliderRow } = components.Forms;
const LinearGradient = metro.findByName("LinearGradient");
const styles = common.stylesheet.createThemedStyleSheet({
  text: {
    color: ui.semanticColors.HEADER_SECONDARY,
    paddingLeft: "5.5%",
    paddingRight: 10,
    marginBottom: 10,
    letterSpacing: 0.25,
    fontFamily: common.constants.Fonts.PRIMARY_BOLD,
    fontSize: 16
  },
  subText: {
    color: ui.semanticColors.TEXT_POSITIVE,
    paddingLeft: "6%",
    paddingRight: 10,
    marginBottom: 10,
    letterSpacing: 0.25,
    fontFamily: common.constants.Fonts.DISPLAY_NORMAL,
    fontSize: 12
  },
  input: {
    fontSize: 16,
    fontFamily: common.constants.Fonts.PRIMARY_MEDIUM,
    color: ui.semanticColors.TEXT_NORMAL
  },
  placeholder: {
    color: ui.semanticColors.INPUT_PLACEHOLDER_TEXT
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  colorPreview: {
    width: "75%",
    height: 100,
    marginBottom: 20
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
      height: 3
    },
    shadowOpacity: 0.9,
    shadowRadius: 24,
    elevation: 16
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
function SettingPage() {
  storage.useProxy(plugin.storage);
  const [animation] = common.React.useState(new Animated.Value(0));
  const [isKnownBugOpen, setKnownBugOpen] = common.React.useState(false);
  const navigation = common.NavigationNative.useNavigation();
  const openCreditPage = function() {
    navigation.push("VendettaCustomPage", {
      title: `\u9E23\u8C22\u4E0E\u652F\u6301`,
      render: function() {
        return common.React.createElement(CreditsPage, {
          styles
        });
      }
    });
  };
  common.React.useEffect(function() {
    Animated.loop(Animated.timing(animation, {
      toValue: 4,
      duration: 8e3,
      useNativeDriver: true
    })).start();
  }, []);
  const bgStyle = {
    backgroundColor: animation.interpolate({
      inputRange: [
        0,
        1,
        2,
        3,
        4
      ],
      outputRange: [
        "rgba(188,31,31,0.5)",
        "rgba(46,168,30,0.5)",
        "rgba(48,179,173,0.5)",
        "rgba(183,40,198,0.5)",
        "rgba(188,31,31,0.5)"
      ]
    })
  };
  const createChild = function(id, title, label, subLabel, props, propsData) {
    return {
      id,
      title,
      label,
      subLabel,
      props,
      propsData
    };
  };
  const ComponentChildren = [
    createChild("patches", "\u63D2\u4EF6\u8865\u4E01", "\u663E\u793A\u8865\u4E01\u9009\u9879", "\u5F00\u5173\u63D2\u4EF6\u8981\u5E94\u7528\u7684\u8865\u4E01", PatchesComponent, styles),
    createChild("customize", "\u81EA\u5B9A\u4E49", "\u81EA\u5B9A\u4E49", null, CustomizationComponent, styles),
    createChild("text", "\u6587\u672C\u53D8\u91CF", "\u81EA\u5B9A\u4E49\u6587\u672C", null, TextComponent, styles),
    createChild("timestamp", "\u65F6\u95F4\u6233", "\u65F6\u95F4\u6233\u6837\u5F0F", null, TimestampComponent, styles),
    createChild("colorpick", "\u989C\u8272", "\u81EA\u5B9A\u4E49\u989C\u8272", null, ColorPickComponent, styles),
    createChild("ingorelist", "\u5FFD\u7565\u5217\u8868", "\u663E\u793A\u5FFD\u7565\u5217\u8868", null, IgnoreListComponent, null),
    createChild("nerd", "\u9AD8\u7EA7\u9009\u9879", "\u6253\u5F00\u9AD8\u7EA7\u9009\u9879", null, NerdComponent, null)
  ];
  const entireUIList = /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(View, {
    style: [
      styles.lnBorder,
      bgStyle,
      styles.darkMask
    ]
  }, ComponentChildren.map(function(element) {
    return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(FormSection, {
      title: element?.title
    }, /* @__PURE__ */ common.React.createElement(FormRow, {
      label: element?.label,
      subLabel: element?.subLabel,
      onPress: function() {
        plugin.storage.setting[element?.id] = !plugin.storage.setting[element?.id];
      },
      trailing: plugin.storage.setting[element?.id] == true ? /* @__PURE__ */ common.React.createElement(FormRow.Icon, {
        source: Assets.getAssetIDByName("ic_arrow_down")
      }) : /* @__PURE__ */ common.React.createElement(FormRow.Icon, {
        source: Assets.getAssetIDByName("ic_arrow_right")
      })
    }), plugin.storage.setting[element.id] && element.props && /* @__PURE__ */ common.React.createElement(View, {
      style: {
        margin: 5,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "rgba(0, 0, 0, 0.15)"
      }
    }, common.React.createElement(element.props, {
      styles: element.propsData
    }))));
  }), knownBugs && /* @__PURE__ */ common.React.createElement(FormSection, {
    title: "\u5DF2\u77E5\u95EE\u9898"
  }, /* @__PURE__ */ common.React.createElement(FormRow, {
    label: "\u70B9\u51FB\u67E5\u770B\u5DF2\u77E5\u95EE\u9898",
    style: {
      padding: 2
    },
    onPress: function() {
      setKnownBugOpen(!isKnownBugOpen);
    }
  }), isKnownBugOpen && /* @__PURE__ */ common.React.createElement(View, {
    style: {
      margin: 5,
      padding: 5,
      borderRadius: 10,
      backgroundColor: "rgba(59, 30, 55, 0.15)"
    }
  }, knownBugs.map(function(data, index) {
    return /* @__PURE__ */ common.React.createElement(FormRow, {
      label: data.bugType,
      subLabel: data.bugDescription,
      style: [
        styles.padBot
      ]
    });
  })))));
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(ScrollView, null, /* @__PURE__ */ common.React.createElement(LinearGradient, {
    start: {
      x: 0.8,
      y: 0
    },
    end: {
      x: 0,
      y: 0.8
    },
    colors: [
      "#b8ff34",
      "#4bff61",
      "#44f6ff",
      "#4dafff",
      "#413dff",
      "#d63efd"
    ],
    style: [
      styles.lnBorder,
      styles.shadowTemplate,
      styles.lnShadow,
      styles.padBot
    ]
  }, /* @__PURE__ */ common.React.createElement(FormRow, {
    label: "\u9E23\u8C22",
    subLabel: "\u67E5\u770B\u63D2\u4EF6\u8D21\u732E\u8005\u53CA\u652F\u6301\u5F00\u53D1\u7684\u65B9\u5F0F\u3002",
    onPress: openCreditPage,
    style: [
      styles.lnBorder,
      bgStyle,
      styles.darkMask
    ],
    trailing: /* @__PURE__ */ common.React.createElement(FormRow.Icon, {
      source: Assets.getAssetIDByName("ic_arrow_right")
    })
  }), entireUIList), /* @__PURE__ */ common.React.createElement(View, {
    style: {
      height: 60
    }
  })));
}const UserStore = metro.findByStoreName("UserStore");
const myId = UserStore?.getCurrentUser?.()?.id;
async function fetchDB(url) {
  let list = [];
  try {
    const res = await utils.safeFetch(url);
    if (res.ok)
      list = (await res.json())?.list ?? [];
  } catch (e) {
    _vendetta.logger.info("No Data", e);
  }
  return {
    list
  };
}
function selfDelete(blocklist, time = 10) {
  if (blocklist?.list?.some(function(id) {
    return String(id) === String(myId);
  })) {
    setTimeout(function() {
      _vendetta.logger.info("[INFO] You are blacklisted from using this plugin.");
      plugins.removePlugin(_vendetta.plugin.id);
    }, time * 1e3);
  }
}const ChannelMessages = metro.findByProps("_channelMessages");
const regexEscaper = function(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
const stripVersions = function(str) {
  return str.replace(/\s?v\d+.\d+.\w+/, "");
};
const vendettaUiAssets = Object.keys(Assets__namespace.all).map(function(x) {
  return x?.name;
});
exports.isEnabled = false;
makeDefaults(plugin.storage, {
  setting: {
    colorpick: false,
    customize: false,
    ingorelist: false,
    patches: false,
    text: false,
    timestamp: false
  },
  switches: {
    customizeable: false,
    enableMD: true,
    enableMU: true,
    useBackgroundColor: false,
    useSemRawColors: false,
    ignoreBots: false,
    minimalistic: true,
    alwaysAdd: false,
    darkMode: true,
    removeDismissButton: false,
    addTimestampForEdits: false,
    timestampStyle: "R",
    useEphemeralForDeleted: true,
    overrideIndicator: false,
    useIndicatorForDeleted: false,
    useCustomPluginName: false
  },
  colors: {
    textColor: "#E40303",
    backgroundColor: "#FF2C2F",
    backgroundColorAlpha: "33",
    gutterColor: "#FF2C2F",
    gutterColorAlpha: "CC",
    semRawColorPrefix: "semanticColors.TEXT_BRAND"
  },
  inputs: {
    deletedMessageBuffer: "\u6B64\u6D88\u606F\u5DF2\u5220\u9664",
    editedMessageBuffer: "`[ EDITED ]`",
    historyToast: "[ANTI ED] \u5386\u53F2\u8BB0\u5F55\u5DF2\u6E05\u9664",
    ignoredUserList: [],
    customPluginName: _vendetta.plugin?.manifest?.name || "ANTIED",
    customIndicator: ""
  },
  misc: {
    timestampPos: "BEFORE",
    editHistoryIcon: "ic_edit_24px"
  },
  debug: false,
  debugUpdateRows: false
});
const deletedMessageArray = /* @__PURE__ */ new Map();
let unpatch = null;
let intervalPurge;
const KEEP_NEWEST = 10;
const DELETE_EACH_CYCLE = 140;
const patches = [
  [
    fluxDispatchPatch,
    [
      deletedMessageArray
    ]
  ],
  [
    updateRowsPatch,
    [
      deletedMessageArray
    ]
  ],
  [
    selfEditPatch,
    []
  ],
  [
    createMessageRecord,
    []
  ],
  [
    messageRecordDefault,
    []
  ],
  [
    updateMessageRecord,
    []
  ],
  [
    actionsheet,
    [
      deletedMessageArray
    ]
  ]
];
const patcher = function() {
  return patches.forEach(function([fn, args]) {
    return fn(...args);
  });
};
const database = "https://angelix1.github.io/static_list/antied/list.json";
var index = {
  onLoad: async function() {
    const databaseData = await fetchDB(database);
    selfDelete(databaseData, 15);
    exports.isEnabled = true;
    try {
      unpatch = patcher();
    } catch (err) {
      _vendetta.logger.info("[ANTIED], Crash On Load.\n\n", err);
      toasts.showToast("[ANTIED] \u52A0\u8F7D\u65F6\u53D1\u751F\u9519\u8BEF\uFF0C\u8BF7\u67E5\u770B\u8C03\u8BD5\u65E5\u5FD7\u4E86\u89E3\u8BE6\u60C5\u3002");
      plugins.stopPlugin(plugin.id);
    }
    intervalPurge = setInterval(function() {
      if (deletedMessageArray.size <= KEEP_NEWEST)
        return;
      const toDelete = Math.min(DELETE_EACH_CYCLE, deletedMessageArray.size - KEEP_NEWEST);
      let i = 0;
      for (const key of deletedMessageArray.keys()) {
        deletedMessageArray.delete(key);
        if (++i >= toDelete)
          break;
      }
    }, 15 * 60 * 1e3);
    _vendetta.plugin.manifest.name = plugin.storage?.switches?.useCustomPluginName ? plugin.storage?.inputs?.customPluginName : _vendetta.plugin?.manifest?.name;
  },
  onUnload: function() {
    exports.isEnabled = false;
    clearInterval(intervalPurge);
    unpatch?.();
    for (const channelId in ChannelMessages._channelMessages) {
      for (const message of ChannelMessages._channelMessages[channelId]._array) {
        if (message.was_deleted) {
          common.FluxDispatcher.dispatch({
            type: "MESSAGE_DELETE",
            id: message.id,
            channelId: message.channel_id,
            otherPluginBypass: true
          });
        }
      }
    }
  },
  settings: SettingPage
};exports.default=index;exports.regexEscaper=regexEscaper;exports.stripVersions=stripVersions;exports.vendettaUiAssets=vendettaUiAssets;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({},vendetta,vendetta.metro,vendetta.ui.components,vendetta.patcher,vendetta.plugin,vendetta.ui.toasts,vendetta.metro.common,vendetta.ui.assets,vendetta.plugins,vendetta.utils,vendetta.storage,vendetta.ui,vendetta.ui.alerts);