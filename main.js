//IDEAS TO ADD
    //Timed game mode for the Mystères de l'Unil specifically --> need to add the menu and change values depending on choosen game mode (add kid mode and adult mode as well)
    //Add events
    //Can have too many elements - need to be careful
    //Achievements
    //Darker colors at the beginning -> progress saturation the bigger the forest
    //Increase fire event when auto-clicker
    //Have all scales depend on screen size
    //Hide HUD button

//KNOWN BUGS
    // When multiple trees overlap, the player gets multiple points in a single click
        //* Fixed it by calling it a feature
    //You can continue clicking the trees and placing them even when the time stops
        //* Fixed

//Add to README
    //2 function codes down the js page
    //Smoke spritesheet : https://miguelnero.itch.io/particle-smoke
    //Bird spritesheet : https://rmazanek.itch.io/bird

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
const CLICK_JUMP                = 1.05;

const SPRITE_PIXEL_SIZE         = 25;
const SPRITE_ICON_SCALE         = 1.4;
const ICON_SIZE                 = SPRITE_PIXEL_SIZE * SPRITE_ICON_SCALE;
const SPRITE_BG_PIXEL_SIZE      = 250;
const SPRITE_BG_SCALE           = 3;
const BG_TILE_SIZE              = SPRITE_BG_PIXEL_SIZE * SPRITE_BG_SCALE;
const SPRITE_BUTTON_PIXEL_SIZE  = 400;
const SPRITE_BUTTON_SCALE       = 0.2;
const BUTTON_SIZE               = SPRITE_BUTTON_PIXEL_SIZE * SPRITE_BUTTON_SCALE;
const BUTTON_PRICE_TXT_SCALE    = 1.5;
const BUTTON_NB_TXT_SCALE       = 1.3;
const BG_Y                      = H/2;
const NB_BG_X_TILES             = Math.floor(W/(BG_TILE_SIZE)) + 1;
const NB_BG_Y_TILES             = Math.floor(H/(BG_TILE_SIZE)) + 1;
const BEAR_SCALE                = 6;
const BEAR_SMALL_SCALE          = BEAR_SCALE/1.5;
//z values:
    //const Z_TOP_TREE = 300; //changed to be based on height
    const Z_UI        = H    + 125;
    const Z_UI_TOP    = Z_UI + 1;
    const Z_UI_BOTTOM = Z_UI - 1;
//relative scale of objects to screen height
    const TREE_SCALE        = 1/100; 
    const TRASH_SCALE       = 3;
    const BULLDOZER_SCALE   = 1/80;
    const BIRD_SCALE        = 1/320;
//speed of moving elements
    const BULLDOZER_SPEED   = 50;
    const BIRD_SPEED        = 40;

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
        loadSprite('tree2',"game_elements/trees/tree2.png");
        loadSprite('tree3',"game_elements/trees/tree3.png");
        const trees = ["tree0", "tree1", "tree2", "tree3"];
        //leafs
        loadSprite('leaf0', "game_elements/leafs/leaf0.png");
        loadSprite('leaf1', "game_elements/leafs/leaf1.png");
        const leafs = ["leaf0", "leaf1"];
        leafs.forEach((spr) => {
            loadSprite(spr, `game_elements/leafs/${spr}.png`);
        })
        //others
        loadSprite('bee', 'game_elements/other/bee.png');
        loadSprite('trash', 'game_elements/other/trashcan_.png')
        loadSprite('bulldozer', 'game_elements/other/bulldozer.png')
        loadSprite('bird', 'game_elements/other/bird.png', { //this one is not ours so the format is not the same, so not in the big game spritesheet
            sliceX: 11,
            sliceY: 8,
            anims: {
                explode:    {from: 0 ,to: 7 ,loop: false},
                iddle:      {from: 11,to: 19,loop: true},
                iddle2:     {from: 22,to: 29,loop: true},
                eat:        {from: 33,to: 40,loop: false},
                hop:        {from: 44,to: 49,loop: false},
                takeoff:    {from: 55,to: 65,loop: false},
                fly:        {from: 66,to: 74,loop: true},
                land:       {from: 77,to: 83,loop: false},
            },
        })
        //bear
        loadSprite('bear', 'game_elements/bear/bear.png');
        loadSprite('bear_scared', 'game_elements/bear/bear_scared.png');
        loadSprite('bear_wink', 'game_elements/bear/bear_wink.png');
        //vfx
        loadSprite('smoke', 'game_elements/vfx/smoke.png', { //this one is not ours so the format is not the same, so not in the big game spritesheet
            sliceX: 3,
            sliceY: 3,
            anims: {
                main: {from: 0,to: 6,},
            },
        })
    //ui elements
        //icons
        loadSpriteAtlas("ui/status_icons/icons_spritesheet.png", {
            "pollution_icon" : {
                x: 0,
                y: 0,
                width: 25,
                height: 25,
            },
            "defo_icon" : {
                x: 0,
                y: 25,
                width: 25,
                height: 25,
            },
            "fire_icon" : {
                x: 0,
                y: 50,
                width: 25,
                height: 25,
            }
        })
        //new buttons
        loadSprite('new_tree', "ui/new_buttons/new_tree_button.png");
        loadSprite('new_bee', "ui/new_buttons/new_bee_button.png");
