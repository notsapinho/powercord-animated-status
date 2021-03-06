const { React, getModuleByDisplayName } = require("powercord/webpack");
const { AsyncComponent, Button, FormTitle } = require("powercord/components");
const { SliderInput } = require("powercord/components/settings");
const Input = AsyncComponent.from(getModuleByDisplayName("TextInput"));

module.exports = class Settings extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { getSetting, updateSetting, defaults, cycle, createInterval } = this.props;

        return (
            <div className="flex flex-col space-y-4">
                <SliderInput
                    minValue={1000}
                    maxValue={60000}
                    markers={[1000, 5000, 10000, 15000, 20000, 30000, 40000, 50000, 60000]}
                    defaultValue={defaults.rate}
                    initialValue={getSetting("rate", defaults.rate)}
                    onValueChange={(val) => {
                        updateSetting("rate", Math.round(val * 10) / 10);
                        cycle();
                        createInterval();
                    }}
                    onValueRender={(v) => `${(Math.round(v / 100) / 10).toFixed(1)}s`}
                    onMarkerRender={(v) => `${(Math.round(v / 100) / 10).toFixed(1)}s`}
                >
                    Update rate
                </SliderInput>

                <FormTitle>Animations</FormTitle>
                {getSetting("animations", defaults.animations).map((setting, i) => {
                    return (
                        <div className="flex items-center space-x-4">
                            <Input
                                placeholder="Text"
                                onChange={(val) => {
                                    const animations = getSetting("animations", defaults.animations);
                                    animations[i].text = val;
                                    updateSetting("animations", animations);
                                }}
                                value={setting.text}
                            />
                            <Input
                                placeholder="Emoji Name"
                                onChange={(val) => {
                                    const animations = getSetting("animations", defaults.animations);
                                    animations[i].emoji.name = val;
                                    updateSetting("animations", animations);
                                }}
                                value={setting.emoji.name}
                            />
                            <Input
                                placeholder="Emoji ID (Only custom emojis)"
                                onChange={(val) => {
                                    const animations = getSetting("animations", defaults.animations);
                                    animations[i].emoji.id = val;
                                    updateSetting("animations", animations);
                                }}
                                value={setting.emoji.id}
                            />
                        </div>
                    );
                })}
                <div className="flex items-center space-x-2">
                    <Button
                        color={Button.Colors.GREEN}
                        onClick={() => {
                            const animations = getSetting("animations", defaults.animations);

                            animations.push({
                                text: "",
                                emoji: {
                                    name: "",
                                    id: null
                                }
                            });

                            updateSetting("animations", animations);

                            cycle();
                            createInterval();
                        }}
                    >
                        Add
                    </Button>
                    <Button
                        color={Button.Colors.RED}
                        onClick={() => {
                            const animations = getSetting("animations", defaults.animations);

                            animations.pop();

                            updateSetting("animations", animations);

                            cycle();
                            createInterval();
                        }}
                    >
                        Remove
                    </Button>
                </div>
            </div>
        );
    }
};
