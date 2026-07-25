(() => {
var __antiedBundle = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all2) => {
    for (var name in all2)
      __defProp(target, name, { get: all2[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // angel/antied/index.jsx
  var antied_exports = {};
  __export(antied_exports, {
    default: () => antied_default,
    isEnabled: () => isEnabled,
    regexEscaper: () => regexEscaper,
    stripVersions: () => stripVersions,
    vendettaUiAssets: () => vendettaUiAssets
  });

  // .build/antied-shims/vendetta.js
  var logger = vendetta.logger;
  var plugin = vendetta.plugin;
  var vendetta_default = vendetta;

  // .build/antied-shims/metro.js
  var find = vendetta.metro.find;
  var findByName = vendetta.metro.findByName;
  var findByProps = vendetta.metro.findByProps;
  var findByPropsAll = vendetta.metro.findByPropsAll;
  var findByStoreName = vendetta.metro.findByStoreName;
  var findByTypeName = vendetta.metro.findByTypeName;

  // .build/antied-shims/ui-components.js
  var Forms = vendetta.ui.components.Forms;
  var General = vendetta.ui.components.General;
  var ErrorBoundary = vendetta.ui.components.ErrorBoundary;

  // lib/utility.js
  var { openLazy, hideActionSheet } = findByProps("openLazy", "hideActionSheet");
  function makeDefaults(object, defaults) {
    if (object != void 0) {
      if (defaults != void 0) {
        for (const key of Object.keys(defaults)) {
          if (typeof defaults[key] === "object" && !Array.isArray(defaults[key])) {
            if (typeof object[key] !== "object") object[key] = {};
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
      openLazy(
        new Promise((call) => call({ default: sheet })),
        "ActionSheet",
        props
      );
    } catch (e) {
      logger.error(e.stack);
      showToast(
        "Got error when opening ActionSheet! Please check debug logs"
      );
    }
  }
  var colorConverter = {
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
      const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, "0");
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    }
  };
  var transparentBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mJsrQAAAgwBAJ9P6qYAAAAASUVORK5CYII=";
  var convert = {
    toPercentage: (decimalValue) => {
      decimalValue = Number(decimalValue);
      return decimalValue === 0 ? 0 : decimalValue === 1 ? 100 : Math.round(decimalValue * 100);
    },
    toDecimal: (percentageValue) => {
      percentageValue = Number(percentageValue);
      const clampedPercentage = Math.min(Math.max(percentageValue, 0), 100);
      return clampedPercentage === 0 ? 0 : clampedPercentage === 100 ? 1 : clampedPercentage / 100;
    },
    formatDecimal: (decimalValue) => {
      decimalValue = Number(decimalValue);
      return decimalValue === 0 || decimalValue === 1 ? decimalValue : decimalValue.toFixed(2);
    },
    alphaToHex: (percentageValue) => {
      percentageValue = Number(percentageValue);
      const clampedPercentage = Math.min(Math.max(percentageValue, 0), 100);
      const hexValue = Math.round(clampedPercentage / 100 * 255).toString(16).toUpperCase();
      return hexValue.length === 1 ? "0" + hexValue : hexValue;
    },
    hexAlphaToPercent: (hexAlpha) => {
      const decimalAlpha = parseInt(hexAlpha, 16);
      if (isNaN(decimalAlpha)) {
        return 0;
      }
      return Math.round(decimalAlpha / 255 * 100);
    }
  };

  // .build/antied-shims/patcher.js
  var before = vendetta.patcher.before;
  var after = vendetta.patcher.after;
  var instead = vendetta.patcher.instead;

  // .build/antied-shims/plugin.js
  var storage = vendetta.plugin.storage;
  var id = vendetta.plugin.id;

  // .build/antied-shims/ui-toasts.js
  var showToast2 = vendetta.ui.toasts.showToast;

  // .build/antied-shims/metro-common.js
  var constants = vendetta.metro.common.constants;
  var React2 = vendetta.metro.common.React;
  var ReactNative = vendetta.metro.common.ReactNative;
  var stylesheet = vendetta.metro.common.stylesheet;
  var NavigationNative = vendetta.metro.common.NavigationNative;
  var FluxDispatcher = vendetta.metro.common.FluxDispatcher;
  var i18n = vendetta.metro.common.i18n;
  var url = vendetta.metro.common.url;
  var clipboard = vendetta.metro.common.clipboard;

  // angel/antied/patches/flux_dispatch.js
  var ChannelStore = findByProps("getChannel", "getDMFromUserId");
  var ChannelMessages = findByProps("_channelMessages");
  var MessageStore = findByProps("getMessage", "getMessages");
  var now = () => Date.now();
  var tsStyle = () => {
    const s = storage.switches?.timestampStyle;
    return s && "tTdDfFR".includes(s) ? s : "R";
  };
  var flux_dispatch_default = (deletedMessageArray2) => before("dispatch", FluxDispatcher, (args) => {
    if (isEnabled) {
      try {
        const ev = args[0];
        if (!ev || !ev.type) return;
        const cfg = storage;
        if (cfg.debug) console.log("[ANTIED flux]", ev);
        if (ev.type === "MESSAGE_DELETE") {
          if (!cfg.switches?.enableMD || ev.otherPluginBypass) return;
          const orig = ChannelMessages.get(ev.channelId)?.get(ev.id);
          if (!orig?.author?.id || !orig.author.username) return;
          if (orig?.author?.bot && orig?.flags == 64) return;
          if (!orig.content && !orig.attachments?.length && !orig.embeds?.length) return;
          if (cfg.switches.ignoreBots && orig.author.bot) return;
          if (cfg.inputs?.ignoredUserList?.length) {
            const list = cfg.inputs.ignoredUserList;
            if (list.some((u) => u.id === orig.author.id || u.username === orig.author.username)) return;
          }
          const entry = deletedMessageArray2.get(ev.id);
          if (entry?.stage === 2) return;
          if (entry?.stage === 1) {
            entry.stage = 2;
            return entry.message || args;
          }
          const guildId = ChannelStore.getChannel(orig.channel_id || ev.channelId)?.guild_id;
          ev.message = {
            ...orig,
            content: orig.content,
            channel_id: orig.channel_id || ev.channelId,
            guild_id: guildId,
            was_deleted: true,
            message_reference: orig?.message_reference || orig?.messageReference || null
            // type: 0,
            // timestamp: new Date().toJSON(),
            // state: "SENT",
          };
          if (cfg.switches.useEphemeralForDeleted) ev.message.flags = 64;
          ev.type = "MESSAGE_UPDATE";
          ev.channelId = orig.channel_id || ev.channelId;
          ev.optimistic = false;
          ev.sendMessageOptions = {};
          ev.isPushNotification = false;
          deletedMessageArray2.set(ev.id, { message: args, stage: 1 });
          return args;
        }
        if (ev.type === "MESSAGE_UPDATE") {
          if (!cfg.switches?.enableMU || ev.otherPluginBypass) return;
          const msg = ev.message;
          if (!msg || msg.author?.bot) return;
          const chId = msg.channel_id || ev.channelId;
          const id2 = msg.id || ev.id;
          const orig = MessageStore.getMessage(chId, id2) || ChannelMessages.get(chId)?.get(id2);
          if (!orig?.author?.id || !orig.author.username) return;
          if (!orig.content && !orig.attachments?.length && !orig.embeds?.length) return;
          if (!msg.content || msg.content === orig.content) return;
          if (cfg.inputs?.ignoredUserList?.length) {
            const list = cfg.inputs.ignoredUserList;
            if (list.some((u) => u.id === orig.author.id || u.username === orig.author.username)) return;
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
            guild_id: ChannelStore.getChannel(chId)?.guild_id ?? msg.guild_id,
            edited_timestamp: "invalid_timestamp",
            message_reference: msg?.message_reference || orig?.messageReference || null
          };
          return args;
        }
      } catch (e) {
        showToast2("[ANTIED] FluxDispatcher \u53D1\u751F\u9519\u8BEF\uFF0C\u8BF7\u67E5\u770B\u65E5\u5FD7\u3002");
        console.error("[ANTIED] Flux patch\n", e);
      }
    }
  });

  // angel/antied/patches/self_edit.js
  var Message = findByProps("sendMessage", "startEditMessage");
  var self_edit_default = () => before("startEditMessage", Message, (args) => {
    if (!isEnabled) return;
    let Edited = storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`";
    const DAN = regexEscaper(Edited);
    const regexPattern = new RegExp(`(?:(?:\\s${DAN}(\\s\\(<t:\\d+:[tTdDfFR]>\\))?\\n{2})|(?:(?:\\s\\(<t:\\d+:[tTdDfFR]>\\) ${DAN}\\n{2})))`, "gm");
    const [channelId, messageId, msg] = args;
    const lats = msg.split(regexPattern);
    const f = lats[lats.length - 1];
    args[2] = f;
  });

  // angel/antied/patches/update_rows.js
  var rowsController = findByProps("updateRows", "getConstants") || findByProps("updateRows");
  if (!rowsController) {
    console.error("[ANTIED] rowsController not found \u2013 patch will not be applied");
  }
  var update_rows_default = (deletedMessagesArray) => before("updateRows", rowsController, function(args) {
    if (isEnabled) {
      if (!args?.length) return;
      const raw = args[1];
      if (!raw) return;
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
      const hasDeleted = rows.some((r) => r?.message && deletedMessagesArray.has(r.message.id));
      if (!hasDeleted) return;
      const {
        colors: { textColor, backgroundColor, backgroundColorAlpha, gutterColor, gutterColorAlpha },
        switches: { useBackgroundColor, minimalistic, removeDismissButton, overrideIndicator, useIndicatorForDeleted, useEphemeralForDeleted },
        inputs: { deletedMessageBuffer, customIndicator }
      } = storage;
      const toHex = (v, fallback) => {
        const s = String(v || "").trim();
        const hex = s.startsWith("#") ? s.slice(1) : s;
        return /^[0-9a-fA-F]{6}$/.test(hex) ? `#${hex.toUpperCase()}` : fallback;
      };
      const bufferSymbol = " \u2022 ";
      for (const row of rows) {
        if (row?.type !== 1) continue;
        const msg = row.message;
        if (!msg || !deletedMessagesArray.has(msg.id)) continue;
        if (useIndicatorForDeleted && useEphemeralForDeleted) {
          msg.ephemeralIndication.content[0].content = `${deletedMessageBuffer}${bufferSymbol}  `;
        } else if (deletedMessageBuffer) {
          msg.edited = deletedMessageBuffer;
        }
        if (!minimalistic) {
          msg.textColor = ReactNative.processColor(toHex(textColor, "#E40303"));
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
            backgroundColor: ReactNative.processColor(toHex(backgroundColor, "#FF2C2F") + backgroundColorAlpha),
            gutterColor: ReactNative.processColor(toHex(gutterColor, "#FF2C2F") + gutterColorAlpha)
          };
        }
      }
      if (isString) args[1] = JSON.stringify(rows);
      else args[1] = rows;
      return args;
    }
  });

  // angel/antied/patches/createMessageRecord.js
  var MessageRecordUtils = findByProps("updateMessageRecord", "createMessageRecord");
  var createMessageRecord_default = () => after("createMessageRecord", MessageRecordUtils, function([message], record) {
    if (isEnabled) {
      record.was_deleted = message.was_deleted;
    }
  });

  // angel/antied/patches/messageRecordDefault.js
  var MessageRecord = findByName("MessageRecord", false);
  var messageRecordDefault_default = () => after("default", MessageRecord, ([props], record) => {
    if (isEnabled) {
      record.was_deleted = !!props.was_deleted;
    }
  });

  // angel/antied/patches/updateMessageRecord.js
  var MessageRecordUtils2 = findByProps("updateMessageRecord", "createMessageRecord");
  var updateMessageRecord_default = () => instead("updateMessageRecord", MessageRecordUtils2, function([oldRecord, newRecord], orig) {
    if (newRecord.was_deleted) {
      return MessageRecordUtils2.createMessageRecord(newRecord, oldRecord.reactions);
    }
    return orig.apply(this, [oldRecord, newRecord]);
  });

  // .build/antied-shims/ui-assets.js
  var getAssetIDByName = vendetta.ui.assets.getAssetIDByName;
  var all = vendetta.ui.assets.all;

  // .build/antied-shims/plugins.js
  var removePlugin = vendetta.plugins.removePlugin;
  var stopPlugin = vendetta.plugins.stopPlugin;

  // .build/antied-shims/utils.js
  var findInReactTree = vendetta.utils.findInReactTree;
  var safeFetch = vendetta.utils.safeFetch;

  // angel/antied/patches/actionsheet.jsx
  var ActionSheet = findByProps("openLazy", "hideActionSheet");
  var MessageStore2 = findByProps("getMessage", "getMessages");
  var ChannelStore2 = findByProps("getChannel", "getDMFromUserId");
  var ChannelMessages2 = findByProps("_channelMessages");
  var { ActionSheetRow } = findByProps("ActionSheetRow");
  var actionsheet_default = (deletedMessageArray2) => before("openLazy", ActionSheet, ([component, args, actionMessage]) => {
    if (isEnabled) {
      try {
        const message = actionMessage?.message;
        if (args !== "MessageLongPressActionSheet" || !message) return;
        component.then((instance) => {
          const unpatch2 = after("default", instance, (_, comp) => {
            try {
              let someFunc = function(a) {
                return a?.props?.label?.toLowerCase?.() == "reply";
              };
              React2.useEffect(() => () => {
                unpatch2();
              }, []);
              if (storage.debug) console.log(`[ANTIED ActionSheet]`, message);
              const buttons = findInReactTree(comp, (c) => c?.find?.(someFunc));
              if (!buttons) return comp;
              const position = Math.max(
                buttons.findIndex(someFunc),
                buttons.length - 1
              );
              let originalMessage = null;
              if (message?.channel_id && message?.id) {
                originalMessage = MessageStore2.getMessage(message?.channel_id, message?.id);
                if (!originalMessage) {
                  const channel = ChannelMessages2.get(message?.channel_id);
                  originalMessage = channel?.get(message?.id);
                }
              }
              if (!originalMessage) return comp;
              const escapedBuffer = regexEscaper(storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`");
              const separator = new RegExp(escapedBuffer, "gmi");
              const checkIfBufferExist = separator.test(message.content);
              if (checkIfBufferExist) {
                const targetPos = position || 1;
                buttons.splice(targetPos, 0, /* @__PURE__ */ React2.createElement(
                  ActionSheetRow,
                  {
                    label: "\u6E05\u9664\u7F16\u8F91\u5386\u53F2",
                    subLabel: `\u7531 ${stripVersions(plugin?.manifest?.name) || "ANTIED"} \u6DFB\u52A0`,
                    icon: /* @__PURE__ */ React2.createElement(ActionSheetRow.Icon, { source: getAssetIDByName("ic_edit_24px") }),
                    onPress: () => {
                      const DAN = escapedBuffer;
                      const regexPattern = new RegExp(`(?:(?:\\s${DAN}(\\s\\(<t:\\d+:[tTdDfFR]>\\))?\\n{2})|(?:(?:\\s\\(<t:\\d+:[tTdDfFR]>\\) ${DAN}\\n{2})))`, "gm");
                      const lats = message?.content?.split(regexPattern);
                      if (storage.debug) {
                        console.log([
                          [escapedBuffer],
                          message?.content?.split(regexPattern),
                          lats
                        ]);
                      }
                      const targetMessage = lats[lats.length - 1];
                      FluxDispatcher.dispatch({
                        type: "MESSAGE_UPDATE",
                        message: {
                          ...message,
                          message_reference: message?.message_reference || message?.messageReference || null,
                          content: `${targetMessage}`,
                          guild_id: ChannelStore2.getChannel(originalMessage.channel_id).guild_id
                        },
                        otherPluginBypass: true
                      });
                      ActionSheet.hideActionSheet();
                      if (storage?.inputs?.historyToast?.length > 0 || storage?.inputs?.historyToast != "") {
                        showToast2(storage?.inputs?.historyToast?.toString?.(), getAssetIDByName(storage?.misc?.editHistoryIcon || "ic_edit_24px"));
                      }
                    }
                  }
                ));
              }
              if (storage.debug) console.log(
                `[ANTIED ActionSheet]`,
                "useEphemeralForDeleted",
                !storage?.switches?.useEphemeralForDeleted,
                "msgExist?",
                Boolean(deletedMessageArray2.has(message.id))
              );
              if (!storage?.switches?.useEphemeralForDeleted && deletedMessageArray2.has(message.id)) {
                const targetPos = position || 1;
                buttons.splice(targetPos, 0, /* @__PURE__ */ React2.createElement(
                  ActionSheetRow,
                  {
                    label: "\u79FB\u9664\u5DF2\u5220\u9664\u6D88\u606F",
                    subLabel: `\u7531 ${stripVersions(plugin?.manifest?.name) || "ANTIED"} \u6DFB\u52A0`,
                    isDestructive: true,
                    icon: /* @__PURE__ */ React2.createElement(ActionSheetRow.Icon, { source: getAssetIDByName("ic_edit_24px") }),
                    onPress: () => {
                      FluxDispatcher.dispatch({
                        type: "MESSAGE_DELETE",
                        guildId: ChannelStore2.getChannel(originalMessage.channel_id).guild_id,
                        id: message?.id,
                        channelId: message?.channel_id,
                        otherPluginBypass: true
                      });
                      ActionSheet.hideActionSheet();
                      if (storage?.inputs?.historyToast?.length > 0 || storage?.inputs?.historyToast != "") {
                        showToast2(`[ANTIED] \u6D88\u606F\u5DF2\u79FB\u9664`, getAssetIDByName("ic_edit_24px"));
                      }
                    }
                  }
                ));
              }
            } catch (e) {
              showToast2("[ANTIED] \u64CD\u4F5C\u83DC\u5355\u53D1\u751F\u9519\u8BEF\uFF0C\u8BF7\u67E5\u770B\u8C03\u8BD5\u65E5\u5FD7\u4E86\u89E3\u8BE6\u60C5\u3002");
              console.error("[ANTIED Error > ActionSheet:Component Patch\n", e);
            }
          });
        });
      } catch (e) {
        showToast2("[ANTIED] \u64CD\u4F5C\u83DC\u5355\u53D1\u751F\u9519\u8BEF\uFF0C\u8BF7\u67E5\u770B\u8C03\u8BD5\u65E5\u5FD7\u4E86\u89E3\u8BE6\u60C5\u3002");
        console.error("[ANTIED Error > ActionSheet Patch\n", e);
      }
    }
  });

  // .build/antied-shims/storage.js
  var useProxy = vendetta.storage.useProxy;

  // .build/antied-shims/ui.js
  var rawColors = vendetta.ui.rawColors;
  var semanticColors = vendetta.ui.semanticColors;

  // angel/antied/lib/SelectRow.jsx
  var { FormRow } = Forms;
  var RowCheckmark = findByName("RowCheckmark");
  function SelectRow({ label, subLabel, selected, onPress }) {
    return /* @__PURE__ */ React.createElement(
      FormRow,
      {
        label,
        subLabel,
        trailing: /* @__PURE__ */ React.createElement(RowCheckmark, { selected }),
        onPress
      }
    );
  }

  // angel/antied/components/semRaw.jsx
  var SC = Object.keys(semanticColors).map((x) => `semanticColors.${x}`);
  var RC = Object.keys(rawColors).map((x) => `rawColors.${x}`);
  var semRaw = [...SC, ...RC];
  var { FormRow: FormRow2, FormDivider, ScrollView } = Forms;
  function SemRawComponent() {
    useProxy(storage);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ScrollView, null, /* @__PURE__ */ React.createElement(FormRow2, { label: "\u9009\u62E9\u989C\u8272" }), semRaw.map((NAME, i) => {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
        SelectRow,
        {
          label: NAME,
          selected: storage.colors.semRawColorPrefix == NAME,
          onPress: () => storage.colors.semRawColorPrefix = NAME
        }
      ), i !== semRaw.length - 1 && /* @__PURE__ */ React.createElement(FormDivider, null));
    })));
  }

  // angel/antied/components/colorpick.jsx
  var CustomColorPickerActionSheet = findByName("CustomColorPickerActionSheet");
  var { alphaToHex, hexAlphaToPercent } = convert;
  var { ScrollView: ScrollView2, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated } = General;
  var { FormLabel, FormIcon, FormArrow, FormRow: FormRow3, FormSwitch, FormSwitchRow, FormSection, FormDivider: FormDivider2, FormInput, FormSliderRow } = Forms;
  var customizeableColors = [
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
  function ColorPickComponent({ styles: styles5 }) {
    useProxy(storage);
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const [BGAlpha, setBGAlpha] = React2.useState(
      clamp(hexAlphaToPercent(storage?.colors?.backgroundColorAlpha) ?? 100, 0, 100)
    );
    const [gutterAlpha, setGutterAlpha] = React2.useState(
      clamp(hexAlphaToPercent(storage?.colors?.gutterColorAlpha) ?? 100, 0, 100)
    );
    const [useText, setUseText] = React2.useState(false);
    const navigation = NavigationNative.useNavigation();
    const handleSemRaw = (prefix) => {
      if (!prefix) return null;
      const [pref, col] = prefix.split(".");
      if (pref == "semanticColors") {
        return semanticColors[col];
      } else {
        return rawColors[col];
      }
    };
    return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(View, { style: [styles5.subText] }, storage?.switches?.useSemRawColors && /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(
      FormRow3,
      {
        label: "\u8BED\u4E49\u4E0E\u539F\u59CB\u989C\u8272",
        subLabel: "\u542F\u7528\u201C\u4F7F\u7528\u8BED\u4E49/\u539F\u59CB\u989C\u8272\u201D\u540E\uFF0C\u53EF\u5728\u6B64\u9009\u62E9\u989C\u8272\u3002",
        leading: /* @__PURE__ */ React2.createElement(FormRow3.Icon, { source: getAssetIDByName("ic_audit_log_24px") }),
        trailing: FormRow3.Arrow,
        onPress: () => navigation.push("VendettaCustomPage", {
          title: "\u8BED\u4E49\u4E0E\u539F\u59CB\u989C\u8272",
          render: () => /* @__PURE__ */ React2.createElement(SemRawComponent, null)
        })
      }
    )), customizeableColors?.map((obj) => {
      const whenPressed = () => openSheet(
        CustomColorPickerActionSheet,
        {
          color: colorConverter?.toInt(storage.colors[obj.id] || obj?.defaultColor || "#000"),
          onSelect: (color) => {
            const value = colorConverter?.toHex(color);
            storage.colors[obj.id] = value;
          }
        }
      );
      return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(
        FormRow3,
        {
          label: obj?.label,
          subLabel: obj?.subLabel || "\u70B9\u51FB\u66F4\u65B0",
          onPress: whenPressed,
          trailing: /* @__PURE__ */ React2.createElement(TouchableOpacity, { onPress: whenPressed }, /* @__PURE__ */ React2.createElement(
            Image,
            {
              source: { uri: transparentBase64 },
              style: {
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: storage?.colors[obj.id] || customizeableColors.find((x) => x?.id == obj?.id)?.defaultColor || "#000"
              }
            }
          ))
        }
      ));
    }), /* @__PURE__ */ React2.createElement(View, { style: styles5.container }, /* @__PURE__ */ React2.createElement(
      FormRow3,
      {
        style: { justifyContent: "center", alignItems: "center" },
        label: `\u9884\u89C8\u6837\u5F0F\uFF1A${storage?.switches?.darkMode ? "\u6DF1\u8272" : "\u6D45\u8272"}\u6A21\u5F0F`,
        subLabel: `\u70B9\u51FB\u5207\u6362\u6A21\u5F0F`,
        trailing: /* @__PURE__ */ React2.createElement(
          FormSwitch,
          {
            value: storage?.switches?.darkMode ?? true,
            onValueChange: (value) => storage.switches.darkMode = value
          }
        )
      }
    ), /* @__PURE__ */ React2.createElement(View, { style: [styles5.row, styles5.border, { overflow: "hidden", marginRight: 10 }] }, /* @__PURE__ */ React2.createElement(View, { style: {
      width: "2%",
      backgroundColor: `${storage.colors.gutterColor}${storage.colors.gutterColorAlpha}`
    } }), /* @__PURE__ */ React2.createElement(View, { style: {
      flex: 1,
      backgroundColor: `${storage.switches.useSemRawColors ? handleSemRaw(storage?.colors?.semRawColorPrefix) || storage.colors.backgroundColor : storage.colors.backgroundColor}${storage.colors.backgroundColorAlpha}`,
      justifyContent: "center",
      alignItems: "center"
    } }, /* @__PURE__ */ React2.createElement(Text, { style: {
      fontSize: 20,
      color: storage?.switches?.darkMode ? "black" : "white"
    } }, " \u666E\u901A\u793A\u4F8B\u6D88\u606F "), /* @__PURE__ */ React2.createElement(Text, { style: {
      fontSize: 20,
      color: storage.colors.textColor || "#000000"
    } }, " \u5DF2\u5220\u9664\u793A\u4F8B\u6D88\u606F "))), /* @__PURE__ */ React2.createElement(
      FormRow3,
      {
        label: "\u70B9\u51FB\u5207\u6362\u8F93\u5165\u65B9\u5F0F",
        subLabel: "\u5728\u6ED1\u5757\u548C\u6570\u503C\u8F93\u5165\u4E4B\u95F4\u5207\u6362",
        onPress: () => {
          setUseText(!useText);
        }
      }
    ), useText ? /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(
      FormInput,
      {
        title: `\u80CC\u666F\u989C\u8272\u900F\u660E\u5EA6\uFF1A${BGAlpha}%`,
        keyboardType: "numeric",
        style: { width: "90%" },
        value: `${BGAlpha}`,
        onChange: (val) => {
          val = clamp(val, 0, 100);
          setBGAlpha(Number(val));
          storage.colors.backgroundColorAlpha = alphaToHex(val);
        }
      }
    )) : /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(
      FormSliderRow,
      {
        label: `\u80CC\u666F\u989C\u8272\u900F\u660E\u5EA6\uFF1A${BGAlpha}%`,
        value: BGAlpha,
        minVal: 0,
        maxVal: 100,
        style: { width: "90%" },
        onValueChange: (v) => {
          setBGAlpha(Number(v));
          storage.colors.backgroundColorAlpha = alphaToHex(v);
        }
      }
    )), /* @__PURE__ */ React2.createElement(FormDivider2, null), useText ? /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(
      FormInput,
      {
        title: `\u80CC\u666F\u4FA7\u680F\u900F\u660E\u5EA6\uFF1A${gutterAlpha}%`,
        keyboardType: "numeric",
        style: { width: "90%" },
        value: `${gutterAlpha}`,
        onChange: (val) => {
          val = clamp(val, 0, 100);
          setGutterAlpha(Number(val));
          storage.colors.gutterColorAlpha = alphaToHex(val);
        }
      }
    )) : /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(
      FormSliderRow,
      {
        label: `\u80CC\u666F\u4FA7\u680F\u900F\u660E\u5EA6\uFF1A${gutterAlpha}%`,
        value: gutterAlpha,
        minVal: 0,
        maxVal: 100,
        style: { width: "90%" },
        onValueChange: (v) => {
          setGutterAlpha(Number(v));
          storage.colors.gutterColorAlpha = alphaToHex(v);
        }
      }
    )))));
  }

  // angel/antied/components/customize.jsx
  var { ScrollView: ScrollView3, View: View2, Text: Text2, TouchableOpacity: TouchableOpacity2, TextInput: TextInput2, Pressable: Pressable2, Image: Image2, Animated: Animated2 } = General;
  var { FormRow: FormRow4, FormIcon: FormIcon2, FormSwitch: FormSwitch2, FormDivider: FormDivider3 } = Forms;
  var HelpMessage = findByName("HelpMessage");
  var customizeableSwitches = [
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
  function CustomizationComponent({ styles: styles5 }) {
    useProxy(storage);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View2, { style: [styles5.subText] }, storage?.switches.minimalistic && /* @__PURE__ */ React.createElement(HelpMessage, { messageType: 0 }, "\u82E5\u8981\u4F7F\u7528\u6837\u5F0F\uFF0C\u8BF7\u5173\u95ED\u201C\u6781\u7B80\u8BBE\u7F6E\u201D\u9009\u9879\u3002"), customizeableSwitches?.map((obj, index) => {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
        FormRow4,
        {
          label: obj?.label,
          subLabel: obj?.subLabel,
          leading: obj?.icon && /* @__PURE__ */ React.createElement(FormIcon2, { style: { opacity: 1 }, source: getAssetIDByName(obj?.icon) }),
          trailing: "id" in obj ? /* @__PURE__ */ React.createElement(
            FormSwitch2,
            {
              value: storage?.switches[obj?.id] ?? obj?.default,
              onValueChange: (value) => storage.switches[obj?.id] = value
            }
          ) : void 0
        }
      ), index !== customizeableSwitches?.length - 1 && /* @__PURE__ */ React.createElement(FormDivider3, null));
    })));
  }

  // angel/antied/pages/addUser.jsx
  var { ScrollView: ScrollView4, View: View3, Text: Text3, TouchableOpacity: TouchableOpacity3, TextInput: TextInput3, Image: Image3, Animated: Animated3 } = General;
  var { FormLabel: FormLabel2, FormIcon: FormIcon3, FormArrow: FormArrow2, FormRow: FormRow5, FormSwitch: FormSwitch3, FormSwitchRow: FormSwitchRow2, FormSection: FormSection2, FormDivider: FormDivider4, FormInput: FormInput2 } = Forms;
  var useIsFocused = findByName("useIsFocused");
  var { BottomSheetFlatList } = findByProps("BottomSheetScrollView");
  var UserStore = findByStoreName("UserStore");
  var Profiles = findByProps("showUserProfile");
  var Add = getAssetIDByName("ic_add_24px");
  var Mod = getAssetIDByName("ic_arrow");
  var Remove = getAssetIDByName("ic_minus_circle_24px");
  var Checkmark = getAssetIDByName("Check");
  var Crossmark = getAssetIDByName("Small");
  function addIcon(i) {
    return /* @__PURE__ */ React2.createElement(FormIcon3, { style: { opacity: 1 }, source: getAssetIDByName(i) });
  }
  var styles = stylesheet.createThemedStyleSheet({
    basicPad: {
      paddingRight: 10,
      marginBottom: 10,
      letterSpacing: 0.25
    },
    header: {
      color: semanticColors.HEADER_PRIMARY,
      fontFamily: constants.Fonts.DISPLAY_BOLD,
      fontSize: 25,
      paddingLeft: "3%",
      letterSpacing: 0.25
    },
    sub: {
      color: semanticColors.TEXT_POSITIVE,
      fontFamily: constants.Fonts.DISPLAY_NORMAL,
      paddingLeft: "4%",
      fontSize: 18
    },
    flagsText: {
      color: semanticColors.HEADER_SECONDARY,
      fontFamily: constants.Fonts.PRIMARY_BOLD,
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
      color: semanticColors.HEADER_SECONDARY,
      fontSize: 12.75
    }
  });
  function AddUser({ index }) {
    useProxy(storage);
    let object = storage?.inputs?.ignoredUserList[index];
    const animatedButtonScale = React2.useRef(new Animated3.Value(1)).current;
    const onPressIn = () => Animated3.spring(animatedButtonScale, { toValue: 1.1, duration: 10, useNativeDriver: true }).start();
    const onPressOut = () => Animated3.spring(animatedButtonScale, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    const animatedScaleStyle = {
      transform: [
        {
          scale: animatedButtonScale
        }
      ]
    };
    let user = UserStore.getUser(object?.id);
    let cached = Object.values(UserStore.getUsers());
    if (!user) user = cached.find((u) => u?.username == object?.username);
    if (!user) user = cached.find((u) => u?.username?.toLowerCase() == object?.username?.toLowerCase());
    const navigation = NavigationNative.useNavigation();
    useIsFocused();
    return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(ScrollView4, null, /* @__PURE__ */ React2.createElement(View3, { style: [styles.basicPad, styles.sub] }, /* @__PURE__ */ React2.createElement(FormSection2, { title: "\u7528\u6237\u8BBE\u7F6E", style: [styles.header] }, /* @__PURE__ */ React2.createElement(
      FormRow5,
      {
        label: "\u67E5\u627E\u7528\u6237 ID \u6216\u7528\u6237\u540D",
        leading: addIcon("ic_search"),
        onPress: () => {
          if (user && !object.username?.length) {
            object.username = user.username;
          } else if (user && !object.id?.length) {
            object.id = user.id;
          } else {
            showToast2("\u627E\u4E0D\u5230\u7528\u6237 ID \u6216\u7528\u6237\u540D\u3002");
          }
        }
      }
    ), /* @__PURE__ */ React2.createElement(
      FormInput2,
      {
        title: "\u7528\u6237\u540D\uFF5C\u533A\u5206\u5927\u5C0F\u5199",
        placeholder: "\u672A\u586B\u5199",
        value: object?.username,
        onChange: (v) => object.username = v
      }
    ), /* @__PURE__ */ React2.createElement(
      FormInput2,
      {
        title: "\u7528\u6237 ID",
        placeholder: "\u672A\u586B\u5199",
        value: object?.id,
        onChange: (v) => object.id = v
      }
    ), /* @__PURE__ */ React2.createElement(
      FormRow5,
      {
        label: "\u7528\u6237\u662F Webhook \u5417\uFF1F",
        subLabel: "\u8BE5\u7528\u6237\u662F Webhook \u6216\u7CFB\u7EDF\u7528\u6237\uFF0C\u800C\u975E\u673A\u5668\u4EBA\u6216\u666E\u901A\u7528\u6237\u3002",
        leading: addIcon("ic_webhook_24px"),
        trailing: /* @__PURE__ */ React2.createElement(
          FormSwitch3,
          {
            value: object?.isWebhook || false,
            onValueChange: (value) => object.isWebhook = value
          }
        )
      }
    )), user && /* @__PURE__ */ React2.createElement(View3, { style: [styles.container, { paddingBottom: 10 }] }, /* @__PURE__ */ React2.createElement(
      TouchableOpacity3,
      {
        onPress: () => Profiles.showUserProfile?.({ userId: user?.id }),
        onPressIn,
        onPressOut
      },
      /* @__PURE__ */ React2.createElement(Animated3.View, { style: animatedScaleStyle }, /* @__PURE__ */ React2.createElement(
        Image3,
        {
          source: {
            uri: user?.getAvatarURL?.()?.replace?.("webp", "png") || "https://cdn.discordapp.com/embed/avatars/2.png"
          },
          style: {
            width: 128,
            height: 128,
            borderRadius: 10
          }
        }
      ))
    ), /* @__PURE__ */ React2.createElement(View3, { style: styles.textContainer }, /* @__PURE__ */ React2.createElement(TouchableOpacity3, { onPress: () => Profiles.showUserProfile({ userId: user?.id }) }, /* @__PURE__ */ React2.createElement(Text3, { style: [styles.mainText, styles.header] }, user?.username || object?.username || "\u65E0\u540D\u79F0"))), /* @__PURE__ */ React2.createElement(FormDivider4, null)), /* @__PURE__ */ React2.createElement(
      FormRow5,
      {
        label: /* @__PURE__ */ React2.createElement(FormLabel2, { text: "\u4ECE\u5FFD\u7565\u5217\u8868\u79FB\u9664\u7528\u6237", style: { color: rawColors.RED_400 } }),
        onPress: () => {
          navigation.pop();
          storage?.inputs?.ignoredUserList?.splice(index, 1);
        }
      }
    ))));
  }

  // .build/antied-shims/ui-alerts.js
  var showConfirmationAlert = vendetta.ui.alerts.showConfirmationAlert;

  // angel/antied/pages/listUsers.jsx
  var { ScrollView: ScrollView5, View: View4, Text: Text4, TouchableOpacity: TouchableOpacity4, TextInput: TextInput4 } = General;
  var { FormLabel: FormLabel3, FormIcon: FormIcon4, FormArrow: FormArrow3, FormRow: FormRow6, FormSwitch: FormSwitch4, FormSwitchRow: FormSwitchRow3, FormSection: FormSection3, FormDivider: FormDivider5, FormInput: FormInput3 } = Forms;
  function addIcon2(i, dr) {
    return /* @__PURE__ */ React2.createElement(FormIcon4, { style: { opacity: 1 }, source: dr ? i : getAssetIDByName(i) });
  }
  var useIsFocused2 = findByName("useIsFocused");
  var { BottomSheetFlatList: BottomSheetFlatList2 } = findByProps("BottomSheetScrollView");
  var { getUser } = findByProps("getUser");
  var Add2 = getAssetIDByName("ic_add_24px");
  var Mod2 = getAssetIDByName("ic_arrow");
  var Remove2 = getAssetIDByName("ic_minus_circle_24px");
  var Checkmark2 = getAssetIDByName("Check");
  var Crossmark2 = getAssetIDByName("Small");
  var Trash = getAssetIDByName("ic_trash_24px");
  var styles2 = stylesheet.createThemedStyleSheet({
    basicPad: {
      paddingRight: 10,
      marginBottom: 10,
      letterSpacing: 0.25
    },
    header: {
      color: semanticColors.HEADER_SECONDARY,
      fontFamily: constants.Fonts.PRIMARY_BOLD,
      paddingLeft: "3.5%",
      fontSize: 24
    },
    sub: {
      color: semanticColors.TEXT_POSITIVE,
      fontFamily: constants.Fonts.DISPLAY_NORMAL,
      paddingLeft: "4%",
      fontSize: 18
    },
    flagsText: {
      color: semanticColors.HEADER_SECONDARY,
      fontFamily: constants.Fonts.PRIMARY_BOLD,
      paddingLeft: "4%",
      fontSize: 16
    },
    input: {
      fontSize: 16,
      fontFamily: constants.Fonts.PRIMARY_MEDIUM,
      color: semanticColors.TEXT_NORMAL
    },
    placeholder: {
      color: semanticColors.INPUT_PLACEHOLDER_TEXT
    }
  });
  function ListUsers() {
    useProxy(storage);
    let [newUser, setNewUser] = React2.useState("");
    const navigation = NavigationNative.useNavigation();
    useIsFocused2();
    let users = storage?.inputs?.ignoredUserList ?? [];
    const addNewUser = () => {
      if (newUser) {
        if (!isNaN(parseInt(newUser))) {
          let validUser = getUser(newUser);
          if (validUser) {
            users.push({ id: validUser?.id, username: "", showUser: false, isWebhook: false });
          } else {
            return showToast2("\u65E0\u6548\u7684\u7528\u6237 ID");
          }
        } else {
          users.push({ id: void 0, username: newUser });
        }
        setNewUser("");
        navigation.push("VendettaCustomPage", {
          title: `\u6DFB\u52A0\u7528\u6237\u5230\u5FFD\u7565\u5217\u8868`,
          render: () => /* @__PURE__ */ React2.createElement(AddUser, { index: users?.length - 1 })
        });
      }
    };
    return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(ScrollView5, { style: { flex: 1 } }, /* @__PURE__ */ React2.createElement(FormSection3, { style: [styles2.header, styles2.basicPad] }, /* @__PURE__ */ React2.createElement(View4, { style: [styles2.header, styles2.sub] }, users.length > 0 && /* @__PURE__ */ React2.createElement(
      FormRow6,
      {
        label: "\u6E05\u7A7A\u5217\u8868",
        trailing: addIcon2(Trash, true),
        onPress: () => {
          if (users.length !== 0) {
            showConfirmationAlert({
              title: "\u8BF7\u7A0D\u7B49\uFF01",
              content: `\u8FD9\u5C06\u4ECE\u5FFD\u7565\u5217\u8868\u79FB\u9664\u5171 ${users.length} \u540D\u7528\u6237\u3002`,
              confirmText: "\u786E\u5B9A",
              cancelText: "\u53D6\u6D88",
              confirmColor: "brand",
              onConfirm: () => {
                storage.inputs.ignoredUserList = [];
              }
            });
          }
        }
      }
    ), users?.map((comp, i) => {
      return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(
        FormRow6,
        {
          label: comp?.username || comp?.id || "\u65E0\u6570\u636E",
          trailing: /* @__PURE__ */ React2.createElement(FormArrow3, null),
          onPress: () => navigation.push("VendettaCustomPage", {
            title: "\u7F16\u8F91\u7528\u6237",
            render: () => /* @__PURE__ */ React2.createElement(AddUser, { index: i })
          })
        }
      ), i !== users?.length - 1 && /* @__PURE__ */ React2.createElement(FormDivider5, null));
    }), /* @__PURE__ */ React2.createElement(
      FormRow6,
      {
        label: /* @__PURE__ */ React2.createElement(
          TextInput4,
          {
            value: newUser,
            onChangeText: setNewUser,
            placeholder: "\u7528\u6237 ID \u6216\u7528\u6237\u540D",
            placeholderTextColor: styles2.placeholder.color,
            selectionColor: constants.Colors.PRIMARY_DARK_100,
            onSubmitEditing: addNewUser,
            returnKeyType: "done",
            style: styles2.input
          }
        ),
        trailing: /* @__PURE__ */ React2.createElement(
          TouchableOpacity4,
          {
            onPress: addNewUser
          },
          addIcon2(Add2, true)
        )
      }
    )))));
  }

  // angel/antied/components/ignorelist.jsx
  var { ScrollView: ScrollView6, View: View5, Text: Text5, TouchableOpacity: TouchableOpacity5, TextInput: TextInput5, Pressable: Pressable3, Image: Image4, Animated: Animated4 } = General;
  var { FormLabel: FormLabel4, FormIcon: FormIcon5, FormArrow: FormArrow4, FormRow: FormRow7, FormSwitch: FormSwitch5, FormSwitchRow: FormSwitchRow4, FormSection: FormSection4, FormDivider: FormDivider6, FormInput: FormInput4, FormSliderRow: FormSliderRow2 } = Forms;
  function IgnoreListComponent() {
    useProxy(storage);
    const navigation = NavigationNative.useNavigation();
    const listIgnore = () => {
      navigation.push("VendettaCustomPage", {
        title: `\u5DF2\u5FFD\u7565\u7528\u6237\u5217\u8868`,
        render: () => /* @__PURE__ */ React.createElement(ListUsers, null)
      });
    };
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      FormRow7,
      {
        label: "\u6DFB\u52A0\u7528\u6237\u5230\u5217\u8868",
        subLabel: "\u63D2\u4EF6\u5C06\u5FFD\u7565\u8FD9\u4E9B\u7528\u6237",
        leading: /* @__PURE__ */ React.createElement(FormIcon5, { style: { opacity: 1 }, source: getAssetIDByName("ic_members") }),
        onPress: listIgnore,
        trailing: /* @__PURE__ */ React.createElement(TouchableOpacity5, { onPress: listIgnore }, /* @__PURE__ */ React.createElement(FormIcon5, { style: { opacity: 1 }, source: getAssetIDByName("ic_add_24px") }))
      }
    ), /* @__PURE__ */ React.createElement(FormDivider6, null));
  }

  // angel/antied/components/nerd.jsx
  var HelpMessage2 = findByName("HelpMessage");
  var { FormRow: FormRow8, FormDivider: FormDivider7, FormInput: FormInput5, FormSwitch: FormSwitch6 } = Forms;
  function NerdComponent({ stx }) {
    useProxy(storage);
    const [plugUri, setPlugUri] = React2.useState(plugin.id);
    return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(HelpMessage2, { messageType: 0 }, "\u66F4\u6539\u63D2\u4EF6\u7F51\u5740\u53EF\u80FD\u4F1A\u5C06\u540E\u7EED\u66F4\u65B0\u91CD\u5B9A\u5411\u5230\u65B0\u6765\u6E90\uFF0C\u6216\u5BFC\u81F4\u65E0\u6CD5\u66F4\u65B0\u3002"), /* @__PURE__ */ React2.createElement(
      FormInput5,
      {
        title: "\u66F4\u6539\u63D2\u4EF6\u7F51\u5740",
        keyboardType: "default",
        placeholder: "https://benchu985.github.io/MP-CN/angel/antied",
        value: plugUri,
        onChange: (val) => {
          plugin.id = val?.toString();
          setPlugUri(val?.toString());
        }
      }
    ), /* @__PURE__ */ React2.createElement(FormDivider7, null), /* @__PURE__ */ React2.createElement(
      FormRow8,
      {
        label: "\u6062\u590D\u539F\u59CB\u7F51\u5740",
        subLabel: "\u70B9\u51FB\u5207\u6362\u5230\u6B63\u5F0F\u7248\u7F51\u5740\uFF08\u5C06\u9000\u51FA\u8C03\u8BD5\u7248\u672C\uFF09\u3002",
        onPress: () => {
          plugin.id = "https://benchu985.github.io/MP-CN/angel/antied";
          showToast2("\u63D2\u4EF6\u7F51\u5740\u5DF2\u6062\u590D\u4E3A\u539F\u59CB\u7F51\u5740\u3002");
        }
      }
    ), /* @__PURE__ */ React2.createElement(FormDivider7, null), /* @__PURE__ */ React2.createElement(
      FormRow8,
      {
        label: "\u6062\u590D\u539F\u59CB\u63D2\u4EF6\u540D\u79F0",
        subLabel: "\u70B9\u51FB\u91CD\u7F6E\u4E3A\u9ED8\u8BA4\u540D\u79F0\u3002",
        onPress: () => {
          plugin.manifest.name = plugin.manifest.originalName;
          showToast2("\u63D2\u4EF6\u540D\u79F0\u5DF2\u6062\u590D\u4E3A\u539F\u59CB\u540D\u79F0\u3002");
        }
      }
    ), /* @__PURE__ */ React2.createElement(FormDivider7, null), /* @__PURE__ */ React2.createElement(
      FormRow8,
      {
        label: "\u8C03\u8BD5",
        subLabel: "\u542F\u7528\u5E38\u89C4\u63A7\u5236\u53F0\u65E5\u5FD7",
        style: { paddingBottom: 20 },
        trailing: /* @__PURE__ */ React2.createElement(
          FormSwitch6,
          {
            value: storage.debug,
            onValueChange: (value) => {
              storage.debug = value;
            }
          }
        )
      }
    ), /* @__PURE__ */ React2.createElement(FormDivider7, null), /* @__PURE__ */ React2.createElement(
      FormRow8,
      {
        label: "\u8C03\u8BD5 updateRows",
        subLabel: "\u542F\u7528 updateRows \u63A7\u5236\u53F0\u65E5\u5FD7",
        style: { paddingBottom: 20 },
        trailing: /* @__PURE__ */ React2.createElement(
          FormSwitch6,
          {
            value: storage.debugUpdateRows,
            onValueChange: (value) => {
              storage.debugUpdateRows = value;
            }
          }
        )
      }
    ));
  }

  // angel/antied/components/patches.jsx
  var { ScrollView: ScrollView7, View: View6, Text: Text6, TouchableOpacity: TouchableOpacity6, TextInput: TextInput6, Pressable: Pressable4, Image: Image5, Animated: Animated5 } = General;
  var { FormLabel: FormLabel5, FormIcon: FormIcon6, FormArrow: FormArrow5, FormRow: FormRow9, FormSwitch: FormSwitch7, FormSwitchRow: FormSwitchRow5, FormSection: FormSection5, FormDivider: FormDivider8, FormInput: FormInput6, FormSliderRow: FormSliderRow3 } = Forms;
  var togglePatch = [
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
  function PatchesComponent({ styles: styles5 }) {
    useProxy(storage);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View6, { style: [styles5.subText] }, togglePatch?.map((obj, index) => {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
        FormRow9,
        {
          label: obj?.label,
          subLabel: obj?.subLabel,
          leading: obj?.icon && /* @__PURE__ */ React.createElement(FormIcon6, { style: { opacity: 1 }, source: getAssetIDByName(obj?.icon) }),
          trailing: "id" in obj ? /* @__PURE__ */ React.createElement(
            FormSwitch7,
            {
              value: storage?.switches[obj?.id] ?? obj?.default,
              onValueChange: (value) => storage.switches[obj?.id] = value
            }
          ) : void 0
        }
      ), index !== togglePatch?.length - 1 && /* @__PURE__ */ React.createElement(FormDivider8, null));
    })));
  }

  // angel/antied/components/texts.jsx
  var { ScrollView: ScrollView8, View: View7, Text: Text7, TouchableOpacity: TouchableOpacity7, TextInput: TextInput7, Pressable: Pressable5, Image: Image6, Animated: Animated6 } = General;
  var { FormLabel: FormLabel6, FormIcon: FormIcon7, FormArrow: FormArrow6, FormRow: FormRow10, FormSwitch: FormSwitch8, FormSwitchRow: FormSwitchRow6, FormSection: FormSection6, FormDivider: FormDivider9, FormInput: FormInput7, FormSliderRow: FormSliderRow4 } = Forms;
  var customizedableTexts = [
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
  function TextComponent({ styles: styles5 }) {
    useProxy(storage);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View7, { style: [styles5.subText] }, customizedableTexts?.map((obj, index) => {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
        FormInput7,
        {
          title: obj?.title,
          keyboardType: obj?.type,
          placeholder: obj?.placeholder?.toString(),
          value: storage?.inputs[obj.id] ?? obj?.placeholder,
          onChange: (val) => storage.inputs[obj.id] = val.toString()
        }
      ), index !== customizedableTexts.length - 1 && /* @__PURE__ */ React.createElement(FormDivider9, null));
    }), /* @__PURE__ */ React.createElement(
      FormInput7,
      {
        title: "\u81EA\u5B9A\u4E49\u63D2\u4EF6\u540D\u79F0",
        keyboardType: "default",
        placeholder: storage?.inputs?.customPluginName || plugin?.manifest?.name || "ANTIED",
        value: storage?.inputs?.customPluginName,
        onChange: (val) => {
          storage.inputs.customPluginName = val.toString();
          plugin.manifest.name = val.toString();
        }
      }
    ), /* @__PURE__ */ React.createElement(FormDivider9, null), /* @__PURE__ */ React.createElement(
      FormRow10,
      {
        label: `\u5F53\u524D\u4F7F\u7528\u56FE\u6807 - ${storage?.misc?.editHistoryIcon || "ic_edit_24px"}`,
        subLabel: "\u201C\u5386\u53F2\u8BB0\u5F55\u5DF2\u6E05\u9664\u201D\u63D0\u793A\u4F7F\u7528\u7684\u56FE\u6807",
        trailing: /* @__PURE__ */ React.createElement(FormIcon7, { style: { opacity: 1 }, source: getAssetIDByName(storage?.misc?.editHistoryIcon) })
      }
    ), /* @__PURE__ */ React.createElement(FormDivider9, null), /* @__PURE__ */ React.createElement(
      FormInput7,
      {
        title: "\u56FE\u6807\u540D\u79F0",
        keyboardType: "default",
        placeholder: "ic_edit_24px",
        value: storage?.misc?.editHistoryIcon || "ic_edit_24px",
        onChange: (val) => storage.misc.editHistoryIcon = val.toString()
      }
    )));
  }

  // angel/antied/components/timestamp.jsx
  var timestamps = [
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
  var timestampsPosition = [
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
  var { FormRow: FormRow11, FormDivider: FormDivider10 } = Forms;
  function TimestampComponent() {
    useProxy(storage);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormRow11, { label: "\u65F6\u95F4\u6233\u6837\u5F0F" }), timestamps.map(({ type, label, subLabel }, i) => {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
        SelectRow,
        {
          label,
          subLabel: `\u793A\u4F8B\uFF1A${subLabel}`,
          selected: storage.switches.timestampStyle == type,
          onPress: () => storage.switches.timestampStyle = type
        }
      ), i !== timestamps.length - 1 && /* @__PURE__ */ React.createElement(FormDivider10, null));
    }), /* @__PURE__ */ React.createElement(FormDivider10, null), /* @__PURE__ */ React.createElement(FormRow11, { label: "\u65F6\u95F4\u6233\u4F4D\u7F6E" }), timestampsPosition.map(({ key, label, subLabel }, i) => {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
        SelectRow,
        {
          label,
          subLabel: `\u793A\u4F8B\uFF1A${subLabel}`,
          selected: storage.misc?.timestampPos == key,
          onPress: () => storage.misc.timestampPos = key
        }
      ), i !== timestampsPosition.length - 1 && /* @__PURE__ */ React.createElement(FormDivider10, null));
    }));
  }

  // angel/antied/components/credits.jsx
  var UserStore2 = findByStoreName("UserStore");
  var { ScrollView: ScrollView9, View: View8, Text: Text8, TouchableOpacity: TouchableOpacity8, TextInput: TextInput8, Pressable: Pressable6, Image: Image7, Animated: Animated7 } = General;
  var { FormLabel: FormLabel7, FormArrow: FormArrow7, FormRow: FormRow12, FormSection: FormSection7, FormDivider: FormDivider11, FormInput: FormInput8 } = Forms;
  var me = { name: "Angel", role: "\u4F5C\u8005\u4E0E\u7EF4\u62A4\u8005", uuid: "692632336961110087" };
  var qa = [
    { name: "Rairof", role: "\u8D28\u91CF\u4FDD\u8BC1", uuid: "923212189123346483" },
    { name: "Moodle", role: "\u8D28\u91CF\u4FDD\u8BC1", uuid: "807170846497570848" },
    { name: "Catinette", role: "\u8D28\u91CF\u4FDD\u8BC1", uuid: "1302022854740807730" },
    { name: "Win8.1VMUser", role: "\u8D28\u91CF\u4FDD\u8BC1", uuid: "793935599702507542" }
    // { name: 'Dave',  role: '质量保证' }
  ];
  var links = [
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
    useProxy(storage);
    const open = (uri) => url.openURL(uri).catch(() => {
    });
    const getUser2 = (id2) => UserStore2?.getUser(id2) || Object.values(UserStore2?.getUsers()).find((u) => u.id === id2) || null;
    const getUserPng = (id2) => {
      const u = getUser2(id2);
      return u?.getAvatarURL?.()?.replace("webp", "png") || null;
    };
    const box = (u) => /* @__PURE__ */ React2.createElement(Image7, { source: { uri: u }, style: { width: 40, height: 40, borderRadius: 20 } });
    return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(ScrollView9, null, /* @__PURE__ */ React2.createElement(FormSection7, { title: "\u5F00\u53D1\u8005" }, /* @__PURE__ */ React2.createElement(
      FormRow12,
      {
        label: me.name,
        subLabel: me.role,
        leading: box(getUserPng(me?.uuid))
      }
    )), /* @__PURE__ */ React2.createElement(FormSection7, { title: "\u6D4B\u8BD5\u8005" }, qa.map((p, i) => {
      const avatarUri = getUserPng(p?.uuid);
      return /* @__PURE__ */ React2.createElement(
        FormRow12,
        {
          key: i,
          label: p.name,
          subLabel: p.role,
          leading: avatarUri ? box(avatarUri) : null
        }
      );
    })), /* @__PURE__ */ React2.createElement(FormDivider11, null), /* @__PURE__ */ React2.createElement(FormSection7, { title: "\u652F\u6301\u4E0E\u6E90\u4EE3\u7801" }, /* @__PURE__ */ React2.createElement(View8, { style: { margin: 50 } }, links.map((l, i) => {
      let finalIcon = l.icon ? l.icon?.startsWith("https") ? /* @__PURE__ */ React2.createElement(Image7, { source: { uri: l.icon }, style: { width: 120, height: 40 } }) : /* @__PURE__ */ React2.createElement(FormRow12.Icon, { source: getAssetIDByName(l.icon) }) : null;
      return /* @__PURE__ */ React2.createElement(
        FormRow12,
        {
          key: i,
          label: l.label,
          leading: finalIcon,
          trailing: /* @__PURE__ */ React2.createElement(FormArrow7, null),
          onPress: () => open(l.url)
        }
      );
    }))), /* @__PURE__ */ React2.createElement(FormDivider11, null), /* @__PURE__ */ React2.createElement(View8, { style: { height: 40 } })));
  }

  // angel/antied/knowbug.js
  var knownBugs = [
    {
      bugType: "SELF_EDIT_MESSAGE",
      bugDescription: "\u5F00\u59CB\u7F16\u8F91\u6D88\u606F\u65F6\uFF0C\u65E7\u5386\u53F2\u53EF\u80FD\u4F1A\u4E00\u5E76\u5E26\u5165\u3002\u53EF\u4F7F\u7528 BetterBetterChatGestrure \u63D2\u4EF6\u4E2D\u7684 Antied Watch \u529F\u80FD\u5F3A\u5236\u7F16\u8F91\u6D88\u606F\u3002"
    },
    {
      bugType: "MESSAGE_DELETION_BOT_DISMISS",
      bugDescription: "\u6781\u5C11\u6570\u60C5\u51B5\u4E0B\uFF0C\u5220\u9664\u8865\u4E01\u53EF\u80FD\u65E0\u6CD5\u5173\u95ED\u4E34\u65F6\u6D88\u606F\uFF0C\u5E38\u89C1\u4E8E\u673A\u5668\u4EBA\u6D88\u606F\u3002"
    }
  ];
  var knowbug_default = knownBugs;

  // lib/components/versionChange.jsx
  var { ScrollView: ScrollView10, View: View9, Text: Text9, TouchableOpacity: TouchableOpacity9, TextInput: TextInput9, Image: Image8, Animated: Animated8 } = General;
  var { FormLabel: FormLabel8, FormIcon: FormIcon8, FormArrow: FormArrow8, FormRow: FormRow13, FormSwitch: FormSwitch9, FormSwitchRow: FormSwitchRow7, FormSection: FormSection8, FormDivider: FormDivider12, FormInput: FormInput9 } = Forms;
  var current = getAssetIDByName("ic_radio_square_checked_24px");
  var older = getAssetIDByName("ic_radio_square_24px");
  var info = getAssetIDByName("ic_information_24px");
  var infoAlt = getAssetIDByName("ic_info");
  var newStuff = getAssetIDByName("premium_sparkles");
  var updatedStuff = getAssetIDByName("ic_sync_24px");
  var fixStuff = getAssetIDByName("ic_progress_wrench_24px");
  var styles3 = stylesheet.createThemedStyleSheet({
    border: {
      borderRadius: 10
    },
    textBody: {
      color: semanticColors.TEXT_NORMAL,
      fontFamily: constants.Fonts.PRIMARY_MEDIUM,
      letterSpacing: 0.25,
      fontSize: 22
    },
    textBody: {
      color: semanticColors.INPUT_PLACEHOLDER_TEXT,
      fontFamily: constants.Fonts.DISPLAY_NORMAL,
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
  });

  // angel/antied/Settings.jsx
  var { ScrollView: ScrollView11, View: View10, Text: Text10, TouchableOpacity: TouchableOpacity10, TextInput: TextInput10, Pressable: Pressable7, Image: Image9, Animated: Animated9 } = General;
  var { FormLabel: FormLabel9, FormIcon: FormIcon9, FormArrow: FormArrow9, FormRow: FormRow14, FormSwitch: FormSwitch10, FormSwitchRow: FormSwitchRow8, FormSection: FormSection9, FormDivider: FormDivider13, FormInput: FormInput10, FormSliderRow: FormSliderRow5 } = Forms;
  var LinearGradient = findByName("LinearGradient");
  var styles4 = stylesheet.createThemedStyleSheet({
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
    useProxy(storage);
    const [animation] = React2.useState(new Animated9.Value(0));
    const [isKnownBugOpen, setKnownBugOpen] = React2.useState(false);
    const navigation = NavigationNative.useNavigation();
    const openCreditPage = () => {
      navigation.push("VendettaCustomPage", {
        title: `\u9E23\u8C22\u4E0E\u652F\u6301`,
        render: () => React2.createElement(CreditsPage, { styles: styles4 })
      });
    };
    React2.useEffect(() => {
      Animated9.loop(
        Animated9.timing(
          animation,
          {
            toValue: 4,
            duration: 8e3,
            useNativeDriver: true
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
          "rgba(188,31,31,0.5)"
        ]
      })
    };
    const createChild = (id2, title, label, subLabel, props, propsData) => {
      return { id: id2, title, label, subLabel, props, propsData };
    };
    const ComponentChildren = [
      createChild("patches", "\u63D2\u4EF6\u8865\u4E01", "\u663E\u793A\u8865\u4E01\u9009\u9879", "\u5F00\u5173\u63D2\u4EF6\u8981\u5E94\u7528\u7684\u8865\u4E01", PatchesComponent, styles4),
      createChild("customize", "\u81EA\u5B9A\u4E49", "\u81EA\u5B9A\u4E49", null, CustomizationComponent, styles4),
      createChild("text", "\u6587\u672C\u53D8\u91CF", "\u81EA\u5B9A\u4E49\u6587\u672C", null, TextComponent, styles4),
      createChild("timestamp", "\u65F6\u95F4\u6233", "\u65F6\u95F4\u6233\u6837\u5F0F", null, TimestampComponent, styles4),
      createChild("colorpick", "\u989C\u8272", "\u81EA\u5B9A\u4E49\u989C\u8272", null, ColorPickComponent, styles4),
      createChild("ingorelist", "\u5FFD\u7565\u5217\u8868", "\u663E\u793A\u5FFD\u7565\u5217\u8868", null, IgnoreListComponent, null),
      createChild("nerd", "\u9AD8\u7EA7\u9009\u9879", "\u6253\u5F00\u9AD8\u7EA7\u9009\u9879", null, NerdComponent, null, styles4)
    ];
    const entireUIList = /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(View10, { style: [styles4.lnBorder, bgStyle, styles4.darkMask] }, ComponentChildren.map((element) => {
      return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(FormSection9, { title: element?.title }, /* @__PURE__ */ React2.createElement(
        FormRow14,
        {
          label: element?.label,
          subLabel: element?.subLabel,
          onPress: () => {
            storage.setting[element?.id] = !storage.setting[element?.id];
          },
          trailing: storage.setting[element?.id] == true ? /* @__PURE__ */ React2.createElement(FormRow14.Icon, { source: getAssetIDByName("ic_arrow_down") }) : /* @__PURE__ */ React2.createElement(FormRow14.Icon, { source: getAssetIDByName("ic_arrow_right") })
        }
      ), storage.setting[element.id] && element.props && /* @__PURE__ */ React2.createElement(View10, { style: {
        margin: 5,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "rgba(0, 0, 0, 0.15)"
      } }, React2.createElement(element.props, { styles: element.propsData }))));
    }), knowbug_default && /* @__PURE__ */ React2.createElement(FormSection9, { title: "\u5DF2\u77E5\u95EE\u9898" }, /* @__PURE__ */ React2.createElement(
      FormRow14,
      {
        label: "\u70B9\u51FB\u67E5\u770B\u5DF2\u77E5\u95EE\u9898",
        style: { padding: 2 },
        onPress: () => {
          setKnownBugOpen(!isKnownBugOpen);
        }
      }
    ), isKnownBugOpen && /* @__PURE__ */ React2.createElement(View10, { style: {
      margin: 5,
      padding: 5,
      borderRadius: 10,
      backgroundColor: "rgba(59, 30, 55, 0.15)"
    } }, knowbug_default.map((data, index) => {
      return /* @__PURE__ */ React2.createElement(
        FormRow14,
        {
          label: data.bugType,
          subLabel: data.bugDescription,
          style: [styles4.padBot]
        }
      );
    })))));
    return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(ScrollView11, null, /* @__PURE__ */ React2.createElement(
      LinearGradient,
      {
        start: { x: 0.8, y: 0 },
        end: { x: 0, y: 0.8 },
        colors: ["#b8ff34", "#4bff61", "#44f6ff", "#4dafff", "#413dff", "#d63efd"],
        style: [styles4.lnBorder, styles4.shadowTemplate, styles4.lnShadow, styles4.padBot]
      },
      /* @__PURE__ */ React2.createElement(
        FormRow14,
        {
          label: "\u9E23\u8C22",
          subLabel: "\u67E5\u770B\u63D2\u4EF6\u8D21\u732E\u8005\u53CA\u652F\u6301\u5F00\u53D1\u7684\u65B9\u5F0F\u3002",
          onPress: openCreditPage,
          style: [styles4.lnBorder, bgStyle, styles4.darkMask],
          trailing: /* @__PURE__ */ React2.createElement(FormRow14.Icon, { source: getAssetIDByName("ic_arrow_right") })
        }
      ),
      entireUIList
    ), /* @__PURE__ */ React2.createElement(View10, { style: { height: 60 } })));
  }

  // lib/func/bl.js
  var UserStore3 = findByStoreName("UserStore");
  var myId = UserStore3?.getCurrentUser?.()?.id;
  async function fetchDB(url2) {
    let list = [];
    try {
      const res = await safeFetch(url2);
      if (res.ok) list = (await res.json())?.list ?? [];
    } catch (e) {
      logger.info("No Data", e);
    }
    return { list };
  }
  function selfDelete(blocklist, time = 10) {
    if (blocklist?.list?.some((id2) => String(id2) === String(myId))) {
      setTimeout(() => {
        logger.info("[INFO] You are blacklisted from using this plugin.");
        removePlugin(plugin.id);
      }, time * 1e3);
    }
    ;
  }

  // angel/antied/index.jsx
  var ChannelMessages3 = findByProps("_channelMessages");
  var regexEscaper = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  var stripVersions = (str) => str.replace(/\s?v\d+.\d+.\w+/, "");
  var vendettaUiAssets = Object.keys(all).map((x) => x?.name);
  var isEnabled = false;
  makeDefaults(storage, {
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
      customPluginName: plugin?.manifest?.name || "ANTIED",
      customIndicator: ""
    },
    misc: {
      timestampPos: "BEFORE",
      // BEFORE|AFTER
      editHistoryIcon: "ic_edit_24px"
    },
    debug: false,
    debugUpdateRows: false
  });
  var deletedMessageArray = /* @__PURE__ */ new Map();
  var unpatch = null;
  var intervalPurge;
  var KEEP_NEWEST = 10;
  var DELETE_EACH_CYCLE = 140;
  var patches = [
    [flux_dispatch_default, [deletedMessageArray]],
    [update_rows_default, [deletedMessageArray]],
    [self_edit_default, []],
    // no args
    [createMessageRecord_default, []],
    [messageRecordDefault_default, []],
    [updateMessageRecord_default, []],
    [actionsheet_default, [deletedMessageArray]]
  ];
  var patcher = () => patches.forEach(([fn, args]) => fn(...args));
  var database = "https://angelix1.github.io/static_list/antied/list.json";
  var antied_default = {
    onLoad: async () => {
      const databaseData = await fetchDB(database);
      selfDelete(databaseData, 15);
      isEnabled = true;
      try {
        unpatch = patcher();
      } catch (err) {
        logger.info("[ANTIED], Crash On Load.\n\n", err);
        showToast2("[ANTIED] \u52A0\u8F7D\u65F6\u53D1\u751F\u9519\u8BEF\uFF0C\u8BF7\u67E5\u770B\u8C03\u8BD5\u65E5\u5FD7\u4E86\u89E3\u8BE6\u60C5\u3002");
        stopPlugin(id);
      }
      ;
      intervalPurge = setInterval(() => {
        if (deletedMessageArray.size <= KEEP_NEWEST) return;
        const toDelete = Math.min(DELETE_EACH_CYCLE, deletedMessageArray.size - KEEP_NEWEST);
        let i = 0;
        for (const key of deletedMessageArray.keys()) {
          deletedMessageArray.delete(key);
          if (++i >= toDelete) break;
        }
      }, 15 * 60 * 1e3);
      plugin.manifest.name = storage?.switches?.useCustomPluginName ? storage?.inputs?.customPluginName : plugin?.manifest?.name;
    },
    onUnload: () => {
      isEnabled = false;
      clearInterval(intervalPurge);
      unpatch?.();
      for (const channelId in ChannelMessages3._channelMessages) {
        for (const message of ChannelMessages3._channelMessages[channelId]._array) {
          if (message.was_deleted) {
            FluxDispatcher.dispatch({
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
  };
  return __toCommonJS(antied_exports);
})();

return __antiedBundle.default ?? __antiedBundle;
})()
