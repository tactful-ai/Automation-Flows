import { WebchatFlow, Triggers } from 'automation-sdk';

export function webchatGreet() {
    const greetingFlow = new WebchatFlow("greeting", "sdk");
    greetingFlow
        .on(Triggers.INTENT, "GREETINGS")
        .text([
            ['Welcome great interns from webchat', 1],
        ])
    return greetingFlow;
}
