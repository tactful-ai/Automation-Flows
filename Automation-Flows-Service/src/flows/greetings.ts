import { WebchatFlow, Triggers } from 'automation-sdk';

export function webchatGreet() {
    const greetingFlow = new WebchatFlow("welcome", "intern_category","1.0");
    greetingFlow
        .on(Triggers.INTENT, "GREETINGS")
        .text([
            ['Welcome great interns to the webchat', 1],
        ])
        .fire(Triggers.INTENT,"mainFlow")
        // .fire(Triggers.INTENT,"mainUserChoice")

    return greetingFlow;
}
