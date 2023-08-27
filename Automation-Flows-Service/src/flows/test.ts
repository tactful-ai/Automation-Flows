import { WebchatFlow, Triggers } from 'automation-sdk';

export function test() {
    const greetingFlow = new WebchatFlow("test", "intern_category","1.0");
    greetingFlow
        .on(Triggers.INTENT, "RESTART")
        .text([
            ['Welcome great internsassfaf to the webchat', 1],
        ])
    return greetingFlow;
}
