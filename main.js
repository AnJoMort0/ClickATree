//IDEAS TO ADD
 //Priority
    //* (à voir si ça va de dire "space"? - C'est bon) Ajouter petite icône "barre d'espace" en bas à droite des dialogues
    //Add sounds (sounds of the objects not just clicks) to different things
        // * pop when bee enter beehive because it means +1 honey and it gives an audio information
        // * (pour l'instant seulement quand addTree et onDestroy) leaves rumbling when click on tree or onDestroy or addTree --> onClick is way to spammy
        // * bulldozer on screen et son s'arrête lorsque bulldozer est destroyed
        // * click bulldozer (peut-être que ça fait trop bruit de pistolet - à discuter)
        //destroy bulldozer
        // -  click and ondestroy trash --> pour l'instant seulement onclick est fait
    //Honey bottle in end screen and align it with the score results
    //Add dialogue for when try to buy something whitout enough money or bees without enough flowers or beehives whitout enough bees for the first time
    //Add dialogue when you have a bee but not a beehive
    //Move dialogues to more dynamic parts to not have overload of informations
    //Hide elements before they are needed (info_buttons, unavailable bees, beehives, etc)
 //If time
    //Minimal animations for the bees (for example move around when reach a tree)
    //Achievements
    //Darker colors at the beginning -> progress saturation the bigger the forest
    //Have all scales depend on screen size
    //Create a fire event when auto-clicker
    //Hide HUD button

//KNOWN BUGS
    // When multiple trees overlap, the player gets multiple points in a single click
        //* Fixed it by calling it a feature
    //You can continue clicking the trees and placing them even when the time stops
        //* Fixed
    // parfois des bugs apparaissent comme 2173 : width not defined et les problèmes avec les dialogues 
    


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
let time                        = -10;

const SPRITE_PIXEL_SIZE         = 25;
const SPRITE_ICON_SCALE         = 1.4;
const ICON_SIZE                 = SPRITE_PIXEL_SIZE * SPRITE_ICON_SCALE;
const SPRITE_BG_PIXEL_SIZE      = 250;
const SPRITE_BG_SCALE           = 3;
const BG_TILE_SIZE              = SPRITE_BG_PIXEL_SIZE * SPRITE_BG_SCALE;
const SPRITE_BUTTON_PIXEL_SIZE  = 400;
const SPRITE_BUTTON_SCALE       = 0.2;
const BUTTON_SIZE               = SPRITE_BUTTON_PIXEL_SIZE * SPRITE_BUTTON_SCALE;
const BUTTON_PRICE_TXT_SCALE    = 0.9;
const BUTTON_NB_TXT_SCALE       = 0.8;
const BG_Y                      = H/2;
const NB_BG_X_TILES             = Math.floor(W/(BG_TILE_SIZE)) + 1;
const NB_BG_Y_TILES             = Math.floor(H/(BG_TILE_SIZE)) + 1;
const BEAR_SCALE                = 8;
const BEAR_SMALL_SCALE          = BEAR_SCALE/1.5;
let honey = 0;
//z values:
    //const Z_TOP_TREE = 300; //changed to be based on height
    const Z_UI        = H    + 125;
    const Z_UI_TOP    = Z_UI + 1;
    const Z_UI_BOTTOM = Z_UI - 1;
//relative scale of objects to screen height
    const TREE_SCALE        = 1/100; 
    const TRASH_SCALE       = 3;
    const BULLDOZER_SCALE   = 1/90;
    const BIRD_SCALE        = 1/320;
    const BEE_SCALE         = 1/350;
    const BEEHIVE_SCALE     = 1/300;
//speed of moving elements
    const BULLDOZER_SPEED   = 60;
    const BIRD_SPEED        = 50;
    const BEE_SPEED         = 40;

//load assets
loadRoot('assets/');
// Load the custom font
    loadFont("d", "assets/Press_Start_2P/PressStart2P-Regular.ttf");
    /*Copyright 2012 The Press Start 2P Project Authors (cody@zone38.net), with Reserved Font Name "Press Start 2P".
    This Font Software is licensed under the SIL Open Font License, Version 1.1.
    This license is copied below, and is also available with a FAQ at:
    https://openfontlicense.org */
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
        //flowers
        loadSprite('flowers0', 'game_elements/vfx/flowers0.png');
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
        loadSprite('honey', 'game_elements/other/honey.png');
        loadSprite('beehive0', 'game_elements/other/beehive0.png')
        loadSprite('space_bar', 'game_elements/other/space_bar.png')
        //bear
        loadSprite('bear', 'game_elements/bear/bear.png');
        loadSprite('bear_scared', 'game_elements/bear/bear_scared.png');
        loadSprite('bear_wink', 'game_elements/bear/bear_wink.png');
        loadSprite('bear_happy', 'game_elements/bear/bear_happy.png');
        loadSprite('bear_sad', 'game_elements/bear/bear_sad.png');
        loadSprite('bear_talking', 'game_elements/bear/bear_talking.png');
        loadSprite('bear_info', 'game_elements/bear/bear_info.png');
        loadSprite('bear_flower', 'game_elements/bear/bear_flower.png');
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
        loadSprite('logo', 'icon/logo.png')
        //new buttons
        loadSprite('new_tree', "ui/new_buttons/new_tree_button.png");
        loadSprite('new_bee', "ui/new_buttons/new_bee_button.png");
        loadSprite('new_bird', "ui/new_buttons/new_bird_button.png");
        loadSprite('info', "ui/new_buttons/info_button.png");
        loadSprite('new_beehive', "ui/new_buttons/new_beehive_button.png");

