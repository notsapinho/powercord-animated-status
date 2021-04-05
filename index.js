const { getModule, React } = require("powercord/webpack");
const { Plugin } = require("powercord/entities");
const updateRemoteSettings = getModule(["updateRemoteSettings"], false);
const Settings = require("./components/Settings");

module.exports = class AnimatedStatus extends Plugin {
    async startPlugin() {
        this.loadStylesheet("./style.css");

        this.defaults = {
            rate: 10000,
            currentAnimationIndex: 0,
            animations: [
                {
                    text: "Hello",
                    emoji: {
                        name: "👋",
                        id: null
                    }
                },
                {
                    text: "World!",
                    emoji: {
                        name: "👋",
                        id: null
                    }
                }
            ]
        };

        powercord.api.settings.registerSettings("animated-status", {
            category: this.entityID,
            label: "Animated Status",

            render: (props) =>
                React.createElement(Settings, {
                    ...props,
                    createInterval: () => this.createInterval(),
                    cycle: () => this.cycle(),
                    defaults: this.defaults
                })
        });

        this.createInterval();
        this.cycle();
    }

    createInterval() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.cycle();
        }, this.settings.get("rate", this.defaults.rate));
    }

    cycle() {
        const animations = this.settings.get("animations", this.defaults.animations);
        let currentAnimation = animations[this.settings.get("currentAnimationIndex", this.defaults.currentAnimationIndex)];

        if (!currentAnimation) {
            this.settings.set("currentAnimationIndex", this.defaults.currentAnimationIndex);
            currentAnimation = animations[this.settings.get("currentAnimationIndex", this.defaults.currentAnimationIndex)];
        }

        this.setStatus({
            text: currentAnimation.text,
            emojiName: currentAnimation.emoji.name,
            emojiId: currentAnimation.emoji.id
        });

        this.settings.set("currentAnimationIndex", this.settings.get("currentAnimationIndex", this.defaults.currentAnimationIndex) + 1);
    }

    setStatus({ text, emojiName, emojiId }) {
        updateRemoteSettings.updateRemoteSettings({
            customStatus: {
                text,
                emojiName,
                emojiId
            }
        });
    }

    pluginWillUnload() {
        clearInterval(this.interval);
        powercord.api.settings.unregisterSettings("animated-status");
    }
};
