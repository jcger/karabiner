import fs from "fs";
import { KarabinerRules } from "./types";
import { createHyperSubLayers, app, open, rectangle } from "./utils";

const rules: KarabinerRules[] = [
  // Define the Hyper key itself
  {
    description: "Hyper Key (⌃⌥⇧⌘)",
    manipulators: [
      {
        description: "Caps Lock -> Hyper Key",
        from: {
          key_code: "caps_lock",
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          {
            set_variable: {
              name: "hyper",
              value: 1,
            },
          },
        ],
        to_after_key_up: [
          {
            set_variable: {
              name: "hyper",
              value: 0,
            },
          },
        ],
        to_if_alone: [
          {
            key_code: "escape",
          },
        ],
        type: "basic",
      },
      {
        type: "basic",
        description: "Disable CMD + Tab to force Hyper Key usage",
        from: {
          key_code: "tab",
          modifiers: {
            mandatory: ["left_command"],
          },
        },
        to: [
          {
            key_code: "tab",
          },
        ],
      },
    ],
  },
  {
    description: "Cmd + Tab once with Hyper + j",
    manipulators: [
      {
        conditions: [
          {
            name: "hyper_sublayer_o",
            type: "variable_if",
            value: 0,
          },
          {
            name: "hyper_sublayer_w",
            type: "variable_if",
            value: 0,
          },
          {
            name: "hyper_sublayer_r",
            type: "variable_if",
            value: 0,
          },
          {
            name: "hyper",
            type: "variable_if",
            value: 1,
          },
        ],
        from: {
          key_code: "j",
        },
        to: [
          {
            key_code: "tab",
            modifiers: ["left_command"],
          },
        ],
        to_after_key_up: [
          {
            set_variable: {
              name: "hyper",
              value: 0
            }
          }
        ],
        type: "basic",
      },
    ],
  },
  ...createHyperSubLayers({
    // "a"pps
    o: {
      b: app("Brave Browser"),
      c: app("Google Calendar"),
      e: app("Visual Studio Code"),
      // s: app("Slack"),
      n: app("Notion"),
      t: app("iTerm"),
      z: app("zoom.us"),
      f: app("Finder"),
      p: app("Spotify"),
      m: app("Gmail"),
    },
    // w = "Window"
    w: {
      y: rectangle("previous-display"),
      o: rectangle("next-display"),
      m: rectangle("maximize"),
      h: {
        description: "Window: Previous Tab",
        to: [
          {
            key_code: "left_arrow",
            modifiers: ["right_option", "right_command"],
          },
        ],
      },
      l: {
        description: "Window: Next Tab",
        to: [
          {
            key_code: "right_arrow",
            modifiers: ["right_option", "right_command"],
          },
        ],
      },
      j: {
        description: "Window: Down Tab",
        to: [
          {
            key_code: "down_arrow",
            modifiers: ["right_option", "right_command"],
          },
        ],
      },
      k: {
        description: "Window: Up Tab",
        to: [
          {
            key_code: "up_arrow",
            modifiers: ["right_option", "right_command"],
          },
        ],
      },
      u: {
        description: "Window: Back",
        to: [
          {
            key_code: "left_arrow",
            modifiers: ["right_command"],
          },
        ],
      },
      i: {
        description: "Window: Forward",
        to: [
          {
            key_code: "right_arrow",
            modifiers: ["right_command"],
          },
        ],
      },
      n: {
        description: "Window: Next Window Same App",
        to: [
          {
            key_code: "grave_accent_and_tilde",
            modifiers: ["right_command"],
          },
        ],
      },
      d: {
        description: "Window: Next display",
        to: [
          {
            key_code: "right_arrow",
            modifiers: ["right_control", "right_option", "right_command"],
          },
        ],
      },
    },

    // v = "moVe" which isn't "m" because we want it to be on the left hand
    // so that hjkl work like they do in vim
    v: {
      h: {
        to: [{ key_code: "left_arrow" }],
      },
      j: {
        to: [{ key_code: "down_arrow" }],
      },
      k: {
        to: [{ key_code: "up_arrow" }],
      },
      l: {
        to: [{ key_code: "right_arrow" }],
      },
    },

    // r = "Raycast"
    r: {
      n: open("raycast://script-commands/dismiss-notifications"),
      e: open(
        "raycast://extensions/raycast/emoji-symbols/search-emoji-symbols"
      ),
      c: open("raycast://extensions/raycast/system/open-camera"),
      p: open("raycast://extensions/raycast/raycast/confetti"),
      h: open(
        "raycast://extensions/raycast/clipboard-history/clipboard-history"
      ),
    },
  }),
];

fs.writeFileSync(
  "karabiner.json",
  JSON.stringify(
    {
      global: {
        show_in_menu_bar: false,
      },
      profiles: [
        {
          name: "Default",
          complex_modifications: {
            rules,
          },
        },
      ],
    },
    null,
    2
  )
);