//load ui sounds
    //loadSound('button_click',"audio/other/click.wav"): by Nathan Gibson https://nathangibson.myportfolio.com 
    loadSound('button_click', "audio/other/button/click.wav");
    //by FilmCow https://filmcow.itch.io/filmcow-sfx
    loadSound('tree_fall',"audio/other/deforestation/tree_fall.wav");
    //by Nathan Gibson https://nathangibson.myportfolio.com 
    loadSound('bee_in_hive', "audio/other/beehive/Retro7.wav");
    //Minifantasy - Forgotten Plains Audio Pack by Leohpaz
    loadSound('tree_leaf', "audio/other/tree/bush_rustling.wav");
    //Essentials Series - Free Sound Effect by Nox_Sound_Design
    loadSound('bulldozer', "audio/other/bulldozer/truck.wav");
    // brackeys platformer assets by Brackeys, Asbjørn Thirslund
    loadSound('bulldozer_click', "audio/other/bulldozer/click_bulldozer.wav");
    //Minifantasy - Forgotten Plains Audio Pack by Leohpaz
    loadSound('trash_click', "audio/other/trash/trash_sound.wav");
//load sfx
    //by Diablo Luna https://pudretediablo.itch.io/butterfly
    loadSound('birds_bg',"audio/sfx/birds/bird.wav");
//load music: by mayragandra https://mayragandra.itch.io/freeambientmusic 
    loadSound('default_music',"audio/music/music.wav");

//load shaders (All ChatGPT generated)
    // Grayscale shader
    loadShader("grayscale", null, `
        vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
        vec4 texColor = texture2D(tex, uv);
        float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
        return vec4(vec3(gray), texColor.a);
    }`)   
    //Red Tint
    loadShader("redTint", null, `
        vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
        vec4 texColor = texture2D(tex, uv);
        // Apply red tint
        vec4 redTint = vec4(1.0, 0.0, 0.0, 1.0);
        vec4 tintedColor = mix(texColor, redTint, 0.2);
        // Convert to grayscale
        float gray = dot(tintedColor.rgb, vec3(0.299, 0.587, 0.114));
        // Mix the grayscale color with the tinted color to reduce saturation
        vec4 desaturatedColor = mix(vec4(vec3(gray), tintedColor.a), tintedColor, 0.7);
        return desaturatedColor;
    }`)
    loadShader("lighten", null, `
    vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
        vec4 texColor = texture2D(tex, uv);
        // Define the amount to lighten
        float lightenAmount = 0.3;
        // Lighten the color by mixing with white
        vec4 lightenedColor = mix(texColor, vec4(1.0, 1.0, 1.0, 1.0), lightenAmount);
        return lightenedColor;
    }
    `)    
//============================//

