export const engineerAct1Dialogue = [
  {
    id: "sop_intro",
    text: "A new shipment just arrived. Business as usual or test that optimization thing?",
    choices: [
      {
        id: "follow_sop",
        text: "Follow SOP",
        result: { stability: 10 },
        response: "Reliable. Maybe boring, but reliable.",
        tags: ["exploit"],
        repeatPenalty: true
      },
      {
        id: "test_algorithm",
        text: "Try new algorithm",
        result: { innovation: 15, stability: -5 },
        response: "Hmm. Might crash everything. Let\s
