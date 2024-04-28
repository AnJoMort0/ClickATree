//IDEAS TO ADD
    //Hide HUD button
    //Timed game mode for the Mystères de l'Unil specifically
    //Add events
    //Can have too many elements - need to be careful
    //Achievements
    //Darker colors at the beginning -> progress saturation the bigger the forest
    //Tree burns when auto-clicker

//KNOWN BUGS
    // When multiple trees overlap, the player gets multiple points in a single click
        //* Fixed it by calling it a feature

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
setGravity(800);
const CLICK_JUMP            = 1.05;
const SPRITE_PIXEL_SIZE     = 25;
const SPRITE_BG_PIXEL_SIZE  = 250;
const SPRITE_BG_SCALE       = 3;
const BG_TILE_SIZE          = SPRITE_BG_PIXEL_SIZE * SPRITE_BG_SCALE;
const BG_Y                  = (H/2)-BG_TILE_SIZE/2 - 30;
const NB_BG_X_TILES         = Math.floor(W/(BG_TILE_SIZE)) + 1;
const NB_BG_Y_TILES         = Math.floor(H/(BG_TILE_SIZE)) + 1;
//z values:
    //const Z_TOP_TREE = 300; //changed to be based on height
    const Z_UI       = H    + 100;
    const Z_UI_TOP   = Z_UI + 1;
//areas
    //buttons on the right side
        const X_BUTTONS         = W - 10;
        const Y_FIRST_BUTTON    = 65;
        const SCALE_BUTTON      = 0.3;
    //relative scale of trees to screen height
        const TREE_SCALE    = 1/1500;

//load assets
loadRoot('assets/');