//SCENES
scene("startMenu", () => {
    const STARTBOX  = add([anchor("center"), pos(W/2,H/2)  ,z(Z_UI_BOTTOM),"ui"]);
    setBackground(rgb(0, 191, 255));

    let music;
    onClick("timedStartButton", (b) => {
        time = 300;
        music = play('default_music', {
            loop: true,
            volume: 0.5,
        });
        go("game");
    });
    onClick("infStartButton", (b) => {
        time = -10;
        music = play('default_music', {
            loop: true,
            volume: 0.5,
        });
        go("game");
    });
    onClick("scoreBoardButton", (b) => {
        go("scoreboard");
    });
    const logo = STARTBOX.add([
        sprite('logo'),
        anchor('center'),
        scale(0.3),
        pos(0, -W/8),
        z(Z_UI),
        area(),
        "logo",
    ])
    onClick("logo", (t) => { 
            //particles when clicked
            for (let i = 0; i < 5; i++) {
                const leaf_particle = add([
                    pos(mousePos()),
                    z(t.z + 10),
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
                leaf_particle.jump(rand(100, 350))
            }
            zoomOut(t);
            music = play('button_click'); //it works with onclick
        });
        const timedStartButton = add([
            rect(350, 75, { radius: 15 }),
            anchor("center"),
            pos(STARTBOX.pos.x, STARTBOX.pos.y + 80),
            z(Z_UI_BOTTOM),
            outline(4),
            area(),
            "timedStartButton",
            "button,"
        ])
        const timedStartText = add([
            text("Mode 5 minutes", {size : 22, font : "d"}),
            pos(timedStartButton.pos),
            anchor("center"),
            color(0, 0, 0),
            z(Z_UI),
            area(),
            "timedStartButton",
            "button,"
        ])
        const infStartButton = add([
            rect(350, 75, { radius: 15 }),
            anchor("center"),
            pos(STARTBOX.pos.x, STARTBOX.pos.y + 200),
            z(Z_UI_BOTTOM),
            outline(4),
            area(),
            "infStartButton",
            "button,"
        ])
        const infStartText = add([
            text("Mode infini" , {size : 22, font : "d"}),
            pos(infStartButton.pos),
            anchor("center"),
            color(0, 0, 0),
            z(Z_UI),
            area(),
            "infStartButton",
            "button,"
        ])
        const scoreBoardButton = add([
            rect(350, 30, { radius: 15 }),
            anchor("center"),
            pos(STARTBOX.pos.x, STARTBOX.pos.y + 300),
            z(Z_UI_BOTTOM),
            outline(4),
            area(),
            "scoreBoardButton",
            "button,"
        ])
        const scoreBoardText = add([
            text("Scoreboard", {size : 15, font : "d"}),
            pos(scoreBoardButton.pos),
            anchor("center"),
            color(0, 0, 0),
            z(Z_UI),
            area(),
            "scoreBoardButton",
            "button,"
        ])
});
go("startMenu");

scene("game", () => {
    honey = 0;
    //DECLARING CONSTANTS
     //Areas
        //new buttons
         const X_BUTTONS         = W - 10;
         const Y_FIRST_BUTTON    = 65;
        //cash
         const CASHBOX  = add([anchor("center"),pos(W/2 ,30)   ,z(Z_UI_BOTTOM),"ui"]);
         const SCOREBOX = add([anchor("left")  ,pos(15  ,H-60) ,z(Z_UI_BOTTOM),"ui"]);
         const TOPLBOX  = add([anchor("left")  ,pos(15  ,30)   ,z(Z_UI_BOTTOM),"ui"]);
         const NEWBOX   = add([anchor("right") ,pos(W-15,15)   ,z(Z_UI_BOTTOM),"ui"]);
         const BEARBOX  = add([anchor("bot")   ,pos(W/2 ,H)    ,z(Z_UI_BOTTOM),"ui"]);
     //UI
        const ICON_DIST     = 40;
        const NEW_BT_DIST   = 5;

    //DECLARING VARIABLES
     let cash            = 0;
     let score           = 0;
     let cash_per_sec    = 0;
     let cps_penalty     = 1;
     let cps_final       = cash_per_sec / cps_penalty;
     //prices
        let scaling         = 1.6;
        let pr_new_tree     = 20;
        let pr_new_bird     = 200;
        let pr_new_bee      = 75;
        let pr_new_beehive  = 30;
     //number of elements
        let nb_trees    = get('tree').length;
        let nb_bees     = get('bee').length;
        let nb_birds    = get('bird').length;
        let nb_trash    = get('trash').length;
        let nb_flowered = get('flowered').length;
        let nb_beehives = get('beehives').length;
     //cash/second
        let cps_t_base  = 0.5
        let cps_tree    = cps_t_base * (nb_bees * nb_flowered + 1);
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
     //others
        let diaL = get("dialog").length; //length to check if the dialogue is existent
        let flowered_clicks     = 40;
        let nb_bees_p_flowered  = 3;
        let nb_bees_p_behive    = 5;
        //let health_tree = 20;

    //sound
    //onKeyRelease("space", (t) => {
    //    music = play('default_music'); //goes faster the more dialogs you click
    //})

    //UI
    //cash
     const text_cash = CASHBOX.add([
        text(formatNumber(cash, {useOrderSuffix: true, decimals: 1}),{
            width : W,
            size : 26,
            font : "d",
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
            width   : W,
            size : 16,
            font : "d",
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
     const icon_honey = SCOREBOX.add([
        sprite('honey'),
        anchor("left"),
        pos(0, 0),
        z(Z_UI),
        scale(SPRITE_ICON_SCALE * 2),
        "ui",
     ]);
     const text_honey = SCOREBOX.add([
        text(`${Math.floor(honey)}`,{
           width : W,
           size : 40,
           font : "d",
        }),
        anchor("left"),
        pos(icon_honey.pos.x + 85, 0),
        z(Z_UI),
        {
           update(){
              this.text = `${Math.floor(honey)}`;
           }
        },
       "ui"
    ]);
    //timer
     const text_time = TOPLBOX.add([
        text(`Temps restant : ` + fancyTimeFormat(time),{
            width : W,
            size : 22,
            font : "d",
        }),
        anchor("left"),
        pos(0,0),
        z(Z_UI),
        {
            update(){
                if (time >= 0) {
                    this.text = `Temps restant : ` + fancyTimeFormat(time);
                }else{
                    this.text="";
                }
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

    //DIALOG UI
     //bear
     const icon_bear = BEARBOX.add([
         sprite('bear'),
         anchor('bot'),
         pos(W/2 - 120,0),
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
                font : "d",
            }),
            {
                update(){
                    this.text = formatNumber(pr_new_tree, {useOrderSuffix: true, decimals: 1});
                    if(cash < pr_new_tree){
                        this.color = RED;
                    } else {
                        this.color = "";
                    }
                }
            },
            anchor("right"),
            pos(-BUTTON_SIZE * 4,BUTTON_SIZE * 1.7),
            z(Z_UI_TOP),
        ])
        const text_nb_trees = new_tree.add([
            text(formatNumber(nb_trees, {useOrderSuffix: true}),{
                size : BUTTON_SIZE * BUTTON_NB_TXT_SCALE,
                font:"d",
            }),
            {
                update(){
                this.text = formatNumber(nb_trees, {useOrderSuffix: true});
                }
            },
            anchor("right"),
            pos(-BUTTON_SIZE * 6,BUTTON_SIZE * 3.6),
            z(Z_UI_TOP),
        ])
        //adding a new bird button
        const new_bird = NEWBOX.add([
            sprite('new_bird'), 
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
                    font:"d",
                }),
                {
                    update(){
                        this.text = formatNumber(pr_new_bird, {useOrderSuffix: true, decimals: 1});
                        if(cash < pr_new_bird){
                            this.color = RED;
                        } else {
                            this.color = "";
                        }
                    }
                },
                anchor("right"),
                pos(-BUTTON_SIZE * 4,BUTTON_SIZE * 1.7),
                z(Z_UI_TOP),
            ])
            const text_nb_birds = new_bird.add([
                text(formatNumber(nb_birds, {useOrderSuffix: true}),{
                    size : BUTTON_SIZE * BUTTON_NB_TXT_SCALE,
                    font:"d",
                }),
                {
                    update(){
                    this.text = formatNumber(nb_birds, {useOrderSuffix: true});
                    }
                },
                anchor("right"),
                pos(-BUTTON_SIZE * 6,BUTTON_SIZE * 3.6),
                z(Z_UI_TOP),
            ])
    //adding a new bee button
     const new_bee = NEWBOX.add([
        sprite('new_bee'),
        {
            update(){
                if(nb_bees >= nb_flowered * nb_bees_p_flowered){
                    this.use(shader("grayscale"));
                    this.use("not_available");
                } else {
                    this.use(shader(""));
                    this.unuse("not_available");
                }
            }
        },
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
                font:"d",
            }),
            {
                update(){
                    this.text = formatNumber(pr_new_bee, {useOrderSuffix: true, decimals: 1});
                    if(cash < pr_new_bee && new_bee.is("not_available") == false){
                        this.color = RED;
                    } else {
                        this.color = "";
                    }
                }
            },
            anchor("right"),
            pos(-BUTTON_SIZE * 4,BUTTON_SIZE * 1.7),
            z(Z_UI_TOP),
        ])
        const text_nb_bees = new_bee.add([
            text(formatNumber(nb_bees, {useOrderSuffix: true}),{
                size : BUTTON_SIZE * BUTTON_NB_TXT_SCALE,
                font:"d",
            }),
            {
                update(){
                this.text = formatNumber(nb_bees, {useOrderSuffix: true});
                }
            },
            anchor("right"),
            pos(-BUTTON_SIZE * 6,BUTTON_SIZE * 3.6),
            z(Z_UI_TOP),
        ])
    //adding a new bee button
    const new_beehive = NEWBOX.add([
        sprite('new_beehive'), //change to new_beehive
        {
            update(){
                if(nb_bees <= nb_beehives * nb_bees_p_behive || get("hiveable").length == 0){
                    this.use(shader("grayscale"));
                    this.use("not_available");
                } else {
                    this.use(shader(""));
                    this.unuse("not_available");
                }
            }
        },
        anchor("topright"),
        pos(new_bee.pos.x, new_bee.pos.y + BUTTON_SIZE + NEW_BT_DIST),
        scale(SPRITE_BUTTON_SCALE),
        anchor("topright"),
        area(),
        z(Z_UI),
        "ui",
        "button",
        "new_button",
        "new_beehive",
     ])
        const text_new_beehive_price = new_beehive.add([
            text(formatNumber(pr_new_beehive, {useOrderSuffix: true, decimals: 1}),{
                size : BUTTON_SIZE * BUTTON_PRICE_TXT_SCALE,
                font:"d",
            }),
            {
                update(){
                    this.text = formatNumber(pr_new_beehive, {useOrderSuffix: true, decimals: 1});
                    if(cash < pr_new_beehive && new_beehive.is("not_available") == false){
                        this.color = RED;
                    } else {
                        this.color = "";
                    }
                }
            },
            anchor("right"),
            pos(-BUTTON_SIZE * 4,BUTTON_SIZE * 1.7),
            z(Z_UI_TOP),
        ])
        const text_nb_beehives = new_beehive.add([
            text(formatNumber(nb_beehives, {useOrderSuffix: true}),{
                size : BUTTON_SIZE * BUTTON_NB_TXT_SCALE,
                font:"d",
            }),
            {
                update(){
                this.text = formatNumber(nb_beehives, {useOrderSuffix: true});
                }
            },
            anchor("right"),
            pos(-BUTTON_SIZE * 6,BUTTON_SIZE * 3.6),
            z(Z_UI_TOP),
        ])

        //test: info button = tree
        const information_0 = NEWBOX.add([
            sprite('info'), 
            anchor("topright"),
            pos(new_tree.pos.x - 165, new_tree.pos.y),
            scale(1),
            area(),
            z(Z_UI),
            {dia : 0},
            "ui",
            "button",
            "new_button",
            "info",
         ])
        //bird
         const information_1 = NEWBOX.add([
            sprite('info'), 
            anchor("topright"),
            pos(new_bird.pos.x - 165, new_bird.pos.y),
            scale(1),
            area(),
            z(Z_UI),
            {dia: 1},
            "ui",
            "button",
            "new_button",
            "info",
         ])
        //bee
         const information_2 = NEWBOX.add([
            sprite('info'), 
            anchor("topright"),
            pos(new_bee.pos.x - 165, new_bee.pos.y),
            scale(1),
            anchor("topright"),
            area(),
            z(Z_UI),
            {dia : 2},
            "ui",
            "button",
            "new_button",
            "info",
         ])
        //beehive
         const information_3 = NEWBOX.add([
            sprite('info'), 
            anchor("topright"),
            pos(new_beehive.pos.x - 165, new_beehive.pos.y),
            scale(1),
            anchor("topright"),
            area(),
            z(Z_UI),
            {dia : 3},
            "ui",
            "button",
            "new_button",
            "info",
         ])

        //Left side
        //pollution
         const information_4 = EVENTS.add([
            sprite('info'), 
            anchor("topleft"),
            pos(icon_pollution.pos.x + 200, icon_pollution.pos.y - 12),
            scale(1),
            area(),
            z(Z_UI),
            {dia : 4},
            "ui",
            "button",
            "new_button",
            "info",
         ])
        //deforestation
         const information_5 = EVENTS.add([
            sprite('info'), 
            anchor("topleft"),
            pos(icon_defo.pos.x + 200, icon_defo.pos.y - 12),
            scale(1),
            area(),
            z(Z_UI),
            {dia : 5},
            "ui",
            "button",
            "new_button",
            "info",
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
        let y_st = H/2 + 50; vec2(W/2,y_st)
        const start_tree = add([
            sprite(`tree0`),
            pos(vec2(W/2,y_st)),
            scale(y_st * TREE_SCALE),
            anchor("bot"),
            area(),
            z(y_st),
            //health(health_tree),
            "tree",
            "hiveable",
            "clickable",
            "start_tree",
        ]);

    //ADDING EVENT LISTENERS
    //Game elements (inside an if(get("dialog").lenght == 0) to make sure it is impossible to click things if dialogues are on)
        //click any tree
        let nb_clicks = 0;
        onClick("tree", (t) => { 
             //test: click tree
            music = play('button_click'); //it works with onclick
        
            if (diaL == 0) {
                plus(1);
                nb_clicks++;
                if(nb_clicks == flowered_clicks && t.is("flowered") != true){
                    const flowers = add([
                        sprite("flowers0"),
                        anchor("bot"),
                        pos(t.pos),
                        z(t.z+1),
                        scale(t.scale),
                        area(),
                        "flowers",
                    ])
                    t.use("flowered");
                }
                if(nb_clicks > flowered_clicks){
                    nb_clicks = 0;
                }
                //particles when clicked
                for (let i = 0; i < randi(0,3); i++) {
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
        onClick("flowers", (t) => {
            if (diaL == 0) {
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
                    let ran = randi(7);
                    if (ran == 2) {
                        destroy(t);
                    }
                }
                if(pollu_stat < 5){
                    destroyAll("trash")
                }
            }
            music = play('trash_click');
        })
        //click the bulldozer
        onClick("bulldozer", (t) => { 
            if (diaL == 0) {
                //particles when clicked
                for (let i = 0; i < randi(5); i++) {
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
            music = play('bulldozer_click'); 
        });
        onClick("info", (t) => {
            diaBubble(dia_info[t.dia]);
            music = play('button_click'); //it works with onclick
        });
        onDestroy("trash", (t) =>{
            for (let i = 0; i < randi(5); i++) {
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
            music = play('tree_leaf', {
                            volume: 5,});
            for (let i = 0; i < randi(10,20); i++) {
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
        onDestroy("flowers", (t) => {
            for (let i = 0; i < randi(10,20); i++) {
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
        onDestroy("beehive", (t) => {
            for (let i = 0; i < randi(10,20); i++) {
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
            for (let i = 0; i < randi(10,30); i++) {
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
                music_bulldozer.stop(); 
            }
            icon_bear.use(sprite("bear"));
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

        //Pause menu
        //onKeyRelease("p", () => {
        //    diaBubble(dia_others[0]);
        //})
        //onKeyRelease("escape", () => {
        //    diaBubble(dia_others[0]);
        //})

        //get a fun fact
        //onClick("bear", (t) => {
        //    diaBubble(choose(dia_funfact));
        //})
        

    //UI elements
        //click any button
        onClick("button", (b) => {
            if (diaL == 0 && b.is("not_available") == false) {
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
            //New bird
            onClick("new_bird", (t) =>{
                if (diaL == 0) {
                    if(cash < pr_new_bird){
                        warning(text_cash);
                        warning(text_new_bird_price);
                    } else {
                        addBird();
                        music = play('birds_bg', {
                            volume: 2,
                        });
                    }
                }
            })
            //New bee
            onClick("new_bee", (b) =>{
                if (diaL == 0 && b.is("not_available") == false){
                    if(cash < pr_new_bee){
                        warning(text_cash);
                        warning(text_new_bee_price);
                    } else {
                        addBee();
                    }
                } else if(diaL == 0 && b.is("not_available")){
                    warning(b);
                };
            })
            //New beehive
            onClick("new_beehive", (b) =>{
                if (diaL == 0 && b.is("not_available") == false){
                    if(cash < pr_new_beehive){
                        warning(text_cash);
                        warning(text_new_beehive_price);
                    } else {
                        addBeehive();
                    }
                } else if(diaL == 0 && b.is("not_available")){
                    warning(b);
                };
            });
    //AUTOMATIC STUFF
        loop(1, () => {
            if (diaL == 0) { //Pauses the game if dialogue is opened
                //Timer
                if(time > 0){
                    time = time - 1
                };       
                      
                //Each element gives cash overtime
                plus(cps_final);
    
                //Increase the events stats
                let r_pollu = randi(10);
                if (r_pollu != 2 && pollu_stat <= MAX_EVENT_STAT) {
                    pollu_stat = pollu_stat + pollu_boost;
                }
                let r_defo = randi(3);
                if (r_defo != 2 && defo_stat <= MAX_EVENT_STAT) {
                    defo_stat = defo_stat + defo_boost;
                }
                if (pollu_stat >= MAX_EVENT_STAT){
                    pollu_over++;
                }
                if (defo_stat >= MAX_EVENT_STAT){
                    defo_over++;
                    if(get("bulldozer").length == 0){
                        addBulldozer();
                        music_bulldozer = play('bulldozer', {
                            loop: true,
                        });
                        icon_bear.use(sprite("bear_scared"));
                    }
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

        let p = 0; let d = 0;
        onUpdate(() => {    
        diaL        = get("dialog").length; //length to check if the dialogue is existent
        nb_trees    = get('tree').length;
        nb_bees     = get('bee').length;
        nb_birds    = get('bird').length;
        nb_trash    = get('trash').length;
        nb_flowered = get('flowered').length;
        nb_beehives = get('beehive').length;

        cps_tree = cps_t_base * (nb_bees * nb_flowered + 1);

         cash_per_sec = (nb_trees * cps_tree);
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
    })

    //FUNCTIONS
       //Add a new tree
       function addTree() {
        music = play('tree_leaf', {
            volume: 5,
        });
         let ranYA = H/2;
         let ranYB = H/2 + (BG_TILE_SIZE/2 - 40 * SPRITE_BG_SCALE)
         const randX  = rand(0, W);
         const randY  = rand(ranYA, ranYB);

            const saturation = calculateSaturation(randY, ranYA, ranYB);
            // CHATGPT Calculate RGB values based on saturation level
            const color = calculateColor(saturation);
         //const relScale = 0.1 + (0.5 - 0.1) * ((this.pos.y - ranA) / (ranB - ranA)); //relative scale to the Y position
         const tree  = add([
             sprite(choose(trees)),
             pos(randX, randY),
             scale(randY * TREE_SCALE),
             anchor("bot"),
             area(),
             z(randY),
             //health(health_tree),
             "tree",
             "hiveable",
          ]);
          tree.color = rgb(color.red, color.green, color.blue);
            pay(pr_new_tree);
            //exp(pr_new_tree); //PK çA MARCHE PAS??????
            pr_new_tree = pr_new_tree * scaling;
       }
        //Add custom new tree
       function addCustTree(x,y) {
         const tree  = add([
             sprite(choose(trees)),
             pos(x,y),
             scale(y * TREE_SCALE),
             anchor("bot"),
             area(),
             z(y),
             //health(health_tree),
             "tree",
             "hiveable"
          ])
            //exp(pr_new_tree); //PK çA MARCHE PAS??????
       }
       //Add a new bee
       function addBee(){
        let rF = choose(get('flowered'));
        let rB = choose(get('beehive'));
        let b = 0;
        const bee = add([
            sprite('bee'),
            pos(choose(-10, W + 10), H/2),
            scale(H/2 * BEE_SCALE),
            anchor('center'),
            area(),
            z(rF.z),
            {
                update(){
                    if (diaL === 0) {
                        this.z = this.pos.y + 100;
                        this.scale = this.pos.y * BEE_SCALE;
                        if (b === 0 && nb_flowered != 0) {
                            if (this.pos.x > rF.pos.x) {
                                this.flipX = true;
                            } else {
                                this.flipX = false;
                            }
                            this.moveTo(rF.pos.x, rF.pos.y - 50, BEE_SPEED);
                            if(this.pos.x == rF.pos.x && this.pos.y == rF.pos.y - 50){
                                b++;
                                this.z = rF.z + 1;
                                rF = choose(get("flowered"));
                                rB = choose(get("beehive"));
                            };
                        } else if (b === 0 && nb_flowered == 0){
                            this.moveTo(rand(W), rand(H), BEE_SPEED);
                        }
                        if (b === 1 && nb_beehives != 0) {
                            if (rB == undefined){
                                rB = choose(get("beehive"));
                            }
                            if (this.pos.x > rB.pos.x) {
                                this.flipX = true;
                            } else {
                                this.flipX = false;
                            }
                            this.moveTo(rB.pos.x, rB.pos.y, BEE_SPEED);
                            if(this.pos.x == rB.pos.x && this.pos.y == rB.pos.y){
                                //bee pop sound when bee enters hive
                                music = play('bee_in_hive');
                                b++;
                                honey++;
                            };
                        } else if ((b === 1 || b === 2) && nb_beehives == 0){
                            this.moveTo(rand(W), rand(H), BEE_SPEED);
                        };
                        if(b === 2){
                            zoomIn(rB)
                                this.z = 0;
                                wait(2, () =>{
                                    zoomOut(rB);
                                    this.z = this.pos.y + 100;
                                    b = 0;
                                });
                        }
                    }
                },
            },
            "bee",
        ])
            pay(pr_new_bee);
            //change with function
            pr_new_bee  = pr_new_bee * scaling;
       }
        //Add a new bee
         function addBeehive(){
         let rT = choose(get('hiveable'));
         const beehive = add([
            sprite('beehive0'),
            pos(rT.pos.x + 5, rT.pos.y - 20),
            scale(rT.pos.y * BEEHIVE_SCALE),
            anchor('center'),
            area(),
            z(rT.z + 2),
            "beehive",
         ]);
            rT.unuse("hiveable");
            rT.use("unhiveable");
            pay(pr_new_beehive);
            //change with function
            pr_new_beehive  = pr_new_beehive * scaling;
        }
        //Add a new trash
         function addTrash() {
         const randX  = rand(0, W - icon_bear.pos.x);
         const randY  = rand((H/2 + (BG_TILE_SIZE/2 - 40 * SPRITE_BG_SCALE)) + 10, (H/2 + (BG_TILE_SIZE/2 - 40 * SPRITE_BG_SCALE)) - 10);
         const trash  = add([
             sprite('trash'),
             pos(randX, randY),
             scale(TRASH_SCALE ),
             anchor("bot"),
             area(),
             z(randY),
             "trash",
          ]);
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
                                music = play('tree_fall');
                                destroy(rT);
                                rT = choose(get('tree'));
                            }
                            this.onCollide("flowers", (f) => {
                                f.destroy();
                            })
                            this.onCollide("flowered", (f) => {
                                f.unuse("flowered");
                            })
                            this.onCollide("beehive", (b) => {
                                b.destroy();
                            })
                            this.onCollide("unhiveable", (t) => {
                                t.unuse("unhiveable");
                                t.use("hiveable");
                            })
                        }
                    },
                },
                z(1),
                scale(H/2 * BULLDOZER_SCALE),
                area(0.5),
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
            destroyAll("space_bar");
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
                text(array_with_number[1], { size: 16, font:"d", width: width - 15, align: "center" }),
                pos(bubble.pos),
                anchor("center"),
                color(0, 0, 0),
                z(Z_UI_BOTTOM),
                area(),
                "dialog",
            ])
            //space bar, is destroyed when dialogs are destroyed
            const space = add([
                sprite("space_bar"),
                anchor("center"),
                pos(BEARBOX.pos.x + 450, BEARBOX.pos.y - 50),
                z(Z_UI_BOTTOM),
                outline(4),
                area(),
                scale(4),
                "dialog",
            ])
            icon_bear.use(sprite(array_with_number[0]));
            icon_bear.use(scale(BEAR_SCALE));
       }

       function calculateSaturation(yPos, minY, maxY) {
            // Calculate the percentage of yPos within the range minY to maxY
            const percentage = (yPos - minY) / (maxY - minY);
        
            // Calculate saturation based on the percentage
            // For demonstration, we'll linearly interpolate from 100 to 0 as yPos increases
            const saturation = 100 - (percentage * 100);
        
            return saturation;
        }
        function calculateColor(saturation) {
            // Calculate RGB values based on saturation
            // For demonstration, we'll use a simple linear interpolation from gray to fully saturated color
            //ICI POUR CHANGER SATURATION - trial and error
            const grayValue = 600; // Middle gray value
            const maxColorValue = 100; // Maximum color value
            const colorValue = grayValue + ((maxColorValue - grayValue) * (saturation / 100));
        
            // Return an object containing RGB values
            return {
                red: colorValue,
                green: colorValue,
                blue: colorValue
            };
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
    setBackground(rgb(79, 146, 240));

    let playerName = "";
    let playerScore = honey;
    let colors = [RED, GREEN, BLUE, YELLOW, MAGENTA, CYAN, WHITE, BLACK];
    let currentColorIndex = 6; // Default to WHITE

    // Custom color adjustment values
    let customColor = { r: 255, g: 255, b: 255 };

    const inputBox = add([
        text("Tappe ton nom !", {font:"d", size: 30 }),
        color(0, 0, 0),
        pos(width() / 2, height() / 3 - 50),
        anchor("center"),
    ]);

    const input = add([
        text("", {font:"d", size: 40 }),
        pos(width() / 2, height() / 3 + 40),
        anchor("center"),
        {
            update() {
                this.text = playerName;
                this.color = rgb(customColor.r, customColor.g, customColor.b);
            },
        },
    ]);

    onCharInput((ch) => {
        if (playerName.length < 10) {
            playerName += ch;
        }
    });

    onKeyPress("backspace", () => {
        playerName = playerName.substring(0, playerName.length - 1);
    });

    onKeyPress("up", () => {
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        customColor = { r: colors[currentColorIndex].r, g: colors[currentColorIndex].g, b: colors[currentColorIndex].b };
    });

    onKeyPress("down", () => {
        currentColorIndex = (currentColorIndex - 1 + colors.length) % colors.length;
        customColor = { r: colors[currentColorIndex].r, g: colors[currentColorIndex].g, b: colors[currentColorIndex].b };
    });

    onKeyDown("left", () => {
        customColor.r = Math.max(0, customColor.r - 1);
        customColor.g = Math.max(0, customColor.g - 2);
        customColor.b = Math.max(0, customColor.b - 3);
    });

    onKeyDown("right", () => {
        customColor.r = Math.min(255, customColor.r + 1);
        customColor.g = Math.min(255, customColor.g + 2);
        customColor.b = Math.min(255, customColor.b + 3);
    });

    const confirmButton = add([
        rect(200, 50, { radius: 15 }),
        pos(width() / 2, height() / 2),
        anchor("center"),
        outline(4),
        area(),
        "confirmButton",
        "button",
    ]);

    const confirmButtonText = add([
        text("Confirmer", {font:"d", size: 20 }),
        color(0, 0, 0),
        pos(width() / 2, height() / 2),
        anchor("center"),
        area(),
        "confirmButton",
        "button",
    ]);

    function saveScore() {
        if (playerName !== "") {
            let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
            let newEntry = {
                name: playerName,
                score: playerScore,
                color: customColor
            };

            if (!highScores.some(entry => entry.name === newEntry.name && entry.score === newEntry.score && entry.color.r === newEntry.color.r && entry.color.g === newEntry.color.g && entry.color.b === newEntry.color.b)) {
                highScores.push(newEntry);
            }

            highScores = highScores.sort((a, b) => b.score - a.score);

            localStorage.setItem('highScores', JSON.stringify(highScores));

            go("highScoreDisplay", { playerName, playerScore, playerColor: newEntry.color });
        }
    }

    onClick("confirmButton", saveScore);
    onKeyRelease("enter", saveScore);
});

scene("highScoreDisplay", ({ playerName, playerScore, playerColor }) => {
    setBackground(rgb(79, 146, 240));

    add([
        text("Ton score :", {font:"d", size: 30 }),
        pos(width() / 2, height() / 4 - 50),
        anchor("center"),
    ]);

    add([
        text(`${playerScore}`, {font:"d", size: 40 }),
        pos(width() / 2, height() / 4),
        anchor("center"),
    ]);

    add([
        text("Meilleurs joueurs :", {font:"d", size: 30 }),
        pos(width() / 2, height() / 2),
        anchor("center"),
    ]);

    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    highScores.slice(0, 3).forEach((entry, index) => {
        add([
            text(`${index + 1}. ${entry.name} : ${entry.score}`, {font:"d", size: 25 }),
            pos(width() / 2, height() / 2 + 50 + index * 30),
            anchor("center"),
            color(rgb(entry.color.r, entry.color.g, entry.color.b)),
        ]);
    });

    const buttonYPos = height() - 100;

    const replayButton = add([
        rect(150, 50, { radius: 15 }),
        anchor("center"),
        pos(width() / 2 - 170, buttonYPos),
        outline(4),
        area(),
        "replayButton",
        "button",
    ]);

    const replayButtonText = add([
        text("Rejouer", {font:"d", size: 18 }),
        color(0, 0, 0),
        pos(width() / 2 - 170, buttonYPos),
        anchor("center"),
        area(),
        "replayButton",
        "button",
    ]);

    onClick("replayButton", (b) => {
        time = 300;
        music = play('default_music', {
            loop: true,
            volume: 0.5,
        });
        go("game");
    });

    const scoreboardButton = add([
        rect(150, 50, { radius: 15 }),
        anchor("center"),
        pos(width() / 2, buttonYPos),
        outline(4),
        area(),
        "scoreboardButton",
        "button",
    ]);

    const scoreboardButtonText = add([
        text("Scoreboard", {font:"d", size: 14 }),
        color(0, 0, 0),
        pos(width() / 2, buttonYPos),
        anchor("center"),
        area(),
        "scoreboardButton",
        "button",
    ]);

    onClick("scoreboardButton", (b) => {
        go("scoreboard");
    });

    const menuButton = add([
        rect(150, 50, { radius: 15 }),
        anchor("center"),
        pos(width() / 2 + 170, buttonYPos),
        outline(4),
        area(),
        "button",
        "menuButton",
    ]);

    const menuButtonText = add([
        text("Menu", {font:"d", size: 18 }),
        color(0, 0, 0),
        pos(width() / 2 + 170, buttonYPos),
        anchor("center"),
        area(),
        "button",
        "menuButton",
    ]);

    onClick("menuButton", (b) => {
        go("startMenu");
    });
});

scene("scoreboard", () => { //More GPT aussi
    setBackground(rgb(79, 146, 240));

    const buttonYPos = 50;
    const scoreListYStart = 150;
    const maxVisibleItems = Math.floor((height() - scoreListYStart) / 40);
    let scrollOffset = 0;

    // Rejouer button
    const replayButton = add([
        rect(150, 50, { radius: 15 }),
        anchor("topright"),
        pos(width() / 2 - 10, buttonYPos),
        outline(4),
        area(),
        "replayButton",
        "button",
    ]);

    const replayButtonText = replayButton.add([
        text("Rejouer", {font:"d", size: 18 }),
        color(0, 0, 0),
        pos(-10,18),
        anchor("topright"),
        area(),
        "replayButton",
        "button",
    ]);
    onClick("replayButton", () => {
        time = 300;
        music = play('default_music', {
            loop: true,
            volume: 0.5,
        });
        go("game");
    });
    // Menu button
    const menuButton = add([
        rect(150, 50, { radius: 15 }),
        anchor("topleft"),
        pos(width() / 2 + 10, buttonYPos),
        outline(4),
        area(),
        "menuButton",
        "button",
    ]);
    const menuButtonText = menuButton.add([
        text("Menu", {font:"d", size: 18 }),
        color(0, 0, 0),
        pos(40,18),
        anchor("topleft"),
        area(),
        "menuButton",
        "button",
    ]);

    onClick("menuButton", () => {
        go("startMenu");
    });

    // Fetch high scores
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    function drawScores() {
        destroyAll("scoreItem");

        highScores.slice(scrollOffset, scrollOffset + maxVisibleItems).forEach((entry, index) => {
            add([
                text(entry.name, {font:"d", size: 25 }),
                pos(width() / 2 - 20, scoreListYStart + index * 40),
                anchor("right"),
                color(rgb(entry.color.r, entry.color.g, entry.color.b)),
                "scoreItem"
            ]);

            add([
                text(entry.score, {font:"d", size: 25 }),
                pos(width() / 2 + 20, scoreListYStart + index * 40),
                anchor("left"),
                color(rgb(entry.color.r, entry.color.g, entry.color.b)),
                "scoreItem"
            ]);
        });
    }

    drawScores();

    // Scroll functionality
    onKeyPress("up", () => {
        if (scrollOffset > 0) {
            scrollOffset -= 1;
            drawScores();
        }
    });

    onKeyPress("down", () => {
        if (scrollOffset < highScores.length - maxVisibleItems) {
            scrollOffset += 1;
            drawScores();
        }
    });

    onScroll((dir) => { //I don't know how this works
        if (dir === "up" && scrollOffset > 0) {
            scrollOffset -= 1;
        } else if (dir === "down" && scrollOffset < highScores.length - maxVisibleItems) {
            scrollOffset += 1;
        }
        drawScores();
    });

        // Add the small text at the bottom right
        add([
            text("utilise les touches flèches pour descendre/monter", {font:"d", size: 10 }),
            pos(width() - 20, height() - 20),
            anchor("botright"),
            color(rgb(0, 0, 0)),
        ]);
});

//GENERAL FUNCTIONS
    //Zoom out
    function zoomOut(t){
        t.width  = t.width   * CLICK_JUMP;
        t.height = t.height  * CLICK_JUMP;            
        wait(0.1, () => {
            t.width  = t.width  / CLICK_JUMP;
            t.height = t.height / CLICK_JUMP;
        });
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

    onClick("button", (t) => {
        music = play('button_click'); //it works with onclick
    })
    //THESE DON'T WORK FOR SOME REASON
    onHover("button", (b) => {
        console.log("HOVERING")
        b.use(shader("lighten"));
    })
    onHoverEnd("button", (b) => {
        console.log("H-over")
        b.use(shader(""));
    })

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
        ["bear_happy", "Bienvenue au Click A Tree! Tu peux appuyer sur la barre d'espace pour passer à la prochaine bulle de dialogue."], 
        ["bear_sad", "Ce vieil ours est malheureusement en manque de miel et aura besoin d'un peu d'aide pour obtenir ce produit sucré."],
        ["bear_talking", "Est-ce que tu serais prêt.e à m'aider? Je suis sûr qu'on formera une belle équipe."],
        //["bear", "En cliquant sur l'arbre du milieu, tu pourras accumuler des points qui te permettront d'acheter des arbres que tu peux voir en haut à droite."],
        //["bear_wink", "Je te laisse découvrir la suite!"],
        ["bear_info", "Clique sur l'arbre pour commencer et n'hésite pas à appuyer sur les cercles 'i' en bleu pour avoir plus d'informations utiles."],
        ["bear_talking", "Je te laisse découvrir la suite! Tu as 5 minutes pour m'aider à créer une belle forêt mais surtout à récupérer mon miel."],
    ] //tout bon
    const dia_pollution = [
        //["bear_scared", "Attention!! La barre de pollution augmente vite!"],
        ["bear_wink", "Savais-tu que si on protège l'habitat d'une espèce, on aide aussi beaucoup d'autres espèces qui vivent au même endroit?"], //1er
        ["bear_wink", "Savais-tu que les zones protégées sont créées surtout pour protéger les animaux, les plantes et les paysages magnifiques?"],
        //1580 - text to change later
        ["bear_wink", "Savais-tu que planter des arbres aide à nettoyer l'air et à réduire la pollution?"],
    ]
    const dia_deforestation = [
        //["bear_scared", "Attention!! La barre de déforestation augmente vite!"],
        ["bear_wink", "Savais-tu que les abeilles ont un rôle très important pour la pollinisation des plantes et dans la production des aliments?"], //2e
        ["bear_wink", "Savais-tu que même les petites actions comme ramasser les déchets dans la nature peuvent aider à protéger les animaux?"],
        ["bear_wink", "Savais-tu que tu peux aider à protéger les abeilles en plantant des fleurs dans ton jardin?"],
    ]
    //on garde ou non?
    //const dia_funfact = [
    //    ["bear_wink", "Ceci est un test !"],
    //    ["bear_wink", "Ceci est un 2e test :)"],
    //]
    //peut-être une seule ligne ?
    const dia_info = [
        //tree
        ["bear_wink", "Après avoir accumulé assez de feuilles, tu pourras acheter des arbres. Le prix des arbres augmente à chaque fois que tu achètes un arbre."],
        //bird 
        ["bear_wink", "Après avoir accumulé assez de feuilles, tu pourras acheter des oiseaux qui disperseront les graines pour t'aider à créer ta forêt."],
        //bee
        ["bear_flower", "Clique plusieurs fois sur un arbre et de belles fleurs apparaîtront. À ce moment là, les abeilles pourront récupérer leur nectar. Seules trois abeilles par arbre sont autorisées."],
        //beehive
        ["bear_wink", "Si tu as au moins une abeille dans ta forêt, tu pourras placer une ruche. Tes abeilles déposeront leur nectar dans ces ruches afin de créer un bon miel sucré!"],
        //pollution
        ["bear_wink", "Cette barre représente la pollution. Dès qu'elle est remplie, tu auras des déchets qui apparaîtront. Clique dessus pour les enlever!"],
        //deforestation
        ["bear_wink", "Cette barre représente la déforestation. Dès qu'elle est remplie, tu auras un bulldozer qui apparaîtra. Clique dessus pour l'enlever!"],
    ]
    //others
    const dia_others = [
        //pause
        ["bear_talking", "Ne t'inquiète pas, le jeu est en pause. Clique sur espace pour reprendre !"]
    ]


// we finally have a start scene, yay!
function startGame() {
    go("startMenu");
}
startGame();
