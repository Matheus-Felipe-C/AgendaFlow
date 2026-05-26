// plugin.js
// The build step generates this file from the compiled Svelte output.
// Commit it; the GitHub→Amplenote plugin will bundle it into the note.
import getSidebarHTML from "./counter-embed.js";

const plugin = {

  settings: {
    day_tag: app.settings['day-tag'] ?? null
  },

  // ── Trigger: adds "Counter" to the quick-open menu ─────────────────────
  appOption: {
    "Counter": {
      async run(app) {
        await app.openSidebarEmbed(1 /* aspect ratio – ignored for sidebar */);
      },
    },
  },

  // ── Also insertable inline in a note ───────────────────────────────────
  insertText: {
    "Insert counter": {
      async run(app) {
        await app.context.replaceSelection(
          `<object data="plugin://${app.context.pluginUUID}" data-aspect-ratio="1" />`
        );
        return null;
      },
    },
  },

  // ── Renders the Svelte app inside the embed iFrame ─────────────────────
  renderEmbed(app, ...args) {
    return getSidebarHTML();
  },

  // ── Receives calls from window.callAmplenotePlugin() in the embed ───────
  async onEmbedCall(app, action, ...args) {
    switch (action) {
      case "getTasks": {
        const notes = await app.filterNotes();
        const allTasks = [];

        for (const note of notes) {
          const tasks = await app.getNoteTasks({ uuid: note.uuid})
          allTasks.push(...tasks);
        }

        return allTasks;
      }
      default:
        throw Error(`Could not find action "${action}", please fix this before releasing the build`);
    }
  }
};

export default plugin;