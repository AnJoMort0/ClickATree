//IDEAS TO ADD
    //Hide HUD button
    //Timed game mode for the Mystères de l'Unil specifically
    //Tree burns when auto-clicker

//===================================================================//
//===================================================================//

kaboom({
    background  : [0, 0, 0],
    width       : window.innerWidth,
    height      : window.innerHeight,
    letterbox   : true,
})

//static values
const W = width();
const H = height();
const SPRITE_PIXEL_SIZE = 25;
setGravity(800);
const CLICK_JUMP        = 1.05;
//z values:
    const Z_TOP_TREE = 300; //changed to be based on height
    const Z_UI       = H    + 100;
    const Z_UI_TOP   = Z_UI + 1;
//areas
    //buttons on the right side
        const X_BUTTONS         = W - 10;
        const Y_FIRST_BUTTON    = 65;
    //area to spawn trees
        const X_FIRST_TREE  = W/2;
        const Y_FIRST_TREE  = H/2 * 0.75;
        const X_1_TREES     = 0;
        const X_2_TREES     = X_BUTTONS - 10;
        const Y_1_TREES     = H/3;
        const Y_2_TREES     = Y_FIRST_TREE - 1;

//load assets
loadRoot('assets/');

//load images
    //game elements
        //background
        loadSprite("bg","game_elements/background/backgrounds_spritesheet.png"),{
            sliceX: 4,
            sliceY: 3,
            anims :{
                main :{
                    from    : 0,
                    to      : 3,
                    speed   : 1,
                    loop    : true,
                },
                sky :{
                    from    : 4,
                    to      : 4,
                    speed   : 0,
                    loop    : false,
                },
                water :{
                    from    : 8,
                    to      : 11,
                    speed   : 0,
                    loop    : true,
                },
            },
        };
        //trees
        loadSprite('tree0',"game_elements/trees/tree0.png");
        loadSprite('tree1',"game_elements/trees/tree1.png");
        const trees = ["tree0", "tree1"];
        //leafs
        loadSprite('leaf0', "game_elements/leafs/leaf0.png");
        loadSprite('leaf1', "game_elements/leafs/leaf1.png");
        const leafs = ["leaf0", "leaf1"];
        leafs.forEach((spr) => {
            loadSprite(spr, `game_elements/leafs/${spr}.png`);
        })
        //other
        loadSprite('bee', 'game_elements/other/bee.png');
    //ui elements
        //new buttons
        loadSprite('new_tree', "ui/new_buttons/new_tree_button.png");
        loadSprite('new_bee', "ui/new_buttons/new_bee_button.png")
//load ui sounds
    //loadSound('button_click',"audio/other/click.wav");
//load sfx
    //loadSound('birds_bg',"audio/sfx/birds.wav");
//load music
    //loadSound('default_music',"audio/music/default.wav");

//============================//

//SCENES

scene("startMenu", () => {

})

