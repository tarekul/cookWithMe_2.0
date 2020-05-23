import Artyom from "artyom.js";

export default class WebSpeech {
  constructor(steps, func) {
    this.jarvis = new Artyom();
    this.steps = steps;
    this.index = 0;
    this.func = func;
  }

  loadCommands = () => {
    return this.jarvis.addCommands([
      {
        indexes: [
          "start",
          "star",
          "tar",
          "tart",
          "art",
          "repeat",
          "repeat the step"
        ],
        action: i => {
          this.jarvis.say(this.steps[this.index], {
            onEnd: () => {
              this.jarvis.ArtyomWebkitSpeechRecognition.abort();
            }
          });
        }
      },
      {
        indexes: ["resume"],
        action: i => {
          this.jarvis.obey();
          this.jarvis.say("Okay resuming");
        }
      },
      {
        indexes: ["restart", "first step", "beginning"],
        action: i => {
          this.func(0, () => {
            this.index = 0;
            this.jarvis.say("Okay restarting");
          });
        }
      },
      {
        indexes: ["pause", "stop"],
        action: i => {
          this.jarvis.dontObey();
        }
      },
      {
        indexes: ["previous", "back", "past", "ack", "prev"],
        action: i => {
          if (this.index - 1 >= 0) {
            this.index = this.index - 1;
            this.func(this.index, () => {
              this.jarvis.say(this.steps[this.index], {
                onEnd: () => {
                  this.jarvis.ArtyomWebkitSpeechRecognition.abort();
                }
              });
              this.jarvis.emptyCommands();
              this.loadCommands();
            });
          } else {
            this.jarvis.say("Their are no more directions");
          }
        }
      },
      {
        indexes: ["next", "text", "test"],
        action: i => {
          if (this.index < this.steps.length - 1) {
            this.index = this.index + 1;
            this.func(this.index, () => {
              this.jarvis.say(this.steps[this.index], {
                onEnd: () => {
                  this.jarvis.ArtyomWebkitSpeechRecognition.abort();
                }
              });
              this.jarvis.emptyCommands();
              this.loadCommands();
            });
          } else {
            this.jarvis.say("Their are no more directions");
          }
        }
      },
      {
        indexes: ["last step", "last"],
        action: i => {
          this.index = this.steps.length - 1;
          this.func(this.index, () => {
            this.jarvis.say("Okay moving to the last step", {
              onEnd: () => {
                this.jarvis.ArtyomWebkitSpeechRecognition.abort();
              }
            });
            this.loadCommands();
          });
        }
      }
    ]);
  };
  startAssistant = () => {
    this.jarvis
      .initialize({
        lang: "en-US",
        debug: true,
        continuous: true,
        obeyKeyword: "resume",
        soundex: true,
        listen: true,
        speed: 0.9
      })
      .catch(err => {
        console.error("Oopsy daisy, this shouldn't happen !", err);
      });
  };

  stopAssistant = () => {
    this.jarvis.fatality().catch(err => {
      console.error("Oopsy daisy, this shouldn't happen neither!", err);
    });
  };
}
