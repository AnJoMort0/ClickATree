              //text bubble + text appear when it is 4 minutes
              //chatgpt code
              if(time <= 5 * 60 && time > 4 * 60){
                if(!this.shownText){
                    let bubble_bear = add([
                        rect(width() - 600, 120, { radius: 32 }),
                        anchor("center"),
                        pos(650, 600),
                        outline(4),
                    ]);
                    let text_bear = add([
                        text("The timer"),
                        pos(450, 560),
                        scale(0.5),
                        color(1, 0, 0),
                    ]);
                    this.shownText = true;
                    onKeyPress("space", () => {
                        destroy(bubble_bear);
                        destroy(text_bear);
                    });
                }
              }
              if(time <=4 * 60 && time > 3 * 60){
                if(!this.shownText2){
                    let bubble_bear2 = add([
                        rect(width() - 600, 120, {radius: 32}),
                        anchor("center"),
                        pos(650, 600),
                        outline(4),
                    ]);
                    let text_bear2 = add([
                        text("is here"),
                        pos(450, 560),
                        scale(0.5),
                        color(1, 0, 0),
                    ]);
                    this.shownText2 = true;
                    onKeyPress("space", () => {
                        destroy(bubble_bear2);
                        destroy(text_bear2);
                    });
                }
              }
              if(time <= 3 * 60 && time > 2 * 60){
                if(!this.shownText3){
                    let bubble_bear3 = add([
                        rect(width() - 600, 120, {radius: 32}),
                        anchor("center"),
                        pos(650, 600),
                        outline(4),
                    ]);
                    let text_bear3 = add([
                        text("Hello, je m'appelle Ours!"),
                        pos(450, 560),
                        scale(0.5),
                        color(1, 0, 0),
                    ]);
                    this.shownText3 = true;
                    onKeyPress("space", () => {
                        destroy(bubble_bear3);
                        destroy(text_bear3);
                    });
                }
              }
              if(time <= 2 * 60 && time > 1 * 60){
                if(!this.shownText4){
                    let bubble_bear4 = add([
                        rect(width() - 600, 120, {radius: 32}),
                        anchor("center"),
                        pos(650, 600),
                        outline(4),
                    ]); 
                    let text_bear4 = add([
                        text("Go, go!"),
                        pos(450, 560),
                        scale(0.5),
                        color(1, 0, 0),
                    ]); 
                    this.shownText4 = true;
                    onKeyPress("space", () => {
                        destroy(bubble_bear4);
                        destroy(text_bear4);
                    });
                }
              }
              if(time <= 1 * 60 && time > 0 * 60){
                if(!this.shownText5){
                    let bubble_bear5 = add([
                        rect(width() - 600, 120, {radius: 32}),
                        anchor("center"),
                        pos(650, 600),
                        outline(4),
                    ]); 
                    let text_bear5 = add([
                        text(`Hurry up!\nClick on as many times as\nyou can on the tree!`),
                        pos(450, 560),
                        scale(0.5),
                        color(1, 0, 0),
                    ]); 
                    this.shownText5 = true;
                    onKeyPress("space", () => {
                        destroy(bubble_bear5);
                        destroy(text_bear5);
                    });
                }
              }