scene("game", () => {
    //DECLARING VARIABLES
    let cash            = 0;
    let score           = 0;
    let cash_per_sec    = 0;
    //prices
        let scaling     = 1.4;
        let pr_new_tree = 20;
        let pr_new_bee  = 100;
    //cash/second
        let cps_tree    = 0.1;
        let cps_bee     = 1;

    //UI
    //cash
    const icon_cash = add([
        sprite('leaf0'),
        pos(10, 50),
        scale(0.03),
        anchor('left'),
        z(Z_UI),
        "ui",
     ]);
    const text_cash = add([
        text(Math.floor(cash),{
           width : W,
        }),
        pos(icon_cash.pos.x + 60, icon_cash.pos.y),
        anchor(icon_cash.anchor),
        z(Z_UI),
        {
           update(){
              this.text = Math.floor(cash);
           }
        },
        "ui"
     ]);
    //cash/second
     const text_cash_per_sec = add([
        text(`${Math.round(cash_per_sec * 10) / 10}/s`,{
            size    : 24,
            width   : W,
        }),
        pos(text_cash.pos.x, text_cash.pos.y + 35),
        anchor(text_cash.anchor),
        z(Z_UI),
        {
            update(){
                this.text = `${Math.round(cash_per_sec * 10) / 10}/s`;
            }
        },
        "ui",
     ])

    //score
    const text_score = add([
        text(`Score : ${Math.floor(score)}`,{
           width : W,
        }),
        pos(15, H - 30),
        anchor("left"),
        z(Z_UI),
        {
           update(){
              this.text = `Score : ${Math.floor(score)}`;
           }
        },
       "ui"
    ]);

    //BACKGROUND
     //adding the background dynamically to the screen size
     const bg = add([
        sprite("bg"),
        pos(0, 0),
     ]);
     bg.play("main");

    //BUTTONS TO ADD NEW ELEMENTS (maybe add a onScroll for these elements)
     //adding a new tree button
     const new_tree = add([
        sprite('new_tree'),
        pos(W - 10, 75),
        scale(1),
        anchor("right"),
        area(),
        z(Z_UI),
        "ui",
        "button",
        "new_button",
        "new_tree",
     ])
     const text_new_tree_price = add([
        text(Math.floor(pr_new_tree)),
        {
            update(){
            this.text = Math.floor(pr_new_tree);
            }
        },
        pos(new_tree.pos.x - 95, new_tree.pos.y - 20),
        anchor(new_tree.anchor),
        z(Z_UI_TOP),
     ])
    //adding a new bee button
     const new_bee = add([
        sprite('new_bee'),
        pos(new_tree.pos.x, new_tree.pos.y + 130),
        scale(0.9),
        anchor(new_tree.anchor),
        area(),
        z(Z_UI),
        "ui",
        "button",
        "new_button",
        "new_bee",
     ])
     const text_new_bee_price = add([
        text(Math.floor(pr_new_bee)),
        {
            update(){
            this.text = Math.floor(pr_new_bee);
            }
        },
        pos(new_bee.pos.x - 95, new_bee.pos.y - 20),
        anchor(new_bee.anchor),
        z(Z_UI_TOP),
     ])

    //ADDING OBJECTS
        //adding starting tree
        const start_tree = add([
        sprite(`tree0`),
        pos(vec2(W/2, H/2)),
        scale(0.5),
        anchor("center"),
        area(),
        z(this.pos.y),
        "tree",
        "clickable",
        "start_tree",
        cps(cps_tree),
    ]);

    //ADDING EVENT LISTENERS
    //Game elements
        //click the starting tree
        onClick("tree", (t) => { 
            plus(1);
            //particles when clicked
            for (let i = 0; i < rand(1,3); i++) {
                const leaf_particle = add([
                    pos(mousePos()),
                    sprite(choose(leafs)),
                    anchor("center"),
                    scale(rand(0.8, 0.2)),
                    area({ collisionIgnore:["leaf_particle"]}),
                    body(),
                    lifespan(0.7, {fade: 0.3}),
                    opacity(1),
                    move(choose([LEFT, RIGHT]), rand(30, 150)),
                    rotate(rand(0, 360)),
                    offscreen({destroy: true}),
                    "leaf_particle",
                ])
                leaf_particle.jump(rand(200, 440))
            }
            zoomOut(t);
        })
    
    //Animations
        //bee moving
        //get("bee").forEach(bee => {
            /*console.log(bee);
            bee.onStateEnter("idle", async () => {
                await wait(rand(0,10))
                bee.enterState("move")
            })
            bee.onStateEnter("move", async () => {
                await wait(3) //instead of this I need to change to when colliding with a tree
                bee.enterState("idle")
            })
            bee.onStateUpdate("move", () => {
                let target = choose(get("tree"));
                console.log(target);
                const dir = target.pos.sub(bee.pos).unit();
                bee.move(dir.scale(rand(100-200)));
            })
            bee.onStateUpdate("idle", () => {
                bee.move(100, 100);
            })*/
        //})
        loop(rand(3,20), () => {
            get("bee").forEach(bee => {
                wait(rand(0,5), () => {
                    let target = choose(get("tree"));
                    bee.moveTo(target.pos.x, target.pos.y);
                })
            });
        })
            
    
    //UI elements
        //click any button
        onClick("button", (b) => {
            zoomIn(b);
        })

        //New itens buttons
            //New tree
            onClick("new_tree", (t) =>{
                if(cash < pr_new_tree){
                    warning(text_cash);
                    warning(text_new_tree_price);
                } else {
                    addTree();
                }
            })
            //New bee
            onClick("new_bee", (t) =>{
                if(cash < pr_new_bee){
                    warning(text_cash);
                    warning(text_new_bee_price);
                } else {
                    addBee();
                }
            })

    //AUTOMATIC STUFF
       //Each element gives cash overtime
       loop(1, () => {
            plus(cash_per_sec);
       })

    //FUNCTIONS
        //Add a new tree
       function addTree() {
         const tree = add([
             sprite(choose(trees)),
             pos(rand(0, W), rand(H/3, H-100)),
             scale(rand(0.1, 0.23)),
             anchor("center"),
             area(),
             z(1),
             "tree",
          ])
            pay(pr_new_tree);
            //exp(pr_new_tree); //PK çA MARCHE PAS??????
            pr_new_tree = pr_new_tree * scaling;
            cps(cps_tree);
       }
       //Add a new bee
       function addBee(){
        const bee = add([
            sprite('bee'),
            pos(rand(0, W), rand(0, H)),
            scale(0.2),
            anchor('center'),
            area(),
            z(Z_TOP_TREE),
            /*state("move", [ "idle", "move" ]),
            this.onStateEnter("idle", async () => {
                await wait(rand(0,10))
                this.enterState("move")
            }),
            this.onStateEnter("move", async () => {
                await wait(3) //instead of this I need to change to when colliding with a tree
                this.enterState("idle")
            }),
            this.onStateUpdate("move", () => {
                let target = choose(get("tree"));
                console.log(target);
                const dir = target.pos.sub(this.pos).unit();
                this.move(dir.scale(rand(100-200)));
            }),
            this.onStateUpdate("idle", () => {
                this.move(100, 100);
            }),*/
            "bee",
        ])
            pay(pr_new_bee);
            //change with function
            pr_new_bee = pr_new_bee * scaling;
            cps(cps_bee);
       }

       //General Functions
        //Add to score and cash
        function plus(x){
            cash    = cash  + x;
            score   = score + x;
        }

        //Pay with cash
        function pay(x){
            cash = cash - x;
        }

        //Exponentially scale price
        function exp(x){
            console.log(x);
            x = x * scaling;
            console.log(x);
        }

        //Increase cash per second
        function cps(x){
            cash_per_sec = cash_per_sec + x;
        }

        onKeyRelease("t", () => {
            console.log(get("tree"));
        })
        //Debug
        onKeyRelease("d", () => {
            if(debug.inspect != true){
                debug.inspect = true;
            } else {
                debug.inspect = false;
            }
        })
        //Money Cheat
        onKeyDown("0" ,() => {
            cash = cash + 9999999999;
        })
})

scene("pauseMenu", () => {

})

go('game');

//GENERAL FUNCTIONS
    //Zoom out
    function zoomOut(t){
        t.width  = t.width   * CLICK_JUMP;
        t.height = t.height  * CLICK_JUMP;            
        wait(0.1, () => {
            t.width  = t.width  / CLICK_JUMP;
            t.height = t.height / CLICK_JUMP;
        })
    }
    //Zoom in
   function zoomIn(t){
        t.width  = t.width   / CLICK_JUMP;
        t.height = t.height  / CLICK_JUMP;            
        wait(0.1, () => {
            t.width  = t.width  * CLICK_JUMP;
            t.height = t.height * CLICK_JUMP;
        })
    }
    //Warning in red
    function warning(t){
        shake(1);
        t.color = rgb (255, 0, 0);
        wait(0.5, () =>{
            t.color = '';
        })
    }