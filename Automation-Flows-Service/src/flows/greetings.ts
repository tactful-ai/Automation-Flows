import { WebchatFlow, Triggers } from 'automation-sdk';

export function webchatGreet() {
    const greetingFlow = new WebchatFlow("welcome", "intern_greeting");
    greetingFlow
        .on(Triggers.INTENT, "GREETINGS")
        .text([
            ['Welcome great interns to the webchat', 1],
        ])
    return greetingFlow;
}