//load images
    //game elements
        //background
        loadSpriteAtlas("game_elements/background/backgrounds_spritesheet.png", {
            "main_bg": {
                x: 0,
                y: 0,
                width: 1000,
                height: 250,
                sliceX: 4,
                anims: {
                    n: { from: 0, to: 3, speed: 1, loop: true },
                },
            },
            "water_bg": {
                x: 0,
                y: 500,
                width: 1000,
                height: 250,
                sliceX: 4,
                anims: {
                    n: { from: 0, to: 3, speed: 1, loop: true },
                },
            },
            "sky_bg": {
                x: 0,
                y: 250,
                width: 250,
                height: 250,
                sliceX: 1,
                anims: {
                    n: { from: 0, to: 0},
                },
            },
        })
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
    let   time          = 300;
    //prices
        let scaling     = 1.4;
        let new_bt_dist = 130;
        let pr_txt_x    = -95;
        let pr_txt_y    = -20;
        let pr_new_tree = 20;
        let pr_new_bee  = 100;
    //cash/second
        let cps_tree    = 0.1;
        let cps_bee     = 1;
    //number of elements
        let nb_txt_x    = -150;
        let nb_txt_y    = 30;
        let nb_trees    = 1;
        let nb_bees     = 0;

    //UI
    //cash
    const icon_cash = add([
        sprite('leaf0'),
        pos(10, 50),
        scale(1.4),
        anchor('left'),
        z(Z_UI),
        "ui",
     ]);
    const text_cash = add([
        text(formatNumber(cash, {useOrderSuffix: true, decimals: 1}),{
           width : W,
        }),
        pos(icon_cash.pos.x + 50, icon_cash.pos.y),
        anchor(icon_cash.anchor),
        z(Z_UI),
        {
           update(){
              this.text = formatNumber(cash, {useOrderSuffix: true, decimals: 1});
           }
        },
        "ui"
     ]);
    //cash/second
     const text_cash_per_sec = add([
        text(formatNumber(cash_per_sec, {useOrderSuffix: true, decimals: 1}) + "/s",{
            size    : 24,
            width   : W,
        }),
        pos(text_cash.pos.x, text_cash.pos.y + 35),
        anchor(text_cash.anchor),
        z(Z_UI),
        {
            update(){
                this.text = formatNumber(cash_per_sec, {useOrderSuffix: true, decimals: 1}) + "/s";
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
    //timer
    const text_time = add([
        text(`Time left : ${time}`,{
           width : width(),
        }),
        //position right next to Score
        pos(text_score.pos.x, text_score.pos.y - 30),
        anchor("left"),
        z(Z_UI),
        {
           update(){
            //minus 1 second 
            time -= dt();
            if(time <= 0){
                //if time reaches 0 or less, set time to 0
                time = 0;
                //takes you to game over screen :)
                go("pauseMenu");
                //gameOver();
            }
              this.text = `Time left : ` + fancyTimeFormat(time);
           }
        },
       "ui"
    ]);

    //BACKGROUND
     //adding the background dynamically to the screen size
     for (let i = 0; i < NB_BG_X_TILES; i++) {
        const bg = add([
            sprite("main_bg"),
            pos((BG_TILE_SIZE) * i, BG_Y),
            scale(SPRITE_BG_SCALE),
            "bg",
         ]);
         bg.play("n");
     }
     if (H > BG_TILE_SIZE) {
        for (let j = 1; j <= NB_BG_Y_TILES; j++) {
            for (let i = 0; i < NB_BG_X_TILES; i++) {
                const bg = add([
                    sprite("sky_bg"),
                    pos((BG_TILE_SIZE) * i, BG_Y - ((BG_TILE_SIZE)*j)),
                    scale(SPRITE_BG_SCALE),
                    "bg",
                 ]);
                 bg.play("n");
             }
        }
        for (let j = 1; j <= NB_BG_Y_TILES; j++) {
            for (let i = 0; i < NB_BG_X_TILES; i++) {
                const bg = add([
                    sprite("water_bg"),
                    pos((BG_TILE_SIZE) * i, BG_Y + ((BG_TILE_SIZE)*j)),
                    scale(SPRITE_BG_SCALE),
                    "bg",
                 ]);
                 bg.play("n");
             }
        }
     }

    //BUTTONS TO ADD NEW ELEMENTS (maybe add a onScroll for these elements)
     //adding a new tree button
     const new_tree = add([
        sprite('new_tree'),
        pos(W - 10, 75),
        scale(SCALE_BUTTON),
        anchor("right"),
        area(),
        z(Z_UI),
        "ui",
        "button",
        "new_button",
        "new_tree",
     ])
     const text_new_tree_price = add([
        text(formatNumber(pr_new_tree, {useOrderSuffix: true, decimals: 1})),
        {
            update(){
            this.text = formatNumber(pr_new_tree, {useOrderSuffix: true, decimals: 1});
            }
        },
        pos(new_tree.pos.x + pr_txt_x, new_tree.pos.y + pr_txt_y),
        anchor(new_tree.anchor),
        z(Z_UI_TOP),
     ])
     const text_nb_trees = add([
        text(formatNumber(nb_trees, {useOrderSuffix: true})),
        {
            update(){
            this.text = formatNumber(nb_trees, {useOrderSuffix: true});
            }
        },
        pos(new_tree.pos.x + nb_txt_x, new_tree.pos.y + nb_txt_y),
        anchor(new_tree.anchor),
        z(Z_UI_TOP),
     ])
    //adding a new bee button
     const new_bee = add([
        sprite('new_bee'),
        pos(new_tree.pos.x, new_tree.pos.y + new_bt_dist),
        scale(SCALE_BUTTON),
        anchor(new_tree.anchor),
        area(),
        z(Z_UI),
        "ui",
        "button",
        "new_button",
        "new_bee",
     ])
     const text_new_bee_price = add([
        text(formatNumber(pr_new_bee, {useOrderSuffix: true, decimals: 1})),
        {
            update(){
            this.text = formatNumber(pr_new_bee, {useOrderSuffix: true, decimals: 1});
            }
        },
        pos(new_bee.pos.x + pr_txt_x, new_bee.pos.y + pr_txt_y),
        anchor(new_bee.anchor),
        z(Z_UI_TOP),
     ])
     const text_nb_bees = add([
        text(formatNumber(nb_bees, {useOrderSuffix: true})),
        {
            update(){
            this.text = formatNumber(nb_bees, {useOrderSuffix: true});
            }
        },
        pos(new_bee.pos.x + nb_txt_x, new_bee.pos.y + nb_txt_y),
        anchor(new_bee.anchor),
        z(Z_UI_TOP),
     ])

    //ADDING OBJECTS
        //adding starting tree
        let y_st = H/2
        const start_tree = add([
        sprite(`tree0`),
        pos(vec2(W/2,y_st)),
        scale(y_st * TREE_SCALE),
        anchor("center"),
        area(),
        z(y_st),
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
                    z(t.pos.y),
                    sprite(choose(leafs)),
                    anchor("center"),
                    scale(rand(0.8, 0.4)),
                    area({ collisionIgnore:["leaf_particle"]}),
                    body(),
                    lifespan(0.5, {fade: 0.2}),
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
         let ranA = H/2 - 60;
         let ranB = 0;
         if(H < BG_TILE_SIZE){
            ranB = H - 120;
         } else {
            ranB = H/2 + 200;
         };
         const randX  = rand(0, X_BUTTONS);
         const randY  = rand(ranA, ranB);
         //const relScale = 0.1 + (0.5 - 0.1) * ((this.pos.y - ranA) / (ranB - ranA)); //relative scale to the Y position
         const tree  = add([
             sprite(choose(trees)),
             pos(randX, randY),
             scale(randY * TREE_SCALE),
             anchor("center"),
             area(),
             z(randY),
             "tree",
          ])
            pay(pr_new_tree);
            nb_trees     = nb_trees + 1;
            //exp(pr_new_tree); //PK çA MARCHE PAS??????
            pr_new_tree = pr_new_tree * scaling;
            cps(cps_tree);
       }
       //Add a new bee
       function addBee(){
        const bee = add([
            sprite('bee'),
            pos(rand(0, W), rand(0, H)),
            scale(1),
            anchor('center'),
            area(),
            z(this.pos.y),
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
            nb_bees     = nb_bees + 1;
            //change with function
            pr_new_bee  = pr_new_bee * scaling;
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
        onKeyRelease("'" , () => {
            cash = cash + 99;
        })
})

scene("pauseMenu", () => {
    add([
		text("you lose!"),
		pos(width() / 2, height() / 2 + 108),
		scale(1),
		anchor("center"),
	])
    onKeyPress("space", () => go("game"))
	onClick(() => go("game"))
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

    //NEED TO REF IN READ.ME: https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900/63066148 (answered Jul 4, 2019 at 20:48 by MarredCheese)
    /*
    * Return the given number as a formatted string.  The default format is a plain
    * integer with thousands-separator commas.  The optional parameters facilitate
    * other formats:
    *   - decimals = the number of decimals places to round to and show
    *   - valueIfNaN = the value to show for non-numeric input
    *   - style
    *     - '%': multiplies by 100 and appends a percent symbol
    *     - '$': prepends a dollar sign
    *   - useOrderSuffix = whether to use suffixes like k for 1,000, etc.
    *   - orderSuffixes = the list of suffixes to use
    *   - minOrder and maxOrder allow the order to be constrained.  Examples:
    *     - minOrder = 1 means the k suffix should be used for numbers < 1,000
    *     - maxOrder = 1 means the k suffix should be used for numbers >= 1,000,000
    * 
    * Features
        Option to use order suffixes (k, M, etc.)
        Option to specify a custom list of order suffixes to use
        Option to constrain the min and max order
        Control over the number of decimal places
        Automatic order-separating commas
        Optional percent or dollar formatting
        Control over what to return in the case of non-numeric input
        Works on negative and infinite numbers

    * Example:
        let x = 1234567.8;
        formatNumber(x);  // '1,234,568'
        formatNumber(x, {useOrderSuffix: true});  // '1M'
        formatNumber(x, {useOrderSuffix: true, decimals: 3, maxOrder: 1});  // '1,234.568k'
        formatNumber(x, {decimals: 2, style: '$'});  // '$1,234,567.80'

        x = 10.615;
        formatNumber(x, {style: '%'});  // '1,062%'
        formatNumber(x, {useOrderSuffix: true, decimals: 1, style: '%'});  // '1.1k%'
        formatNumber(x, {useOrderSuffix: true, decimals: 5, style: '%', minOrder: 2});  // '0.00106M%'

        formatNumber(-Infinity);  // '-∞'
        formatNumber(NaN);  // ''
        formatNumber(NaN, {valueIfNaN: NaN});  // NaN
    */
    function formatNumber(number, {
        decimals = 0,
        valueIfNaN = '',
        style = '',
        useOrderSuffix = false,
        orderSuffixes = ['', 'k', 'M', 'B', 'T'],
        minOrder = 0,
        maxOrder = Infinity
    } = {}) {

    let x = parseFloat(number);

    if (isNaN(x))
        return valueIfNaN;

    if (style === '%')
        x *= 100.0;

    let order;
    if (!isFinite(x) || !useOrderSuffix)
        order = 0;
    else if (minOrder === maxOrder)
        order = minOrder;
    else {
        const unboundedOrder = Math.floor(Math.log10(Math.abs(x)) / 3);
        order = Math.max(
        0,
        minOrder,
        Math.min(unboundedOrder, maxOrder, orderSuffixes.length - 1)
        );
    }

    const orderSuffix = orderSuffixes[order];
    if (order !== 0)
        x /= Math.pow(10, order * 3);

    return (style === '$' ? '$' : '') +
        x.toLocaleString(
        'fr-CH',    //need to change that if multiple languages selection
        {
            style: 'decimal',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }
        ) +
        orderSuffix +
        (style === '%' ? '%' : '');
    }

    //NEED REF IN READ.ME: https://stackoverflow.com/a/11486026 (answered Jul 14, 2012 at 20:48 by Vishal)
    function fancyTimeFormat(duration) {
        // Hours, minutes and seconds
        const hrs = ~~(duration / 3600);
        const mins = ~~((duration % 3600) / 60);
        const secs = ~~duration % 60;
      
        // Output like "1:01" or "4:03:59" or "123:03:59"
        let ret = "";
      
        if (hrs > 0) {
          ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }
      
        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
      
        return ret;
      }
      