//load ui sounds
    //loadSound('button_click',"audio/other/click.wav"): by Nathan Gibson https://nathangibson.myportfolio.com 
    loadSound('button_click', "audio/other/button/click.wav");
    //by FilmCow https://filmcow.itch.io/filmcow-sfx
    loadSound('tree_fall',"audio/other/deforestation/tree_fall.wav");
    //by Diablo Luna https://pudretediablo.itch.io/butterfly
    loadSound('fire',"audio/other/fire/fire.wav");
//load sfx
        //by Diablo Luna https://pudretediablo.itch.io/butterfly
    loadSound('birds_bg',"audio/sfx/birds/bird.wav");
//load music: by mayragandra https://mayragandra.itch.io/freeambientmusic 
    loadSound('default_music',"audio/music/music.wav");

//============================//

//SCENES

scene("startMenu", () => {
})


scene("game", () => {
    //DECLARING CONSTANTS
     //Areas
        //new buttons
         const X_BUTTONS         = W - 10;
         const Y_FIRST_BUTTON    = 65;
        //cash
         const CASHBOX  = add([anchor("center"),pos(W/2 ,30)  ,z(Z_UI_BOTTOM),"ui"]);
         const SCOREBOX = add([anchor("left")  ,pos(15  ,H-30),z(Z_UI_BOTTOM),"ui"]);
         const TOPLBOX  = add([anchor("left")  ,pos(15  ,30)  ,z(Z_UI_BOTTOM),"ui"]);
         const NEWBOX   = add([anchor("right") ,pos(W-15,15)  ,z(Z_UI_BOTTOM),"ui"]);
         const BEARBOX  = add([anchor("bot")   ,pos(W/2 ,H)   ,z(Z_UI_BOTTOM),"ui"]);
     //UI
        const ICON_DIST     = 40;
        const NEW_BT_DIST   = 5;

    //DECLARING VARIABLES
     let cash            = 0;
     let score           = 0;
     let cash_per_sec    = 0;
     let cps_penalty     = 1;
     let cps_final       = cash_per_sec / cps_penalty;
     let time            = 300;
     //prices
        let scaling     = 1.4;
        let pr_new_tree = 20;
        let pr_new_bird = 200;
        let pr_new_bee  = 100;
     //cash/second
        let cps_tree    = 0.1;
        let cps_bee     = 5;
     //number of elements
        let nb_trees    = get('tree').length;
        let nb_bees     = get('bee').length;
        let nb_birds    = get('bird').length
        let nb_trash    = get('trash').length;
     //events
        const MAX_EVENT_STAT = 100;
        let pollu_stat  = 0;
        let pollu_over  = 0;
        let pollu_boost = 2;
        let pollu_color = rgb(31, 60, 33); //if change this need to change lower
        let defo_stat   = 0;
        let defo_over   = 0;
        let defo_boost  = 1.5;
        let defo_color  = rgb(89, 66, 53); //if change this need to change lower
        let fire_stat   = 0;
        let fire_over   = 0;
        let fire_boost  = 3;
        let fire_color  = rgb(255, 119, 0) //if change this need to change lower
     //others
        let diaL = get("dialog").length; //length to check if the dialogue is existent
        let health_tree = 20;

    //UI
    //cash
     const text_cash = CASHBOX.add([
        text(formatNumber(cash, {useOrderSuffix: true, decimals: 1}),{
            width : W,
        }),
        anchor("left"),
        pos(-30, 0),
        z(Z_UI),
        {
            update(){
                this.text = formatNumber(cash, {useOrderSuffix: true, decimals: 1});
            }
        },
        "ui"
     ]);
     const icon_cash = CASHBOX.add([
        sprite('leaf0'),
        anchor("right"),
        pos(text_cash.pos.x - 7, 0),
        z(Z_UI),
        scale(SPRITE_ICON_SCALE),
        "ui",
     ]);
     const text_cash_per_sec = CASHBOX.add([
        text(formatNumber(cps_final, {useOrderSuffix: true, decimals: 1}) + "/s",{
            size    : 24,   
            width   : W,
        }),
        anchor("left"),
        pos(icon_cash.pos.x, 35),
        z(Z_UI),
        {
            update(){
                this.text = formatNumber(cps_final, {useOrderSuffix: true, decimals: 1}) + "/s";
            }
        },
        "ui",
     ])
    //score
     const text_score = SCOREBOX.add([
        text(`Score : ${Math.floor(score)}`,{
           width : W,
        }),
        anchor("left"),
        pos(0, 0),
        z(Z_UI),
        {
           update(){
              this.text = `Score : ${Math.floor(score)}`;
           }
        },
       "ui"
    ]);
    //timer
    const text_time = TOPLBOX.add([
        text(`Temps restant : ` + fancyTimeFormat(time),{
           width : W,
           size : 30,
        }),
        anchor("left"),
        pos(0,0),
        z(Z_UI),
        {
            update(){
                this.text = `Temps restant : ` + fancyTimeFormat(time);
            }
         },
       "ui",
    ]);

    //EVENTS UI
    const EVENTS = add([anchor("left"),pos(10,text_time.pos.y + 65),z(Z_UI_BOTTOM),"ui"])
    function emptyBar(){
        drawRect({
            pos: vec2(30, 0),
            width: MAX_EVENT_STAT + 2,
            height: 13,
            anchor: "left",
            fill: false,
            outline: { color: BLACK, width: 2 },
        })
    }

     //pollution
     const icon_pollution = EVENTS.add([
        sprite('pollution_icon'),
        anchor('left'),
        pos(0,0),
        z(Z_UI),
        scale(SPRITE_ICON_SCALE),
        "ui",
     ]);
        icon_pollution.onDraw(() => {
            drawRect({
                pos: vec2(30, 0),
                width: pollu_stat,
                height: 13,
                anchor: "left",
                color: pollu_color,
            })
            emptyBar();
        })
    //deforestation
    const icon_defo = EVENTS.add([
        sprite('defo_icon'),
        anchor('left'),
        pos(icon_pollution.pos.x, icon_pollution.pos.y + ICON_DIST),
        z(Z_UI),
        scale(SPRITE_ICON_SCALE),
        "ui",
     ]);
        icon_defo.onDraw(() => {
            drawRect({
                pos: vec2(30, 0),
                width: defo_stat,
                height: 13,
                anchor: "left",
                color: defo_color,
            })
            emptyBar();
        })
    //fire
    const icon_fire = add([
        sprite('fire_icon'),
        anchor('left'),
        pos(10, 145), //for some reason using the relative pos doesn0t work here
        z(Z_UI),
        scale(SPRITE_ICON_SCALE),
        "ui",
     ]);
        icon_fire.onDraw(() => {
            drawRect({
                pos: vec2(30, 0),
                width: fire_stat,
                height: 13,
                anchor: "left",
                color: fire_color,
            })
            emptyBar();
        })

    //DIALOG UI
     //bear
     const icon_bear = BEARBOX.add([
         sprite('bear'),
         anchor('bot'),
         pos(W/2 - 100,0),
         z(Z_UI_TOP),
         scale(BEAR_SMALL_SCALE),
         area(),
         "bear",
         "game_elements",
     ]);
    
    //BUTTONS TO ADD NEW ELEMENTS (maybe add a onScroll for these elements)
     //adding a new tree button
     const new_tree = NEWBOX.add([
        sprite('new_tree'),
        anchor("topright"),
        pos(0,0),
        z(Z_UI),
        scale(SPRITE_BUTTON_SCALE),
        area(),
        "ui",
        "button",
        "new_button",
        "new_tree",
     ])
        const text_new_tree_price = new_tree.add([
            text(formatNumber(pr_new_tree, {useOrderSuffix: true, decimals: 1}),{
                size : BUTTON_SIZE * BUTTON_PRICE_TXT_SCALE,
            }),
            {
                update(){
                this.text = formatNumber(pr_new_tree, {useOrderSuffix: true, decimals: 1});
                }
            },
            anchor("right"),
            pos(-BUTTON_SIZE * 4,BUTTON_SIZE * 1.7),
            z(Z_UI_TOP),
        ])
        const text_nb_trees = new_tree.add([
            text(formatNumber(nb_trees, {useOrderSuffix: true}),{
                size : BUTTON_SIZE * BUTTON_NB_TXT_SCALE,
            }),
            {
                update(){
                this.text = formatNumber(nb_trees, {useOrderSuffix: true});
                }
            },
            anchor("right"),
            pos(-BUTTON_SIZE * 6,BUTTON_SIZE * 3.75),
            z(Z_UI_TOP),
        ])
        //adding a new bird button
        const new_bird = NEWBOX.add([
            sprite('new_bee'), // change to new bird when made
            anchor("topright"),
            pos(new_tree.pos.x, new_tree.pos.y + BUTTON_SIZE + NEW_BT_DIST),
            scale(SPRITE_BUTTON_SCALE),
            anchor("topright"),
            area(),
            z(Z_UI),
            "ui",
            "button",
            "new_button",
            "new_bird",
         ])
            const text_new_bird_price = new_bird.add([
                text(formatNumber(pr_new_bird, {useOrderSuffix: true, decimals: 1}),{
                    size : BUTTON_SIZE * BUTTON_PRICE_TXT_SCALE,
                }),
                {
                    update(){
                    this.text = formatNumber(pr_new_bird, {useOrderSuffix: true, decimals: 1});
                    }
                },
                anchor("right"),
                pos(-BUTTON_SIZE * 4,BUTTON_SIZE * 1.7),
                z(Z_UI_TOP),
            ])
            const text_nb_birds = new_bird.add([
                text(formatNumber(nb_birds, {useOrderSuffix: true}),{
                    size : BUTTON_SIZE * BUTTON_NB_TXT_SCALE,
                }),
                {
                    update(){
                    this.text = formatNumber(nb_birds, {useOrderSuffix: true});
                    }
                },
                anchor("right"),
                pos(-BUTTON_SIZE * 6,BUTTON_SIZE * 3.75),
                z(Z_UI_TOP),
            ])
    //adding a new bee button
     const new_bee = NEWBOX.add([
        sprite('new_bee'),
        anchor("topright"),
        pos(new_bird.pos.x, new_bird.pos.y + BUTTON_SIZE + NEW_BT_DIST),
        scale(SPRITE_BUTTON_SCALE),
        anchor("topright"),
        area(),
        z(Z_UI),
        "ui",
        "button",
        "new_button",
        "new_bee",
     ])
        const text_new_bee_price = new_bee.add([
            text(formatNumber(pr_new_bee, {useOrderSuffix: true, decimals: 1}),{
                size : BUTTON_SIZE * BUTTON_PRICE_TXT_SCALE,
            }),
            {
                update(){
                this.text = formatNumber(pr_new_bee, {useOrderSuffix: true, decimals: 1});
                }
            },
            anchor("right"),
            pos(-BUTTON_SIZE * 4,BUTTON_SIZE * 1.7),
            z(Z_UI_TOP),
        ])
        const text_nb_bees = new_bee.add([
            text(formatNumber(nb_bees, {useOrderSuffix: true}),{
                size : BUTTON_SIZE * BUTTON_NB_TXT_SCALE,
            }),
            {
                update(){
                this.text = formatNumber(nb_bees, {useOrderSuffix: true});
                }
            },
            anchor("right"),
            pos(-BUTTON_SIZE * 6,BUTTON_SIZE * 3.75),
            z(Z_UI_TOP),
        ])

    //BACKGROUND
     //adding the background dynamically to the screen size
     for (let i = 0; i < NB_BG_X_TILES; i++) {
        const bg = add([
            sprite("main_bg"),
            anchor("left"),
            pos((BG_TILE_SIZE) * i, BG_Y),
            scale(SPRITE_BG_SCALE),
            z(0),
            "bg",
         ]);
         bg.play("n");
     }
     if (H > BG_TILE_SIZE) {
        for (let j = 1; j <= NB_BG_Y_TILES; j++) {
            for (let i = 0; i < NB_BG_X_TILES; i++) {
                const bg = add([
                    sprite("sky_bg"),
                    anchor("left"),
                    pos((BG_TILE_SIZE) * i, BG_Y - ((BG_TILE_SIZE)*j)),
                    scale(SPRITE_BG_SCALE),
                    z(0),
                    "bg",
                 ]);
                 bg.play("n");
             }
        }
        for (let j = 1; j <= NB_BG_Y_TILES; j++) {
            for (let i = 0; i < NB_BG_X_TILES; i++) {
                const bg = add([
                    sprite("water_bg"),
                    anchor("left"),
                    pos((BG_TILE_SIZE) * i, BG_Y + ((BG_TILE_SIZE)*j)),
                    scale(SPRITE_BG_SCALE),
                    z(0),
                    "bg",
                 ]);
                 bg.play("n");
             }
        }
     }

    //ADDING OBJECTS
        //adding starting tree
        let y_st = H/2 + 50;
        const start_tree = add([
        sprite(`tree0`),
        pos(vec2(W/2,y_st)),
        scale(y_st * TREE_SCALE),
        anchor("bot"),
        area(),
        z(y_st),
        health(health_tree),
        "tree",
        "clickable",
        "start_tree",
    ]);

    //ADDING EVENT LISTENERS
    //Game elements (inside an if(get("dialog").lenght == 0) to make sure it is impossible to click things if dialogues are on)
        //click any tree
        onClick("tree", (t) => { 
            if (diaL == 0) {
                plus(1);

                //particles when clicked
                for (let i = 0; i < rand(0,3); i++) {
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
                    leaf_particle.jump(rand(100, 350))
                }
                zoomOut(t);
            }
        })
        //click the trashcans
        onClick("trash", (t) => { 
            if (diaL == 0) {
                //particles when clicked
                for (let i = 0; i < 1; i++) {
                    const trash_particle = add([
                        pos(mousePos()),
                        z(t.pos.y + 10),
                        sprite('pollution_icon'),
                        anchor("center"),
                        scale(rand(1, 0.6)),
                        area({ collisionIgnore:["trash_particle"]}),
                        body(),
                        lifespan(0.5, {fade: 0.2}),
                        opacity(1),
                        move(choose([LEFT, RIGHT]), rand(30, 150)),
                        rotate(rand(0, 360)),
                        offscreen({destroy: true}),
                        "trash_particle",
                    ])
                    trash_particle.jump(rand(100, 350))
                }
                zoomOut(t);
                minusPollu();
                if(pollu_over <= 0){
                    let ran = choose([0,1,1,1,1,1,1,1]);
                    if (ran == 0) {
                        destroy(t);
                    }
                }
                if(pollu_stat < 5){
                    destroyAll("trash")
                }
            }
        })
        //click the bulldozer
        onClick("bulldozer", (t) => { 
            if (diaL == 0) {
                //particles when clicked
                for (let i = 0; i < rand(5); i++) {
                    const smoke_particle = add([
                        pos(mousePos()),
                        z(t.z + 1),
                        sprite('smoke', {
                            anim: "main",
                        }),
                        anchor("center"),
                        scale(rand(0.05, 0.1)),
                        area({ collisionIgnore:["smoke_particle"]}),
                        body(),
                        lifespan(0.3, {fade: 0.2}),
                        opacity(1),
                        move(choose([LEFT,RIGHT]), rand(30, 150)),
                        offscreen({destroy: true}),
                        "smoke_particle",
                    ])
                    smoke_particle.jump(rand(400, 500));
                }
                zoomOut(t);
                minusDefo();
                if(defo_stat < 5){
                    destroy(t);
                }
            }
        })
        onDestroy("trash", (t) =>{
            for (let i = 0; i < rand(5); i++) {
                const trash_particle = add([
                    pos(t.pos),
                    z(t.pos.y + 10),
                    sprite('pollution_icon'),
                    anchor("center"),
                    scale(rand(1, 0.6)),
                    area({ collisionIgnore:["trash_particle"]}),
                    body(),
                    lifespan(0.5, {fade: 0.2}),
                    opacity(1),
                    move(choose([LEFT, RIGHT]), rand(30, 150)),
                    rotate(rand(0, 360)),
                    offscreen({destroy: true}),
                    "trash_particle",
                ])
                trash_particle.jump(rand(100, 350))
            }
        })
        onDestroy("tree", (t) => {
            for (let i = 0; i < rand(10,20); i++) {
                const leaf_particle = add([
                    pos(t.pos),
                    z(t.pos.y + 10),
                    sprite(choose(leafs)),
                    anchor("center"),
                    scale(rand(1, 0.6)),
                    area({ collisionIgnore:["leaf_particle"]}),
                    body(),
                    lifespan(0.5, {fade: 0.2}),
                    opacity(1),
                    move(choose([LEFT, RIGHT]), rand(30, 150)),
                    rotate(rand(0, 360)),
                    offscreen({destroy: true}),
                    "leaf_particle",
                ])
                leaf_particle.jump(rand(100, 350));
            }
        })
        onDestroy("bulldozer", (t) => {
            for (let i = 0; i < rand(10,30); i++) {
                const smoke_particle = add([
                    pos(mousePos()),
                    z(t.z + 1),
                    sprite('smoke', {
                        anim: "main",
                    }),
                    anchor("center"),
                    scale(rand(0.05, 0.1)),
                    area({ collisionIgnore:["smoke_particle"]}),
                    body(),
                    lifespan(0.3, {fade: 0.2}),
                    opacity(1),
                    move(choose([LEFT,RIGHT]), rand(30, 150)),
                    offscreen({destroy: true}),
                    "smoke_particle",
                ])
                smoke_particle.jump(rand(400, 500));
            }
        })

        //skip dialogs
        let q = 0;
        onKeyRelease("space", (t) => {
            destroyAll("dialog");
            icon_bear.use(sprite('bear'));
            icon_bear.use(scale(BEAR_SMALL_SCALE));
            q++;
        })
        /*onClick("dialog", (t) => {
            destroyAll("dialog");
            icon_bear.use(sprite('bear'));
            icon_bear.use(scale(BEAR_SMALL_SCALE));
            q++;

        })*/

        //get a fun fact
        onClick("bear", (t) => {
            diaBubble(choose(dia_funfact));
        })

    //UI elements
        //click any button
        onClick("button", (b) => {
            if (diaL == 0) {
                zoomIn(b);
            }
        })

        //New itens buttons
            //New tree
            onClick("new_tree", (t) =>{
                if (diaL == 0) {
                    if(cash < pr_new_tree){
                        warning(text_cash);
                        warning(text_new_tree_price);
                    } else {
                        addTree();
                    }
                }
            })
            //New bee
            onClick("new_bird", (t) =>{
                if (diaL == 0) {
                    if(cash < pr_new_bird){
                        warning(text_cash);
                        warning(text_new_bird_price);
                    } else {
                        addBird();
                    }
                }
            })
            //New bee
            onClick("new_bee", (t) =>{
                if (diaL == 0) {
                    if(cash < pr_new_bee){
                        warning(text_cash);
                        warning(text_new_bee_price);
                    } else {
                        addBee();
                    }
                }
            })

    //AUTOMATIC STUFF
        let randTree = choose(get('tree'));
        loop(1, () => {
            if (diaL == 0) { //Pauses the game if dialogue is opened
                //Timer
                if(time > 0){
                    time = time - 1
                };       
                      
                //Each element gives cash overtime
                plus(cps_final);
    
                //Increase the events stats
                let r_pollu = choose([0,0,0,0,0,0,0,0,0,1]);
                if (r_pollu == 0 && pollu_stat <= MAX_EVENT_STAT) {
                    pollu_stat = pollu_stat + pollu_boost;
                }
                let r_defo = choose([0,0,1]);
                if (r_defo == 0 && defo_stat <= MAX_EVENT_STAT) {
                    defo_stat = defo_stat + defo_boost;
                }
                if (pollu_stat >= MAX_EVENT_STAT){
                    pollu_over++;
                    if(fire_stat <= MAX_EVENT_STAT){
                        fire_stat = fire_stat + fire_boost;
                    }
                }
                if (defo_stat >= MAX_EVENT_STAT){
                    defo_over++;
                    if(fire_stat <= MAX_EVENT_STAT){
                        fire_stat = fire_stat + fire_boost;
                    }
                    if(get("bulldozer").length == 0){
                        addBulldozer();
                    }
                }
                if (fire_stat >= MAX_EVENT_STAT){
                    fire_over++;
                }

                //Adds trashcans
                if(pollu_over % 5 == 0 && pollu_over != 0) {
                    addTrash();
                }
    
                //Flashes time at multiple occasions
                if ((time < 61 && time >= 60) || (time < 31 && time >= 30) || (time <= 15)) {
                    smallWarning(text_time);
                }
                
                //Flashes the events  bars when full
                if (pollu_stat >= MAX_EVENT_STAT) {
                    pollu_color = rgb(31, 100, 33);
                    wait(0.3, () =>{
                        pollu_color = rgb(31, 60, 33);
                    })
                }
                if (defo_stat >= MAX_EVENT_STAT) {
                    defo_color = rgb(120, 66, 63);
                    wait(0.3, () =>{
                        defo_color = rgb(89, 66, 53);
                    })
                }
                if (fire_stat >= MAX_EVENT_STAT) {
                    fire_color = rgb(255, 150, 20);
                    wait(0.3, () =>{
                        fire_color = rgb(255, 119, 0);
                    })
                }

                //spawn smoke particles on the bulldozer
                if (get('bulldozer').length != 0) {
                    let bd = get('bulldozer')[0];
                    let smoke_dir = LEFT;
                    if(bd.flipX == false){smoke_dir = RIGHT;} else {smoke_dir = LEFT;};
                    const smoke_particle = add([
                        pos(bd.pos.x, bd.pos.y - 30),
                        z(bd.z-1),
                        sprite('smoke', {
                            anim: "main",
                        }),
                        anchor("center"),
                        scale(rand(0.05, 0.1)),
                        area({ collisionIgnore:["smoke_particle"]}),
                        body(),
                        lifespan(0.3, {fade: 0.2}),
                        opacity(0.8),
                        move(smoke_dir, rand(30, 150)),
                        offscreen({destroy: true}),
                        "smoke_particle",
                    ])
                    smoke_particle.jump(rand(400, 500));
                }
            }
        });

        let p = 0; let d = 0; let f = 0;
        onUpdate(() => {    
        diaL        = get("dialog").length; //length to check if the dialogue is existent
        nb_trees    = get('tree').length;
        nb_bees     = get('bee').length;
        nb_birds    = get('bird').length;
        nb_trash    = get('trash').length;

         cash_per_sec = (nb_trees * cps_tree) + (nb_bees * cps_bee);
         cps_final   = cash_per_sec / cps_penalty;
         if (nb_trash == 0) {
            cps_penalty = 1;
         } else {
            cps_penalty = nb_trash;
         }

         //Intro dialogue
         if (q < dia_intro.length) {
            diaBubble(dia_intro[q]);
         }

         //Timer relative actions
         switch(time){
            case 0 : 
                go("gameOver");
                break;
         }

         //Pollution relative actions
         if (pollu_stat > 50 && p == 0) {
            p++;
            diaBubble(dia_pollution[0]);
         }
         if(pollu_over >= MAX_EVENT_STAT && p == 1) {
            p++;
            diaBubble(dia_pollution[1]);
         }
         if(pollu_over >= 15 && p == 2){
            p++;
            diaBubble(dia_pollution[2]);
         }
         if(pollu_stat < MAX_EVENT_STAT && p == 3){
            p++;
            diaBubble(dia_pollution[3]);
         }
         //Deforestation relative actions
         if (defo_stat > 50 && d == 0) {
            d++;
            diaBubble(dia_deforestation[0]);
         }
         if(defo_over >= MAX_EVENT_STAT && d == 1) {
            d++;
            diaBubble(dia_deforestation[1]);
         }
         if(defo_over >= 15 && d == 2){
            d++;
            diaBubble(dia_deforestation[2]);
         }
         if(defo_stat < MAX_EVENT_STAT && d == 3){
            d++;
            diaBubble(dia_deforestation[3]);
         }
         //Fire relative actions
         if (fire_stat > 50 && f == 0) {
            f++;
            diaBubble(dia_fire[0]);
         }
         if(fire_over >= MAX_EVENT_STAT && f == 1) {
            f++;
            diaBubble(dia_fire[1]);
         }
         if(fire_over >= 15 && f == 2){
            f++;
            diaBubble(dia_fire[2]);
         }
         if(fire_stat < MAX_EVENT_STAT && f == 3){
            f++;
            diaBubble(dia_fire[3]);
         }       
    })

    //FUNCTIONS
       //Add a new tree
       function addTree() {
         let ranYA = H/2;
         let ranYB = H/2 + (BG_TILE_SIZE/2 - 40 * SPRITE_BG_SCALE)
         const randX  = rand(0, W);
         const randY  = rand(ranYA, ranYB);
         //const relScale = 0.1 + (0.5 - 0.1) * ((this.pos.y - ranA) / (ranB - ranA)); //relative scale to the Y position
         const tree  = add([
             sprite(choose(trees)),
             pos(randX, randY),
             scale(randY * TREE_SCALE),
             anchor("bot"),
             area(),
             z(randY),
             health(health_tree),
             "tree",
          ])
            pay(pr_new_tree);
            //exp(pr_new_tree); //PK çA MARCHE PAS??????
            pr_new_tree = pr_new_tree * scaling;
       }
        //Add custom new tree
       function addCustTree(x,y) {
         let clicked = 0;
         const tree  = add([
             sprite(choose(trees)),
             pos(x,y),
             scale(y * TREE_SCALE),
             anchor("bot"),
             area(),
             z(y),
             health(health_tree),
             "tree",
          ])
            //exp(pr_new_tree); //PK çA MARCHE PAS??????
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
            "bee",
        ])
            pay(pr_new_bee);
            //change with function
            pr_new_bee  = pr_new_bee * scaling;
       }
        //Add a new trash
         function addTrash() {
         const randX  = rand(0, W - icon_bear.pos.x);
         const randY  = rand((H/2 + (BG_TILE_SIZE/2 - 40 * SPRITE_BG_SCALE)) + 10, (H/2 + (BG_TILE_SIZE/2 - 40 * SPRITE_BG_SCALE)) - 10);
         const trash  = add([
             sprite('trash'),
             pos(randX, randY),
             scale(TRASH_SCALE),
             anchor("bot"),
             area(),
             z(randY),
             "trash",
          ])
         }
        //Add a bulldozer
         function addBulldozer() {
            let rT = choose(get('tree'));
            const bulldozer = add([
                sprite('bulldozer'),
                anchor("bot"),
                pos(-100, H/2),
                {
                    update(){
                        if (diaL == 0 && nb_trees > 1) {
                            this.z = this.pos.y;
                            /*//dynamically scale bulldozer
                            if (get('bulldozer').length != 0) {
                                get('bulldozer')[0].scale = get('bulldozer')[0].pos.y * BULLDOZER_SCALE;
                            }*/ //-----> makes it untoucheable for some reason 
                            if (this.pos.x > rT.pos.x) {
                                this.flipX = false;
                            } else {
                                this.flipX = true;
                            }
                            this.moveTo(rT.pos.x, rT.pos.y + 10, BULLDOZER_SPEED);
                            if(this.pos.x == rT.pos.x && this.pos.y == rT.pos.y + 10){
                                destroy(rT);
                                rT = choose(get('tree'));
                            }
                        }
                    },
                },
                z(1),
                scale(H/2 * BULLDOZER_SCALE),
                area(),
                "bulldozer",
            ])
         }
        //Add new bird
        function addBird() {
            let b = 0;
            let rT = choose(get('tree'));
            let ranYA = H/2;
            let ranYB = H/2 + (BG_TILE_SIZE/2 - 40 * SPRITE_BG_SCALE)
            let randX  = rand(0, W);
            let randY  = rand(ranYA, ranYB);
            const bird = add([
                sprite('bird', {
                    anim : "fly",
                }),
                anchor("bot"),
                pos(choose(-10, W+10), H/2),
                {
                    update(){
                        if (diaL === 0) {
                            this.z = this.pos.y + 100;
                            this.scale = this.pos.y * BIRD_SCALE;
                            if (b === 0) {
                                if (this.pos.x > rT.pos.x) {
                                    this.flipX = true;
                                } else {
                                    this.flipX = false;
                                }
                                this.moveTo(rT.pos.x, rT.pos.y - 50, BIRD_SPEED);
                                if(this.pos.x == rT.pos.x && this.pos.y == rT.pos.y - 50){
                                    b++;
                                    this.z = rT.z + 1;
                                    this.play("land");
                                };
                            }
                            if (b === 1) {
                                this.onAnimEnd((anim) => {
                                    if(anim === "land" && b === 1){
                                        b++;
                                        this.play("eat");
                                    };
                                    if(anim === "eat" && b === 2){
                                        b++;
                                        if (this.pos.x > randX) {
                                            this.flipX = true;
                                        } else {
                                            this.flipX = false;
                                        }
                                        this.moveTo(randX, randY, BIRD_SPEED);
                                        this.play("takeoff");
                                    };
                                    if(anim === "takeoff" && b === 3){
                                        b++
                                        this.play("fly");
                                        if (this.pos.x > randX) {
                                            this.flipX = true;
                                        } else {
                                            this.flipX = false;
                                        }
                                        this.moveTo(randX, randY, BIRD_SPEED);
                                    };
                                    if(anim === "land" && b === 5){
                                        b++;
                                        this.play("eat");
                                    }
                                    if(anim === "eat" && b === 6){
                                        b = 0;
                                        addCustTree(this.pos.x, this.pos.y);
                                        this.play("fly");
                                        rT = choose(get('tree'));
                                        randX  = rand(0, W);
                                        randY  = rand(ranYA, ranYB);
                                    }
                                });
                            }
                            if(b === 4 && this.pos.x != randX && this.pos.y != randY){
                                this.moveTo(randX, randY, BIRD_SPEED);
                            }
                            if(b === 4 && this.pos.x == randX && this.pos.y == randY){
                                b++;
                                this.play("land");
                            }
                        }
                    },
                },
                z(1),
                scale(BIRD_SCALE),
                area(),
                "bird",
            ])
            pay(pr_new_bird);
            //change with function
            pr_new_bird  = pr_new_bird * scaling;
         }
       //Add a dialog box
       function diaBubble(array_with_number){
            let width = W/1.5;
            destroyAll("dialog");
            const bubble = add([ //CAN'T ADD IT IN BEARBOX BECAUSE BEARBOX CAN'T HAVE THE AREA() FUNCTION
                rect(width, H/8, { radius: 32 }),
                anchor("center"),
                pos(BEARBOX.pos.x - 15, H - H/8),
                z(Z_UI_BOTTOM),
                outline(4),
                area(),
                "dialog",
            ])
            const txt_bubble = add([
                text(array_with_number[1], { size: 20, width: width - 15, align: "center" }),
                pos(bubble.pos),
                anchor("center"),
                color(0, 0, 0),
                z(Z_UI_BOTTOM),
                area(),
                "dialog",
            ])
            icon_bear.use(sprite(array_with_number[0]));
            icon_bear.use(scale(BEAR_SCALE));
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

        //Remove pollu-stat
        function minusPollu(){
            if (pollu_over > 0) {
                pollu_over = pollu_over - pollu_boost;
            }
            if(pollu_over <= 0 && pollu_stat > 0){
                pollu_stat = pollu_stat - pollu_boost;
            }
        }
        //Remove defo-stat
        function minusDefo(){
            if (defo_over > 0) {
                defo_over = defo_over - defo_boost;
            }
            if(defo_over <= 0 && defo_stat > 0){
                defo_stat = defo_stat - defo_boost;
            }
        }

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

scene("gameOver", () => {
    add([
		text("you lose!"),
		pos(width() / 2, height() / 2 + 108),
		scale(1),
		anchor("center"),
	])
    onKeyPress("space", () => go("game"))
	onClick(() => go("game"))
})

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
    function smallWarning(t){
        t.color = rgb (255, 0, 0);
        wait(0.3, () =>{
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
      


//DIALOGS
    //bear = normal bear, smiling slightly - bear_scared, bear_wink (fun facts), starry-eyed bear
    const dia_intro = [
        ["bear", "Hello, je m'appelle Ours! Tu peux cliquer sur la barre d'espace pour passer à la prochaine bulle de dialogue."], 
        ["bear", "Peux-tu m'aider à planter des arbres?"],
        ["bear", "En cliquant sur l'arbre du milieu, tu pourras accumuler des points qui te permettront d'acheter des arbres."],
        ["bear", "Tu pourras également acheter des abeilles qui ont un rôle important pour la pollinisation."], 
        ["bear", "À toi de jouer! Tu as 5 minutes pour m'aider à créer une belle forêt."],
    ]
    const dia_pollution = [
        ["bear_scared", "Attention!! La barre de pollution augmente vite!"],
        ["bear_wink", "Savais-tu qu'un milieu pollué a de graves conséquences comme l'accumulation de toxines dans la chaîne alimentaire et l'ingestion de plastique?"], 
        ["bear_scared", "Clique sur les déchets afin de faire descendre la barre de pollution."],
        //when pollution barre down a certain amount
        ["bear", "Merci beaucoup d'avoir enlevé tous les déchets! Continue à rajouter le plus d'arbres possible!"],
    ]
    const dia_deforestation = [
        ["bear_scared", "Attention!! La barre de déforestation augmente vite!"],
        ["bear_wink", "Savais-tu que la destruction des habitats est la principale cause de la perte de diversité des espèces en millieu terrestre?"], 
        ["bear_scared", "!"],
        ["bear", "Merci beaucoup d'avoir sauvé mes beaux arbres! Continue à rajouter le plus d'arbres possible!"],
    ]
    const dia_fire = [
        ["bear_scared", "Attention!! La barre d'incendie augmente vite!"],
        ["bear_wink", "Savais-tu que 20% des causes de déforestation dans le monde sont dues aux incendies naturels?"],
        ["bear_scared", "Clique sur le feu afin de faire descendre la barre d'incendie."],
        ["bear", "Merci beaucoup d’avoir sauvé ma forêt ! Continue à rajouter le plus d'arbres possible!"],
    ]
    const dia_funfact = [
        ["bear_wink", "Ceci est un test !"],
    ]


go('game');
