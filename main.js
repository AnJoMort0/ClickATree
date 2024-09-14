//IDEAS TO ADD
    //Minimal animations for the bees (for example move around when reach a tree)
    //Multiple Languages
    //Darker colors at the beginning -> progress saturation the bigger the forest
    //Have all scales depend on screen size --> I'm going to lock screen size instead, it's a better way to make scores universal and prevent weird things when loading in different devices
    //Create a fire event when auto-clicker
    //Hide HUD button

//KNOWN BUGS
    // When multiple trees overlap, the player gets multiple points in a single click
        //* Fixed it by calling it a feature
    // You can continue clicking the trees and placing them even when the timer stops
        //* Fixed
    // There's the possibility of clicking something when it is destroyed
        //Seems fixed
    //If a flower grows on a growing tree it stays small
        //* Fixed by adding "grown" tag
    //Bulldozer should roam randomly when he doesn't have trees to destroy
        //* Done
    //Beehives scaling like crazy
        //* Fixed
    // When using the on screen keyboard the click is processed multiple times
        //To fix this for now, you can't input twice the same key in a row

//===================================================================//
//===================================================================//

const VERSION = "v.beta.1.5.0.sga"

kaboom({
    background  : [0, 191, 255],    //I would like to make this a const value, but I can't seem to do it.
    width       : 1280,             //Even if the size is blocked from version beta.1.2.0, the relative size functions will stay in case we try to make it work at a later date
    height      : 720,
    letterbox   : true,
})

// Universal values
const W     = width();
const H     = height();
let inGame  = false;    //for the Rejouer vs Jouer in the leaderboard
setGravity(800);
const CLICK_JUMP                = 1.05;
const CHAL_TIME                 = 300;  //set the timer for the timed mode
let timer                       = -10;
let honey                       = 0;
let boughtBird                  = false; //this value is kinda doubled but for 2 different purposes, thought of fusing them but I guess better not to not be confused
let hasBulldozerSound           = false;

const SPRITE_PIXEL_SIZE         = 25;   //value of the sprites' original size
const SPRITE_ICON_SCALE         = 1.4;  //value to scale the sprites
const ICON_SIZE                 = SPRITE_PIXEL_SIZE * SPRITE_ICON_SCALE;    //object's size in game
const SPRITE_BG_PIXEL_SIZE      = 250;
const SPRITE_BG_SCALE           = 3;
const BG_TILE_SIZE              = SPRITE_BG_PIXEL_SIZE * SPRITE_BG_SCALE;
const SPRITE_BUTTON_PIXEL_SIZE  = 400;
const SPRITE_BUTTON_SCALE       = 0.2;
const BUTTON_SIZE               = SPRITE_BUTTON_PIXEL_SIZE * SPRITE_BUTTON_SCALE;
const BUTTON_PRICE_TXT_SCALE    = 0.9;  //scaling for the texts on the buttons
const BUTTON_NB_TXT_SCALE       = 0.8;
const BG_Y                      = H/2;  //placing of the y position of the background sprites
const NB_BG_X_TILES             = Math.floor(W/(BG_TILE_SIZE)) + 1; //in case non-fixed screen size, this will check how many background sprite tiles are needed to fill the screen
const NB_BG_Y_TILES             = Math.floor(H/(BG_TILE_SIZE)) + 1;
const BEAR_SCALE                = 8;
const BEAR_SMALL_SCALE          = BEAR_SCALE / 2;
// Z values:
    const Z_UI        = H    + 125;
    const Z_UI_TOP    = Z_UI + 1;
    const Z_UI_BOTTOM = Z_UI - 1;
// Relative scale of objects to screen height
    const TREE_SCALE        = 1/100; 
    const TRASH_SCALE       = 3;    //trash was never calculated to screen size, will need it changed if that were to change
    const BULLDOZER_SCALE   = 1/90;
    const BIRD_SCALE        = 1/320;
    const BEE_SCALE         = 1/350;
    const BEEHIVE_SCALE     = 1/300;
// Speed of moving elements
    const BULLDOZER_SPEED   = 60;
    const BIRD_SPEED        = 50;
    const BEE_SPEED         = 40;
//Achievements
    let achieved_lone_wolf         = localStorage.getItem('achieved_lone_wolf')         === 'true' ? true : false;  // Completes the game with one tree
    let achieved_bee_whisperer     = localStorage.getItem('achieved_bee_whisperer')     === 'true' ? true : false;  // Completes the game with one bee and one hive
    let achieved_forest_lord       = localStorage.getItem('achieved_forest_lord')       === 'true' ? true : false;  // Has more than 200 trees
    let achieved_gardener_dedicated= localStorage.getItem('achieved_gardener_dedicated')=== 'true' ? true : false;  // Has more than 75 trees planted without birds
    let achieved_bird_kingdom      = localStorage.getItem('achieved_bird_kingdom')      === 'true' ? true : false;  // Has more than 75 birds
    let achieved_bee_master        = localStorage.getItem('achieved_bee_master')        === 'true' ? true : false;  // Has more than 50 bees
    let achieved_perfect_bloom     = localStorage.getItem('achieved_perfect_bloom')     === 'true' ? true : false;  // Has more than 100 trees with flowers
    let achieved_leaf_tycoon       = localStorage.getItem('achieved_leaf_tycoon')       === 'true' ? true : false;  // Accumulates more than 200k leaves
    let achieved_falling_leaves    = localStorage.getItem('achieved_falling_leaves')    === 'true' ? true : false;  // Has a passive income of 1k/s
    let achieved_economist         = localStorage.getItem('achieved_economist')         === 'true' ? true : false;  // Doesn't use any leaves for 1 minute
    let achieved_tree_guardian     = localStorage.getItem('achieved_tree_guardian')     === 'true' ? true : false;  // Doesn't let the bulldozer destroy any tree
    let achieved_curious           = localStorage.getItem('achieved_curious')           === 'true' ? true : false;  // Click on all "i"s
    let achieved_hidden_secret     = localStorage.getItem('achieved_hidden_secret')     === 'true' ? true : false;  // Click on the arrow keys when typing the name
    let achievementQueue = [];
    let achievementActive = false;
    //Checks if the achievements were already true or false
    let alw  = achieved_lone_wolf         ? 2 : 0;
    let abw  = achieved_bee_whisperer     ? 2 : 0;
    let afl  = achieved_forest_lord       ? 2 : 0;
    let agd  = achieved_gardener_dedicated? 2 : 0;
    let abk  = achieved_bird_kingdom      ? 2 : 0;
    let abm  = achieved_bee_master        ? 2 : 0;
    let apb  = achieved_perfect_bloom     ? 2 : 0;
    let alt  = achieved_leaf_tycoon       ? 2 : 0;
    let afls = achieved_falling_leaves    ? 2 : 0;
    let ae   = achieved_economist         ? 2 : 0;
    let atg  = achieved_tree_guardian     ? 2 : 0;
    let ac   = achieved_curious           ? 2 : 0;
    let ahs  = achieved_hidden_secret     ? 2 : 0;

// Load assests for the game
loadRoot('assets/');
    // Load the custom font
    loadFont("d", "assets/Press_Start_2P/PressStart2P-Regular.ttf");
    /*Copyright 2012 The Press Start 2P Project Authors (cody@zone38.net), with Reserved Font Name "Press Start 2P".
    This Font Software is licensed under the SIL Open Font License, Version 1.1.
    This license is copied below, and is also available with a FAQ at:
    https://openfontlicense.org */
    
    /**
     * Load images saved under the game_elements folder
     * Folders under game_elements include: 
     * background, bear, leaves, other, trees and vfx
     * 
     * Images created with the free online pixel art editor: Piskel
     */

    // Game elements 
        // Background 
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
        // Trees
        loadSprite('tree0', "game_elements/trees/tree0.png");
        loadSprite('tree1', "game_elements/trees/tree1.png");
        loadSprite('tree2', "game_elements/trees/tree2.png");
        loadSprite('tree3', "game_elements/trees/tree3.png");
        const trees = ["tree0", "tree1", "tree2", "tree3"];
        // Leaves
        loadSprite('leaf0', "game_elements/leafs/leaf0.png");
        loadSprite('leaf1', "game_elements/leafs/leaf1.png");
        const leafs = ["leaf0", "leaf1"];
        leafs.forEach((spr) => {
            loadSprite(spr, `game_elements/leafs/${spr}.png`);
        })
        // Flowers
        loadSprite('flowers0'   , 'game_elements/vfx/flowers0.png');
        // Others
        loadSprite('bee'        , 'game_elements/other/bee_animation.png', { 
            sliceX: 3,
            sliceY: 3,
            anims: {
                main: {from: 0 , to: 1 ,loop: true},
                pollen: {from: 2, to: 7, loop: true},
            }
        });
        loadSprite('trash'      , 'game_elements/other/trashcan_.png')
        loadSprite('bulldozer'  , 'game_elements/other/bulldozer.png', {
            sliceX: 2,
            sliceY: 3,
            anims: {
                main: {from: 0, to: 5,loop: true},
            }
        })
        loadSprite('bird'       , 'game_elements/other/bird.png', { //this one is not ours, so the format is not the same
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
        loadSprite('honey'          , 'game_elements/other/honey.png');
        loadSprite('beehive0'       , 'game_elements/other/beehive0.png');
        loadSprite('space_bar'      , 'game_elements/other/space_bar.png');
        // Bear
        loadSprite('bear'           , 'game_elements/bear/bear.png');
        loadSprite('bear_scared'    , 'game_elements/bear/bear_scared.png');
        loadSprite('bear_wink'      , 'game_elements/bear/bear_wink.png');
        loadSprite('bear_happy'     , 'game_elements/bear/bear_happy.png');
        loadSprite('bear_sad'       , 'game_elements/bear/bear_sad.png');
        loadSprite('bear_talking'   , 'game_elements/bear/bear_talking.png');
        loadSprite('bear_info'      , 'game_elements/bear/bear_info.png');
        loadSprite('bear_flower'    , 'game_elements/bear/bear_flower.png');
        // Vfx 
        loadSprite('smoke'          , 'game_elements/vfx/smoke.png', { //this one is not ours so the format is not the same
            sliceX: 3,
            sliceY: 3,
            anims: {
                main: {from: 0,to: 6,},
            },
        })
    
        /**
         * Load ui elements saved under the ui folder
         * Folders under ui include: 
         * new_buttons and status_icons
         */
        // Status icons
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
        // New buttons
        loadSprite('new_tree'   , "ui/new_buttons/new_tree_button.png");
        loadSprite('new_bee'    , "ui/new_buttons/new_bee_button.png");
        loadSprite('new_bird'   , "ui/new_buttons/new_bird_button.png");
        loadSprite('info'       , "ui/new_buttons/info_button.png");
        loadSprite('new_beehive', "ui/new_buttons/new_beehive_button.png");
        loadSprite('new_empty'  , "ui/new_buttons/new_empty_button.png");

        // Load game logo saved under the icon folder
        loadSprite('logo'       , 'icon/logo.png');
        loadSprite('rays'       , 'icon/rays_backdrop.png');

/**
 * Load music and sound saved under the audio folder
 * Folders under audio include: 
 * music, other and sfx 
 * 
 * Music and sounds come from itch.io
 */
// Load ui sounds from other
    // Source: by Nathan Gibson https://nathangibson.myportfolio.com 
    loadSound('button_click'    , "audio/other/button/click.wav");
    // Source: by FilmCow https://filmcow.itch.io/filmcow-sfx
    loadSound('tree_fall'       , "audio/other/deforestation/tree_fall.wav");
    // Source: by Nathan Gibson https://nathangibson.myportfolio.com 
    loadSound('bee_in_hive'     , "audio/other/beehive/Retro7.wav");
    // Source: Minifantasy - Forgotten Plains Audio Pack by Leohpaz https://leohpaz.itch.io/minifantasy-forgotten-plains-sfx-pack
    loadSound('tree_leaf'       , "audio/other/tree/bush_rustling.wav");
    // Source: Essentials Series - Free Sound Effect by Nox_Sound_Design https://nox-sound-design.itch.io/essentials-series-sfx-nox-sound
    loadSound('bulldozer'       , "audio/other/bulldozer/truck.wav");
    // Source: brackeys platformer assets by Brackeys, Asbjørn Thirslund https://brackeysgames.itch.io/brackeys-platformer-bundle
    loadSound('bulldozer_click' , "audio/other/bulldozer/click_bulldozer.wav");
    // Source: Minifantasy - Forgotten Plains Audio Pack by Leohpaz https://leohpaz.itch.io/minifantasy-forgotten-plains-sfx-pack 
    loadSound('trash_click'     , "audio/other/trash/trash_sound.wav");
// Load sounds from sfx 
    // Source: by Diablo Luna https://pudretediablo.itch.io/butterfly
    loadSound('birds_bg'        ,"audio/sfx/birds/bird.wav");
    // Source : DASK https://dagurasusk.itch.io/retrosounds
    loadSound('error'           , "audio/sfx/error.mp3");
    loadSound('win'             , "audio/sfx/win.wav");
    //Bear sounds
        // Source : DASK https://dagurasusk.itch.io/retrosounds
        loadSound('bear_angry'  , "audio/sfx/bear/angry.wav");
        loadSound('bear_curious', "audio/sfx/bear/curious.wav");
        loadSound('bear_friend' , "audio/sfx/bear/friendly.wav");
// Load game music: 
    // Source: by Abstraction https://tallbeard.itch.io/music-loop-bundle 
    loadSound('default_music'   , "audio/music/bg_music.ogg");
    loadSound('bulldozer_music' , "audio/music/bulldozer.ogg");
    loadSound('pollution_music' , "audio/music/pollution.ogg");

//load shaders (All ChatGPT generated)
    // Grayscale shader
    loadShader("grayscale", null, `
        vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
        vec4 texColor = texture2D(tex, uv);
        float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
        return vec4(vec3(gray), texColor.a);
    }`)   
    //Red Tint shader
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
    //Lighten shader
    loadShader("lighten", null, `
    vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
        vec4 texColor = texture2D(tex, uv);
        // Define the amount to lighten
        float lightenAmount = 0.3;
        // Lighten the color by mixing with white
        vec4 lightenedColor = mix(texColor, vec4(1.0, 1.0, 1.0, 1.0), lightenAmount);
        return lightenedColor;
    }`)    
//============================//

// Globally declaring music
let music_main = play('default_music', {
        loop: true,
        volume: 0.5,
        paused: false,
    });

/**
 * SCENES
 * Including startMenu, game, gameOver, highScoreDisplay and scoreboard
 */
scene("startMenu", () => {
    inGame = false;
    const LANGUAGE = localStorage.getItem("language") || "FR"; // Language choice on localStorage or French by default
    const TXT = langData[LANGUAGE];
    
    setBackground(rgb(0, 191, 255));

    const STARTBOX  = add([anchor("center"), pos(W/2,H/2)  ,z(Z_UI_BOTTOM),"ui"]); //Creates a general place for all the objects in the main menu
    
    // Add language buttons
    const frButton = add([
        rect(50, 30, { radius: 5 }),
        pos(W - 120, 30),
        z(Z_UI_BOTTOM),
        anchor("center"),
        outline(2),
        area(),
        "frButton",
        "button",
    ]);
    const frButtonText = frButton.add([
        text("FR", { font: "d", size: 18 }),
        pos(0, 0),
        z(Z_UI),
        anchor("center"),
        color(BLACK),
        area(),
        "button"
    ]);
    const enButton = add([
        rect(50, 30, { radius: 5 }),
        pos(W - 50, 30),
        z(Z_UI_BOTTOM),
        anchor("center"),
        outline(2),
        area(),
        "enButton",
        "button",
    ]);
    const enButtonText = enButton.add([
        text("EN", { font: "d", size: 18 }),
        pos(0, 0),
        z(Z_UI),
        anchor("center"),
        color(BLACK),
        area(),
        "button"
    ]);

    //Add the logo in front of the rotating rays
    const logo = STARTBOX.add([
        sprite('logo'),
        anchor('center'),
        scale(0.45),
        pos(0, -W/8),
        z(Z_UI),
        area(),
        "logo",
    ]);

    // Add the rotating and pulsing rays backdrop
    const raysBackdrop = STARTBOX.add([
        sprite("rays"),
        anchor('center'),
        pos(logo.pos),
        scale(0.6),
        z(Z_UI_BOTTOM - 10),
        rotate(0),
        {
            update() {
                this.angle += dt() * 30;  // Rotate the backdrop by 30 degrees per second
                this.scale = wave(0.6, 0.8, time() * 2);  // Pulse effect
            }
        }
    ]);

    // Timed Start Button
    const timedStartButton = add([
        rect(350, 75, { radius: 15 }),
        anchor("center"),
        pos(STARTBOX.pos.x, STARTBOX.pos.y + 120),
        z(Z_UI_BOTTOM),
        outline(4),
        area(),
        "timedStartButton",
        "button,"
    ]);
    const timedStartText = add([
        text(TXT.challenge, {size : 30, font : "d"}),
        pos(timedStartButton.pos),
        anchor("center"),
        color(BLACK),
        z(Z_UI),
        area(),
        "timedStartButton",
        "button,"
    ]);

    const infStartButton = add([
        rect(350, 50, { radius: 15 }),
        anchor("center"),
        pos(STARTBOX.pos.x, STARTBOX.pos.y + 200),
        z(Z_UI_BOTTOM),
        outline(4),
        area(),
        "infStartButton",
        "button,"
    ]);
    const infStartText = add([
        text(TXT.infinite , {size : 18, font : "d"}),
        pos(infStartButton.pos),
        anchor("center"),
        color(BLACK),
        z(Z_UI),
        area(),
        "infStartButton",
        "button,"
    ]);

    const achievementsButton = add([
        rect(350, 30, { radius: 15 }),
        anchor("center"),
        pos(STARTBOX.pos.x, STARTBOX.pos.y + 260),
        z(Z_UI_BOTTOM),
        outline(4),
        area(),
        "achievementsButton",
        "button,"
    ]);
    const achievementsText = add([
        text(TXT.achievements, {size : 15, font : "d"}),
        pos(achievementsButton.pos),
        anchor("center"),
        color(BLACK),
        z(Z_UI),
        area(),
        "achievementsButton",
        "button,"
    ]);

    const scoreBoardButton = add([
        rect(350, 30, { radius: 15 }),
        anchor("center"),
        pos(STARTBOX.pos.x, STARTBOX.pos.y + 300),
        z(Z_UI_BOTTOM),
        outline(4),
        area(),
        "scoreBoardButton",
        "button,"
    ]);
    const scoreBoardText = add([
        text(TXT.scoreboard, {size : 15, font : "d"}),
        pos(scoreBoardButton.pos),
        anchor("center"),
        color(BLACK),
        z(Z_UI),
        area(),
        "scoreBoardButton",
        "button,"
    ]);

    const creditsButton = add([
        rect(85, 30, { radius: 5 }),
        pos(55, H - 25),
        anchor("center"),
        outline(2),
        area(),
        "creditsButton",
        "button,"
    ]);
    const creditsButtonText = creditsButton.add([
        text(TXT.about, { font: "d", size: 10 }),
        pos(0,0),
        anchor("center"),
        color(BLACK),
        area(),
        "button"
    ]);

    // Add version text at the bottom corner
    add([ 
        text(VERSION, {font:"d", size: 10 }),
        pos(W - 20, H - 20),
        anchor("botright"),
        color(BLACK),
    ]);


    // Event listeners of the different buttons
    onClick("timedStartButton", () => {    //start the timed version of the game scene
        timer = CHAL_TIME;
        go("game");
        play('button_click');
        if (bulldozerExists) {
            sound_bulldozer.stop();
        };
    });
    onClick("infStartButton", () => {      //start the infinite timer version of the game scene
        timer = -10;
        go("game");
        play('button_click');
        if (bulldozerExists) {
            sound_bulldozer.stop();
        };
    });
    onClick("achievementsButton", () => {
        go("achievements");
        play('button_click');
        if (bulldozerExists) {
            sound_bulldozer.stop();
        };
    });
    onClick("scoreBoardButton", () => {
        go("scoreboard");
        play('button_click');
        if (bulldozerExists) {
            sound_bulldozer.stop();
        };
    });
    onClick("creditsButton", () => {
        go("creditsMenu"); 
        play('button_click');
        if (bulldozerExists) {
            sound_bulldozer.stop();
        };
    });
    onClick("logo", (t) => { 
        // Leaf particles when logo is clicked
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
        play('button_click');
    });
     onClick("frButton", () => {
        localStorage.setItem('language', 'FR');
        go("startMenu");  // Restart the menu scene to reflect the language change
    });
    onClick("enButton", () => {
        localStorage.setItem('language', 'EN');
        go("startMenu");  // Restart the menu scene to reflect the language change
    });

    // Add bee moving around and easter egg message
    for (let i = 0; i < 3; i++) {
        let randX2 = rand(W);
        let randY2 = rand(H);
        let randNY = rand(H);
        const bee = add([
            sprite('bee', {
                anim: "main",
            }),
            pos(-10, randNY),
            scale(3),
            anchor('center'),
            area(),
            z(Z_UI_BOTTOM - 1),
            {
                update(){
                    // Bee moving randomly
                    if (this.pos.x > randX2) {
                        this.flipX = true;
                    } else {
                        this.flipX = false;
                    }
                    this.moveTo(randX2, randY2, BEE_SPEED * 2);
                    if(this.pos.x == randX2 && this.pos.y == randY2){
                        randX2 = rand(W);
                        randY2 = rand(H);
                    };
                },
            },
            "bee",
        ])
    }

    onClick ("bee", (b) => {
        add([
            text(TXT.bee_mess, {font:"d", size: 12, width: 125}),
            pos(mousePos()),
            anchor("center"),
            color(rgb(256, 0, 0)),
            lifespan(1, {fade: 0.3}),
            z(Z_UI_TOP),
        ]);
    });

    //This whole bit heavily chatGPT assisted
    let bulldozerExists = false;
    let currentTrees = []; // Store references to the trees
    let treeScale = 5;
    
    function growTrees() {
        let maxTrees = randi(3, 12);
        currentTrees = []; // Clear the previous trees array
        let treeIndex = 0;
    
        function addNextTree() {
            if (treeIndex < maxTrees) {
                play('tree_leaf', {volume: 5});
                const randomX = rand(50, W - 50);
                const tree = add([
                    sprite(choose(trees)),
                    pos(randomX, H - 50),
                    scale(0),
                    anchor("bot"),
                    area(),
                    "tree",
                    {
                        update() {
                            // Simulate growth
                            if (this.scale.x < treeScale) {
                                this.scale.x += 0.05;
                                this.scale.y += 0.05;
                            }
                        },
                    },
                ]);
    
                currentTrees.push(tree); // Store the tree reference
                treeIndex++;
    
                wait(0.5, addNextTree);
            } else {
                wait(2, bulldozerRun);
            }
        }
        addNextTree();
    }
    
    onDestroy("tree", (t) => {
        play('tree_fall', {volume: 1});
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
            ]);
            leaf_particle.jump(rand(100, 350));
        }
    });
    
    function bulldozerRun() {
        if (!bulldozerExists) {
            sound_bulldozer = play('bulldozer', {
                loop: true,
                volume: 0.5,
            });
            bulldozerExists = true;
            let bulldozer = add([
                sprite("bulldozer", {
                    anim: "main",
                }),
                pos(-100, H - 50),
                anchor("bot"),
                scale(4.5),
                area(),
                "bulldozer",
                {
                    update() {
                        this.flipX = true;
                        this.move(200, 0);
    
                        this.onCollide("tree", (tree) => {
                            destroy(tree);
                        });
    
                        if (this.pos.x > W + 100) {
                            destroy(this);
                            sound_bulldozer.stop();
                            bulldozerExists = false;
                            wait(2, growTrees);
                        }
                    },
                },
            ]);
        }
    }
    // Beginning of the scene
    growTrees();   
});
go("startMenu");

scene("creditsMenu", () => {
    /**
     * This scene was heavily assisted by OpenAI's chatGPT-4o.
     * The prompt and response would be too long to add to the code, here is the process of usage:
     *      Gave it the entirety of this code to serve as an example of proper Kaboom.js coding;
     *      Explained the logic of what needs to be done in this scene;
     *      Saw the poor results and tested them;
     *      Re-explained the logic and try to correct it where I couldn't find a fix;
     *      Tested a closer result and change it to fit the full purpose of the scene;
     */
    const LANGUAGE = localStorage.getItem("language") || "FR"; // Language choice on localStorage or French by default
    const TXT = langData[LANGUAGE];

    setBackground(0, 191, 255);

    const centerX           = W/2;
    const containerHeight   = H - 100;
    const lineSpacing       = 40;
    const smallLineSpacing  = 30;
    let scrollOffset        = 0;

    // Add the small text at the bottom right
    add([
        text(TXT.arrows, {font:"d", size: 10 }),
        pos(W - 20, H - 20),
        anchor("botright"),
        color(BLACK),
    ]);

    const credits = [
        { type: "title"     , text: TXT.about                                     , size: 48, weight: "bold"  , ySpacing: lineSpacing * 4 },
        { type: "text"      , text: TXT.context                                   , size: 24, tag: "supacat", ySpacing: smallLineSpacing },
        { type: "text"      , text: ' ', size: 24, ySpacing: lineSpacing },
        { type: "text"      , text: TXT.mu                                        , size: 24, ySpacing: smallLineSpacing },
        { type: "text"      , text: ' ', size: 24, ySpacing: lineSpacing },
        { type: "text"      , text: ' ', size: 24, ySpacing: lineSpacing },
        { type: "text"      , text: ' ', size: 24, ySpacing: lineSpacing },
        { type: "text"      , text: ' ', size: 24, ySpacing: lineSpacing },
        { type: "title"     , text: TXT.credits                                   , size: 48, weight: "bold"  , ySpacing: lineSpacing * 4 },
        { type: "text"      , text: TXT.concept                                   , size: 24, weight: "bold" },
        { type: "text"      , text: 'Sophie Ward & André "AnJoMorto" Fonseca'   , size: 24, italic: true    , ySpacing: lineSpacing },
        { type: "text"      , text: TXT.visuals                                   , size: 24, weight: "bold"  , ySpacing: lineSpacing },
        { type: "text"      , text: 'Sophie Ward & André "AnJoMorto" Fonseca'   , size: 24, italic: true    , ySpacing: lineSpacing * 4 },
        { type: "heading"   , text: TXT.external                                  , size: 28, weight: "bold"  , ySpacing: lineSpacing },
        { type: "text"      , text: TXT.music                                     , size: 24, weight: "bold" },
        { type: "link"      , text: "Abstraction"                               , size: 20, url:    "https://tallbeard.itch.io/music-loop-bundle"                      , ySpacing: smallLineSpacing },
        { type: "text"      , text: TXT.sounds                                    , size: 24, weight: "bold"                      , ySpacing: lineSpacing },
        { type: "link"      , text: "Brackeys, Asbjørn Thirslund"               , size: 20, url:    "https://brackeysgames.itch.io/brackeys-platformer-bundle"         , ySpacing: smallLineSpacing },
        { type: "link"      , text: "DASK"                                      , size: 20, url:    "https://dagurasusk.itch.io/retrosounds"                           , ySpacing: smallLineSpacing },
        { type: "link"      , text: "Diablo Luna"                               , size: 20, url:    "https://pudretediablo.itch.io/butterfly"                          , ySpacing: smallLineSpacing },
        { type: "link"      , text: "FilmCow"                                   , size: 20, url:    "https://filmcow.itch.io/filmcow-sfx"                              , ySpacing: smallLineSpacing },
        { type: "link"      , text: "Leohpaz"                                   , size: 20, url:    "https://leohpaz.itch.io/minifantasy-forgotten-plains-sfx-pack"    , ySpacing: smallLineSpacing },
        { type: "link"      , text: "Nathan Gibson"                             , size: 20, url:    "https://nathangibson.myportfolio.com"                             , ySpacing: smallLineSpacing },
        { type: "link"      , text: "Nox_Sound_Design"                          , size: 20, url:    "https://nox-sound-design.itch.io/essentials-series-sfx-nox-sound" , ySpacing: smallLineSpacing },
        { type: "text"      , text: "Snippets de code : "                       , size: 24, weight: "bold"                      , ySpacing: lineSpacing },
        { type: "link"      , text: "MarredCheese"                              , size: 20, url:    "https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900/63066148", ySpacing: smallLineSpacing },
        { type: "link"      , text: "Vishal"                                    , size: 20, url:    "https://stackoverflow.com/a/11486026"                             , ySpacing: smallLineSpacing },
        { type: "text"      , text: TXT.ai                                        , size: 24, weight: "bold"                      , ySpacing: lineSpacing },
        { type: "link"      , text: "OpenAI, ChatGPT"                           , size: 20, url:    "https://chat.openai.com"   , ySpacing: lineSpacing * 2 },
        { type: "text"      , text: ' ', size: 24, ySpacing: lineSpacing },
        { type: "text"      , text: ' ', size: 24, ySpacing: lineSpacing },
        { type: "text"      , text: ' ', size: 24, ySpacing: lineSpacing },
    ];

    function drawCredits() {
        destroyAll("creditsItem");
        let posY = 100 - scrollOffset;

        credits.forEach(item => {
            let textObj;
            switch (item.type) {
                case "title":
                    textObj = add([
                        text(item.text, { size: item.size, font: "d", weight: item.weight }),
                        pos(centerX, posY - lineSpacing * 1.5),
                        anchor("center"),
                        color(WHITE),
                        "creditsItem",
                    ]);
                    break;
                case "heading":
                    textObj = add([
                        text(item.text, { size: item.size, font: "d", weight: item.weight }),
                        pos(20, posY - lineSpacing * 1.25),
                        anchor("left"),
                        color(WHITE),
                        "creditsItem",
                    ]);
                    break;
                case "text":
                    if (item.text.length > 50) {
                        const lines = wrapText(item.text, 50);
                        lines.forEach((line, index) => {
                            textObj = add([
                                text(line, { size: item.size, font: "d", weight: item.weight, italic: item.italic }),
                                pos(20, posY + index * lineSpacing),
                                anchor("left"),
                                color(WHITE),
                                area(),
                                "creditsItem",
                                item.tag,
                            ]);
                        });
                        posY += lines.length * lineSpacing;
                    } else {
                        textObj = add([
                            text(item.text, { size: item.size, font: "d", weight: item.weight, italic: item.italic }),
                            pos(20, posY),
                            anchor("left"),
                            color(WHITE),
                            "creditsItem",
                        ]);
                        posY += item.ySpacing || lineSpacing;
                    }
                    break;
                case "link":
                    textObj = add([
                        text(item.text, { size: item.size, font: "d" }),
                        pos(20, posY),
                        anchor("left"),
                        color(BLUE),
                        area(),
                        "creditsItem",
                        item.url
                    ]);
                    posY += item.ySpacing || lineSpacing;
                    break;
            }
        });

        // Add menu button
        const menuButton = add([
            rect(150, 50, { radius: 15 }),
            anchor("center"),
            pos(width() / 2, height() - 50),
            outline(4),
            area(),
            "creditsItem",
            "menuButton",
        ]);
        const menuButtonText = menuButton.add([
            text(TXT.menu, { font: "d", size: 18 }),
            pos(0, 0),
            anchor("center"),
            color(rgb(0, 0, 0)),
        ]);
        onClick("menuButton", () => {
            go("startMenu");
            play('button_click');
        });

        // Click events for links --> currently this isn't working. It seems like Kaboom.js overides the vanilla javascript "window.open" and has no native replacement.
        onClick("https://mayragandra.itch.io/freeambientmusic"                      , () => window.open("https://mayragandra.itch.io/freeambientmusic"                      , '_blank'));
        onClick("https://brackeysgames.itch.io/brackeys-platformer-bundle"          , () => window.open("https://brackeysgames.itch.io/brackeys-platformer-bundle"          , '_blank'));
        onClick("https://pudretediablo.itch.io/butterfly"                           , () => window.open("https://pudretediablo.itch.io/butterfly"                           , '_blank'));
        onClick("https://filmcow.itch.io/filmcow-sfx"                               , () => window.open("https://filmcow.itch.io/filmcow-sfx"                               , '_blank'));
        onClick("https://leohpaz.itch.io/minifantasy-forgotten-plains-sfx-pack"     , () => window.open("https://leohpaz.itch.io/minifantasy-forgotten-plains-sfx-pack"     , '_blank'));
        onClick("https://nathangibson.myportfolio.com"                              , () => window.open("https://nathangibson.myportfolio.com"                              , '_blank'));
        onClick("https://nox-sound-design.itch.io/essentials-series-sfx-nox-sound"  , () => window.open("https://nox-sound-design.itch.io/essentials-series-sfx-nox-sound"  , '_blank'));
        onClick("https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900/63066148"  , () => window.open("https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900/63066148"  , '_blank'));
        onClick("https://stackoverflow.com/a/11486026"                              , () => window.open("https://stackoverflow.com/a/11486026"                              , '_blank'));
        onClick("https://chat.openai.com"                                           , () => window.open("https://chat.openai.com"                                           , '_blank'));
        onClick("supacat", () => go("supacat"));
    }

    // Function to move the page up and down with arrows
    function updateCredits() {
        destroyAll("creditsItem");
        drawCredits();
    }

    drawCredits();

    onKeyPress("up", () => {
        if (scrollOffset > 0) {
            scrollOffset -= lineSpacing;
            updateCredits();
        }
    });
    onKeyPress("down", () => {
        if (scrollOffset < credits.length * lineSpacing - containerHeight) {
            scrollOffset += lineSpacing;
            updateCredits();
        }
    });

    onScroll((dir) => {
        if (dir === "up" && scrollOffset > 0) {
            scrollOffset -= lineSpacing;
        } else if (dir === "down" && scrollOffset < credits.length * lineSpacing - containerHeight) {
            scrollOffset += lineSpacing;
        }
        updateCredits();
    });

    function wrapText(text, maxLength) {
        const words = text.split(" ");
        const lines = [];
        let currentLine = "";

        words.forEach(word => {
            if ((currentLine + word).length > maxLength) {
                lines.push(currentLine);
                currentLine = word + " ";
            } else {
                currentLine += word + " ";
            }
        });

        lines.push(currentLine.trim());
        return lines;
    }
});

scene("supacat", () => {
    const LANGUAGE = localStorage.getItem("language") || "FR"; // Language choice on localStorage or French by default
    const TXT = langData[LANGUAGE];
    // ;)
    // charger les assets
    loadSprite("chat","ref/cat.png");
    loadSound("miaou","ref/miau.wav");

    // ajouter à l'écran
    const chat = add([
        sprite("chat"),
        pos(20,20),
        scale(0.2),
        area(),
        "chat"
    ])

    // ajouter des interactions
    onKeyPress("space",()=>{
        play("miaou",{
            volume: 2,            
        });
    })

    onKeyDown("left",()=>{
        chat.move(-120,0);
    })

    onKeyDown("right",()=>{
        chat.move(120,0);
        chat.flipX = true;
    })

    onKeyDown("up",()=>{
        chat.move(0,-120);
    })

    onKeyDown("down",()=>{
        chat.move(0,120);
    })

    // un autre objet
    const texte = add([
        text("MIAOU",{
            size : 48
        }),
        pos(200,20),
        area(),
        "texte"
    ])

    // ajouter un collider
    onCollide("chat","texte", () =>{
        destroy(chat);
        play("miaou",{
            volume: 4,
            speed : 0.2,
            detune : randi(0,12) * 100          
        });
    })

    // Add menu button to return to the start menu
    const menuButton = add([
        rect(150, 50, { radius: 15 }),
        anchor("center"),
        pos(width() / 2, height() - 50),
        outline(4),
        area(),
        "creditsItem",
        "menuButton",
    ]);
    const menuButtonText = menuButton.add([
        text(TXT.menu, { font: "d", size: 18 }),
        pos(0, 0),
        anchor("center"),
        color(rgb(0, 0, 0)),
    ]);
    onClick("menuButton", () => {
        go("startMenu");
    });
    add([ //Credits
        text(TXT.supacat, {font:"d", size: 16 }),
        pos(W - 100, H - 100),
        anchor("botright"),
        color(rgb(0, 0, 0)),
    ]);    
})

scene("game", () => {
    inGame = true;
    const LANGUAGE = localStorage.getItem("language") || "FR"; // Language choice on localStorage or French by default
    const TXT = langData[LANGUAGE];

    //Achievements set to true by default, they get set to false when the player fails to do them
    achieved_lone_wolf      = true;
    achieved_bee_whisperer  = true;
    achieved_tree_guardian  = true;
    let economist_timer     = 0;
    let info_button_counter = [false, false, false, false, false, false];

    // DECLARING CONSTANTS
     // Areas
         const CASHBOX  = add([anchor("center"), pos(W/2 ,30)   , z(Z_UI_BOTTOM), "ui"]);
         const SCOREBOX = add([anchor("left")  , pos(15  ,H-60) , z(Z_UI_BOTTOM), "ui"]);
         const TOPLBOX  = add([anchor("left")  , pos(15  ,30)   , z(Z_UI_BOTTOM), "ui"]);
         const NEWBOX   = add([anchor("right") , pos(W-15,15)   , z(Z_UI_BOTTOM), "ui"]);
         const BEARBOX  = add([anchor("bot")   , pos(W/2 ,H)    , z(Z_UI_BOTTOM), "ui"]);
     // UI
        const ICON_DIST     = 40;
        const NEW_BT_DIST   = 5;

    // DECLARING VARIABLES
    honey = 0; //set the score to 0 at every start
     let cash            = 0;
     let score           = 0;
     let cash_per_sec    = 0;
     let cps_penalty     = 1;
     let cps_final       = cash_per_sec / cps_penalty;
     // Prices
        let scaling         = 1.6;
        let pr_new_tree     = 20;
        let pr_new_bird     = 200;
        let pr_new_bee      = 75;
        let pr_new_beehive  = 30;
     // Number of elements -> these are later updated on the general onUpdate
        let nb_trees    = get('tree').length;
        let nb_handmade = get('handmade').length;
        let nb_bees     = get('bee').length;
        let nb_birds    = get('bird').length;
        let nb_trash    = get('trash').length;
        let nb_bulldozer= get('bulldozer').length;
        let nb_flowered = get('flowered').length;
        let nb_beehives = get('beehives').length;
     // Cash/second
        let cps_t_base  = 0.5
        let cps_tree    = cps_t_base * (nb_bees * nb_flowered + 1);
     // Events
        const MAX_EVENT_STAT    = 100;
        let pollu_stat          = 0;
        let pollu_over          = 0;
        let pollu_boost         = 2;
        let pollu_color         = rgb(31, 60, 33); //if change this needs to be changed lower - these values can't seem to be stored
        let defo_stat           = 0;
        let defo_over           = 0;
        let defo_boost          = 1.5;
        let defo_color          = rgb(89, 66, 53); //if change this needs to be changed lower - these values can't seem to be stored
     // Others
        let diaL                = get("dialog").length; //to check if the dialogue is existant (mostly to pause other functions)
        let flowered_clicks     = 40;
        let nb_bees_p_flowered  = 3;
        let nb_bees_p_behive    = 5;
     //Tutorial like
        let hasBTrees   = false;
        let hasBBirds   = false;
        let hasBBees    = false;
        let hasBHives   = false;
        let hasFlowers  = false;

        
    let music_pollution = play('pollution_music', {
        loop: true,
        volume: 0,
        paused: false,
    });
    let music_bulldozer = play('bulldozer_music', {
        loop: true,
        volume: 0,
        paused: false,
    })
    let sound_birds     = play('birds_bg', {
        loop: true,
        volume: 0,
        paused: false,
    });

    /**
     * DIALOGS
     * Faces:
     * bear_happy
     * bear_wink for fun facts
     * bear_sad
     * bear_talking for general dialog
     * bear_scared when bulldozer appears
     * 
     * Sounds:
     * bear_angry for sad or scared
     * bear_curious for fun facts
     * bear_friend for all rest
    */  
        const dia_intro = [
            ["bear_happy"   , "bear_friend" , TXT.dia_intro_1],
            ["bear_sad"     , "bear_angry"  , TXT.dia_intro_2],
            ["bear_talking" , "bear_friend" , TXT.dia_intro_3],
            ["bear_info"    , "bear_curious", TXT.dia_intro_4],
            ["bear_talking" , "bear_friend" , TXT.dia_intro_5],
        ];
        const dia_pollution = [
            ["bear_wink"    , "bear_curious", TXT.dia_pollution_1],
            ["bear_scared"  , "bear_angry"  , TXT.dia_pollution_2],
            ["bear_sad"     , "bear_angry"  , TXT.dia_pollution_3],
            ["bear_happy"   , "bear_friend" , TXT.dia_pollution_4],
        ];
        const dia_deforestation = [
            ["bear_wink"    , "bear_curious", TXT.dia_deforestation_1],
            ["bear_scared"  , "bear_angry"  , TXT.dia_deforestation_2],
            ["bear_sad"     , "bear_angry"  , TXT.dia_deforestation_3],
            ["bear_happy"   , "bear_friend" , TXT.dia_deforestation_4],
        ];
        const dia_funfact = [
            ["bear_wink"    , "bear_curious", TXT.dia_funfact_1],
            ["bear_wink"    , "bear_curious", TXT.dia_funfact_2],
            ["bear_wink"    , "bear_curious", TXT.dia_funfact_3],
            ["bear_wink"    , "bear_curious", TXT.dia_funfact_4],
            ["bear_wink"    , "bear_curious", TXT.dia_funfact_5],
            ["bear_wink"    , "bear_curious", TXT.dia_funfact_6],
            ["bear_happy"   , "bear_curious", TXT.dia_funfact_7],
        ];
        const dia_info = [
            ["bear_wink"    , "bear_curious", TXT.dia_info_tree],
            ["bear_wink"    , "bear_curious", TXT.dia_info_bird],
            ["bear_flower"  , "bear_curious", TXT.dia_info_bee],
            ["bear_wink"    , "bear_curious", TXT.dia_info_beehive],
            ["bear_wink"    , "bear_curious", TXT.dia_info_pollution],
            ["bear_wink"    , "bear_curious", TXT.dia_info_deforestation],
            ["bear_flower"  , "bear_curious", TXT.dia_info_fleurs],
        ];
        const dia_first_time_info = [
            ["bear_wink"    , "bear_curious", TXT.dia_first_tree],
            ["bear_wink"    , "bear_curious", TXT.dia_first_bird],
            ["bear_flower"  , "bear_curious", TXT.dia_first_bee],
            ["bear_wink"    , "bear_curious", TXT.dia_first_beehive],
            ["bear_flower"  , "bear_curious", TXT.dia_first_fleurs],
        ];
        const dia_others = [
            ["bear_talking" , "bear_friend" , TXT.dia_pause],
            ["bear_scared"  , "bear_angry"  , TXT.dia_not_enough_leaves],
        ];

    // ADDING ELEMENTS
    // UI
    // Cash
     const text_cash = CASHBOX.add([
        text(formatNumber(cash, {useOrderSuffix: true, decimals: 1}),{
            width   : W,
            size    : 26,
            font    : "d",
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
            size    : 16,
            font    : "d",
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
    // Score
     const icon_honey = add([
        sprite('honey'),
        anchor("left"),
        pos(SCOREBOX.pos), //Had to remove SCOREBOX.add to be able to make the bottle pulse
        z(Z_UI),
        scale(SPRITE_ICON_SCALE * 2),
        area(),
        "ui",
        "honey_icon",
     ]);
     const text_honey = SCOREBOX.add([
        text(`${Math.floor(honey)}`,{
           width    : W,
           size     : 40,
           font     : "d",
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
    // Timer
     const text_time = TOPLBOX.add([
        text(TXT.timer_txt + fancyTimeFormat(timer),{
            width   : W,
            size    : 22,
            font    : "d",
        }),
        anchor("left"),
        pos(0,0),
        z(Z_UI),
        {
            update(){
                if (timer >= 0) {
                    this.text = TXT.timer_txt + fancyTimeFormat(timer);
                } else {
                    this.text= ""; //hides this text in infinite mode
                }
            }
        },
        "ui",
    ]);

    // EVENTS UI
    const EVENTS = add([anchor("left"), pos(10,text_time.pos.y + 65), z(Z_UI_BOTTOM), "ui"]);
    function emptyBar(){
        drawRect({
            pos     : vec2(30, 0),
            width   : MAX_EVENT_STAT + 2,
            height  : 13,
            anchor  : "left",
            fill    : false,
            outline : {color: BLACK, width: 2 },
        });
    };

     // Pollution
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
                pos     : vec2(30, 0),
                width   : pollu_stat,
                height  : 13,
                anchor  : "left",
                color   : pollu_color,
            })
            emptyBar();
        })
    // Deforestation
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
                pos     : vec2(30, 0),
                width   : defo_stat,
                height  : 13,
                anchor  : "left",
                color   : defo_color,
            })
            emptyBar();
        })

    // Overlay for Pollution
    const pollutionOverlay = add([
        rect(W, H),
        pos(0, 0),
        color(50, 90, 50),
        opacity(0),  
        z(Z_UI_BOTTOM - 10),
        "pollution_overlay"
    ]);
    // Overlay for Deforestation
    const deforestationOverlay = add([
        rect(W, H),
        pos(0, 0),
        color(100, 100, 100),
        opacity(0),
        z(Z_UI_BOTTOM - 10),
        "deforestation_overlay"
    ]);

    // DIALOG UI
     // Bear
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
    
    // BUTTONS TO ADD NEW ELEMENTS
     // Adding a new tree button
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
     ]);
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
        ]);
        const text_nb_trees = new_tree.add([
            text(formatNumber(nb_trees, {useOrderSuffix: true}),{
                size : BUTTON_SIZE * BUTTON_NB_TXT_SCALE,
                font : "d",
            }),
            {
                update(){
                    this.text = formatNumber(nb_trees, {useOrderSuffix: true});
                }
            },
            anchor("right"),
            pos(-BUTTON_SIZE * 6,BUTTON_SIZE * 3.6),
            z(Z_UI_TOP),
        ]);
        // Adding a new bird button
        const new_bird = NEWBOX.add([
            sprite('new_bird'), 
            pos(new_tree.pos.x, new_tree.pos.y + BUTTON_SIZE + NEW_BT_DIST),
            scale(SPRITE_BUTTON_SCALE),
            anchor("topright"),
            area(),
            z(Z_UI),
            opacity(0),
            "ui",
            "button",
            "new_button",
            "new_bird",
         ]);
            const text_new_bird_price = new_bird.add([
                text(formatNumber(pr_new_bird, {useOrderSuffix: true, decimals: 1}),{
                    size : BUTTON_SIZE * BUTTON_PRICE_TXT_SCALE,
                    font : "d",
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
                opacity(0),
            ]);
            const text_nb_birds = new_bird.add([
                text(formatNumber(nb_birds, {useOrderSuffix: true}),{
                    size : BUTTON_SIZE * BUTTON_NB_TXT_SCALE,
                    font : "d",
                }),
                {
                    update(){
                        this.text = formatNumber(nb_birds, {useOrderSuffix: true});
                    }
                },
                anchor("right"),
                pos(-BUTTON_SIZE * 6,BUTTON_SIZE * 3.6),
                z(Z_UI_TOP),
                opacity(0),
            ]);
            const new_empty = NEWBOX.add([ //The empty button that appears in the place of the birds one
                sprite('new_empty'),
                opacity(1),
                {
                    update(){
                    if (this.opacity == 1) {
                        this.use(shader("grayscale"));
                    } else {
                        this.use(shader(""));
                    }
                }},
                pos(new_bird.pos),
                scale(SPRITE_BUTTON_SCALE),
                anchor("topright"),
                area(),
                z(Z_UI_TOP),
                "ui",
                "button",
                "new_button",
             ]);
    // Adding a new bee button
     const new_bee = NEWBOX.add([
        sprite('new_bee'),
        {
            update(){
                if (nb_flowered > 0) {
                    if(nb_bees >= nb_flowered * nb_bees_p_flowered){
                        this.use(shader("grayscale"));
                        this.use("not_available");
                    } else if(nb_bulldozer != 0){
                        this.use(shader("grayscale"));
                        this.use("not_available");
                    } else {
                        this.use(shader(""));
                        this.unuse("not_available");
                    }
                }
            }
        },
        pos(new_bird.pos.x, new_bird.pos.y + BUTTON_SIZE + NEW_BT_DIST),
        scale(SPRITE_BUTTON_SCALE),
        anchor("topright"),
        area(),
        z(Z_UI),
        opacity(0),
        "ui",
        "button",
        "new_button",
        "new_bee",
     ]);
        const text_new_bee_price = new_bee.add([
            text(formatNumber(pr_new_bee, {useOrderSuffix: true, decimals: 1}),{
                size : BUTTON_SIZE * BUTTON_PRICE_TXT_SCALE,
                font : "d",
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
            opacity(0),
        ]);
        const text_nb_bees = new_bee.add([
            text(formatNumber(nb_bees, {useOrderSuffix: true}),{
                size : BUTTON_SIZE * BUTTON_NB_TXT_SCALE,
                font : "d",
            }),
            {
                update(){
                    this.text = formatNumber(nb_bees, {useOrderSuffix: true});
                }
            },
            anchor("right"),
            pos(-BUTTON_SIZE * 6, BUTTON_SIZE * 3.6),
            z(Z_UI_TOP),
            opacity(0),
        ]);
    // Adding a new bee button
    const new_beehive = NEWBOX.add([
        sprite('new_beehive'),
        {
            update(){
                if (nb_bees > 0) {
                    if(nb_bees <= nb_beehives * nb_bees_p_behive || get("hiveable").length == 0 ){
                        this.use(shader("grayscale"));
                        this.use("not_available");
                    } else if (nb_bulldozer != 0) {
                        this.use(shader("grayscale"));
                        this.use("not_available");
                    } else {
                        this.use(shader(""));
                        this.unuse("not_available");
                    }
                }
            }
        },
        pos(new_bee.pos.x, new_bee.pos.y + BUTTON_SIZE + NEW_BT_DIST),
        scale(SPRITE_BUTTON_SCALE),
        anchor("topright"),
        area(),
        z(Z_UI),
        opacity(0),
        "ui",
        "button",
        "new_button",
        "new_beehive",
     ])
        const text_new_beehive_price = new_beehive.add([
            text(formatNumber(pr_new_beehive, {useOrderSuffix: true, decimals: 1}),{
                size : BUTTON_SIZE * BUTTON_PRICE_TXT_SCALE,
                font : "d",
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
            pos(-BUTTON_SIZE * 4, BUTTON_SIZE * 1.7),
            z(Z_UI_TOP),
            opacity(0),
        ])
        const text_nb_beehives = new_beehive.add([
            text(formatNumber(nb_beehives, {useOrderSuffix: true}),{
                size : BUTTON_SIZE * BUTTON_NB_TXT_SCALE,
                font : "d",
            }),
            {
                update(){
                    this.text = formatNumber(nb_beehives, {useOrderSuffix: true});
                }
            },
            anchor("right"),
            pos(-BUTTON_SIZE * 6, BUTTON_SIZE * 3.6),
            z(Z_UI_TOP),
            opacity(0),
        ])

     //Info bubbles
        // Info button for the tree
        const information_0 = NEWBOX.add([
            sprite('info'), 
            anchor("topright"),
            pos(new_tree.pos.x - 165, new_tree.pos.y),
            scale(1),
            area({ scale: 1.5 }),
            z(Z_UI),
            {dia : 0},
            opacity(0),
            "ui",
            "button",
            "new_button",
            "info",
         ])
        // Info button for the bird
         const information_1 = NEWBOX.add([
            sprite('info'), 
            anchor("topright"),
            pos(new_bird.pos.x - 165, new_bird.pos.y),
            scale(1),
            area({ scale: 1.5 }),
            z(Z_UI),
            {dia: 1},
            opacity(0),
            "ui",
            "button",
            "new_button",
            "info",
         ])
        // Info button for the bee
         const information_2 = NEWBOX.add([
            sprite('info'), 
            anchor("topright"),
            pos(new_bee.pos.x - 165, new_bee.pos.y),
            scale(1),
            area({ scale: 1.5 }),
            z(Z_UI),
            {dia : 2},
            opacity(0),
            "ui",
            "button",
            "new_button",
            "info",
            "info_bee",
         ])
        // Info button for the beehive
         const information_3 = NEWBOX.add([
            sprite('info'), 
            anchor("topright"),
            pos(new_beehive.pos.x - 165, new_beehive.pos.y),
            scale(1),
            area({ scale: 1.5 }),
            z(Z_UI),
            {dia : 3},
            opacity(0),
            "ui",
            "button",
            "new_button",
            "info",
            "info_beehive",
         ])
        // Info button for the pollution
         const information_4 = EVENTS.add([
            sprite('info'), 
            anchor("topleft"),
            pos(icon_pollution.pos.x + 200, icon_pollution.pos.y - 12),
            scale(1),
            area(),
            z(Z_UI),
            {dia : 4},
            opacity(0),
            "ui",
            "button",
            "new_button",
            "info",
         ])
        // Info button for the deforestation
         const information_5 = EVENTS.add([
            sprite('info'), 
            anchor("topleft"),
            pos(icon_defo.pos.x + 200, icon_defo.pos.y - 12),
            scale(1),
            area(),
            z(Z_UI),
            {dia : 5},
            opacity(0),
            "ui",
            "button",
            "new_button",
            "info",
         ])
        

    //BACKGROUND
     // Adding the background dynamically to the screen size -> this becomes redundant from v. beta.1.2.0, but keep it in case of a change to dynamic scaling again.
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
                    pos((BG_TILE_SIZE) * i, BG_Y - ((BG_TILE_SIZE) * j)),
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
                    pos((BG_TILE_SIZE) * i, BG_Y + ((BG_TILE_SIZE) * j)),
                    scale(SPRITE_BG_SCALE),
                    z(0),
                    "bg",
                 ]);
                 bg.play("n");
             }
        }
     }

    // ADDING OBJECTS
        // Adding starting tree
        let y_st = H/2 + 50; vec2(W/2,y_st)
        const start_tree = add([
            sprite(`tree0`),
            pos(vec2(W/2,y_st)),
            scale(y_st * TREE_SCALE),
            anchor("bot"),
            area(),
            z(y_st),
            //health(health_tree), --> this was not working for some reason, I'll still keep the code in case a fix comes to be
            "tree",
            "hiveable",
            "clickable",
            "start_tree",
            "grown",
        ]);

    // ADDING EVENT LISTENERS
    // Game elements (inside an if(diaL == 0) to make sure it is impossible to click things if dialogues are on)
        // Click any tree
        let nb_clicks = 0; // --> this is what replaced the health code
        onClick("tree", (t) => { 
            if (diaL == 0) {
                play('button_click')
                plus(1);
                nb_clicks++;
                if(nb_clicks == flowered_clicks && t.is("flowered") != true && t.is("grown")){ //Checks if the tree is not flowered, is grown and if the number the clicks is enough to make the tree flowered
                    if(hasFlowers == false){
                        diaBubble(dia_first_time_info[4]);
                        hasFlowers = true;
                    }
                    const flowers = add([
                        sprite("flowers0"),
                        anchor("bot"),
                        pos(t.pos),
                        z(t.z + 1),
                        scale(t.scale),
                        area(),
                        "flowers",
                    ]);
                    t.use("flowered");
                }
                if(nb_clicks > flowered_clicks){
                    nb_clicks = 0;
                }
                // Particles when clicked
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
        });
        onClick("flowers", (t) => { //Also makes the floweres zoomOut when clicking on a tree
            if (diaL == 0) {
                zoomOut(t);
            }
        });
        // Click the trashcans
        onClick("trash", (t) => { 
            if (diaL == 0) {
                play('trash_click');
                // Particles when clicked
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
                    trash_particle.jump(rand(100, 350));
                }
                zoomOut(t);
                minusPollu();
                if(pollu_over <= 0){ //has a random change of getting destroyed when clicked on
                    let ran = randi(7);
                    if (ran == 2) {
                        destroy(t);                
                    }
                }
                if(pollu_stat < 5){
                    destroyAll("trash");
                }
            }
        });
        // Click the bulldozer
        onClick("bulldozer", (t) => { 
            if (diaL == 0) {
                play('bulldozer_click', {volume: 0.6});
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
                    ]);
                    smoke_particle.jump(rand(400, 500));
                }
                zoomOut(t);
                minusDefo();
                if(defo_stat < 5){ //gets destroyed on the deforestation bar reaches 5 or less
                    destroy(t);
                }
            }
        });
        //Click the info bubbles
        onClick("info", (t) => {
            if (t.opacity != 0) {
                diaBubble(dia_info[t.dia]);
                play('button_click');
            }
            info_button_counter[t.dia] = true;
            if (ac == 0 && info_button_counter.every(pressed => pressed === true)) {
                ac++;
                localStorage.setItem('achieved_curious', 'true');
                showAchievementPopUp("Curieux");
            }
        });

        //Explode particles destruction of the different things
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
                trash_particle.jump(rand(100, 350));
            }
        });
        onDestroy("tree", (t) => {
            play('tree_fall', {volume: 1});
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
                ]);
                leaf_particle.jump(rand(100, 350));
            }
        });
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
                ]);
                leaf_particle.jump(rand(100, 350));
            }
        });
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
                ]);
                leaf_particle.jump(rand(100, 350));
            }
        });
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
                hasBulldozerSound = false;
                sound_bulldozer.stop();
            }
        });

        // Skip dialogs
        let q = 0; //this value is here for the introductory dialogue
        diaBubble(dia_intro[q]);
        // Intro dialogue
        onKeyRelease("space", () => {
            destroyAll("dialog");
            icon_bear.use(sprite('bear'));
            icon_bear.use(scale(BEAR_SMALL_SCALE));
            q++;
            if (q < dia_intro.length) {
                diaBubble(dia_intro[q]);
            }
            if(q == 3){
                let o = 0
                //loop(0.5, () => { //I can't make this stop for some reason --> it was suppose to make the bubbles blink for a small while
                    if (o == 0) {
                        information_0.use(opacity(1));
                        information_4.use(opacity(1));
                        information_5.use(opacity(1));
                        o = 1;
                    }/* else {
                        information_0.use(opacity(0));
                        information_4.use(opacity(0));
                        information_5.use(opacity(0));
                        o = 0;
                    }nn
                });*/
            } else if(q > 3){
                information_0.use(opacity(1));
                information_4.use(opacity(1));
                information_5.use(opacity(1));
            }
        });
        onClick("skip", () => { //this is mainly here for the mobile version
            wait(0.1, () => { //finally found out how to fix the button clicking multiple times. A wait() suffises to prevent it --> actually I did not, it still doesn't work in the digital keyboard IDK why it works here tbf.
                destroyAll("dialog");
                icon_bear.use(sprite('bear'));
                icon_bear.use(scale(BEAR_SMALL_SCALE));
                q++;
                if (q < dia_intro.length) {
                    diaBubble(dia_intro[q]);
                }
                if(q == 3){
                    let o = 0
                    //loop(0.5, () => { //I can't make this stop for some reason --> it was suppose to make the bubbles blink for a small while
                        if (o == 0) {
                            information_0.use(opacity(1));
                            information_4.use(opacity(1));
                            information_5.use(opacity(1));
                            o = 1;
                        }/* else {
                            information_0.use(opacity(0));
                            information_4.use(opacity(0));
                            information_5.use(opacity(0));
                            o = 0;
                        }nn
                    });*/
                } else if(q > 3){
                    information_0.use(opacity(1));
                    information_4.use(opacity(1));
                    information_5.use(opacity(1));
                }
            })
        });
        // Get a fun fact
        onClick("bear", (t) => {
            diaBubble(choose(dia_funfact));
        })
        //Pause menu --> for some reason, this is locking other functionalities
        //onKeyRelease("p", () => {
        //    diaBubble(dia_others[0]);
        //})
        //onKeyRelease("escape", () => {
        //    diaBubble(dia_others[0]);
        //})
        
    // UI elements
        // Click any button
        onClick("button", (b) => {
            if (diaL == 0 && b.is("not_available") == false) {
                zoomIn(b);
            }
        })

        // New itens buttons
            // New tree
            onClick("new_tree", (t) =>{
                if (diaL == 0) {
                    if(cash < pr_new_tree){
                        warning(text_cash);
                        warning(text_new_tree_price);
                        CASHBOX.add([
                            text(TXT.no_leaves, { 
                                size : 20,
                                font : "d",
                            }),
                            pos(text_cash.pos.x - 155, 90), 
                            color(RED), 
                            lifespan(2), 
                        ]);
                    } else {
                        if(hasBTrees == false){
                            diaBubble(dia_first_time_info[0]);
                            hasBTrees = true;
                        }
                        addTree();
                    }
                }
            })
            // New bird
            onClick("new_bird", (t) =>{
                if (diaL == 0) {
                    if(t.opacity == 0){
                        diaBubble(dia_others[1]);
                    } else if(cash < pr_new_bird){
                        warning(text_cash);
                        warning(text_new_bird_price);
                        CASHBOX.add([
                            text(TXT.no_leaves, { 
                                size : 20,
                                font : "d",
                            }),
                            pos(text_cash.pos.x - 155, 120), 
                            color(RED), 
                            lifespan(2), 
                        ]);
                    } else {
                        if(hasBBirds == false){
                            diaBubble(dia_first_time_info[1]);
                            hasBBirds = true;
                        }
                        addBird();
                        boughtBird = true;
                        sound_birds.volume = 1.2;
                    }
                }
            })
            // New bee
            onClick("new_bee", (b) =>{
                if (diaL == 0 && b.is("not_available") == false && new_bee.opacity != 0){
                    if(cash < pr_new_bee){
                        warning(text_cash);
                        warning(text_new_bee_price);
                        CASHBOX.add([
                            text(TXT.no_leaves, { 
                                size : 20,
                                font : "d",
                            }),
                            pos(text_cash.pos.x - 155, 150),
                            color(RED),
                            lifespan(2),
                        ]);
                    } else {
                        if(hasBBees == false){
                            diaBubble(dia_first_time_info[2]);
                            hasBBees = true;
                        }
                        addBee();
                    }
                } else if(diaL == 0 && b.is("not_available")){ // When the button is not available
                    let txt = "";
                    if (nb_bulldozer != 0) {
                        txt = TXT.bulldozer_first
                    } else {
                        txt = TXT.no_flowers
                    }
                    warning(b);
                    CASHBOX.add([
                        text(txt, { 
                            size: 20,
                            font: "d",
                        }),
                        pos(text_cash.pos.x - 300, 150), 
                        color(RED), 
                        lifespan(2), 
                    ]);
                };
            })
            // New beehive
            onClick("new_beehive", (b) =>{
                if (diaL == 0 && b.is("not_available") == false && new_beehive.opacity != 0){
                    if(cash < pr_new_beehive){
                        warning(text_cash);
                        warning(text_new_beehive_price);
                        CASHBOX.add([
                            text(TXT.no_leaves, { 
                                size : 20,
                                font : "d",
                            }),
                            pos(text_cash.pos.x - 155, 150), 
                            color(RED), 
                            lifespan(2), 
                        ]);
                    } else {
                        if(hasBHives == false){
                            diaBubble(dia_first_time_info[3]);
                            hasBHives = true;
                        }
                        addBeehive();
                    }
                } else if(diaL == 0 && b.is("not_available")){
                    if (nb_bulldozer != 0) {
                        txt = TXT.bulldozer_first;
                    } else {
                        txt = TXT.no_bees;
                    }
                    warning(b);
                    CASHBOX.add([
                        text(txt, { 
                            size : 20,
                            font : "d",
                        }),
                        pos(text_cash.pos.x - 155, 180), 
                        color(RED), 
                        lifespan(2), 
                    ]);
                };
            });

       // AUTOMATIC STUFF
        loop(1, () => {
            if (diaL == 0) { // Pauses the game if dialogue is opened
                // Timer
                if(timer > 0){
                    timer = timer - 1
                    economist_timer = economist_timer + 1;
                };       
                      
                // Each element gives cash overtime
                plus(cps_final);
    
                // Increase the events stats
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
                        hasBulldozerSound = true;
                        sound_bulldozer = play('bulldozer', {
                            loop: true,
                            volume: 0.5,
                        });
                    }
                }

                // Adds trashcans
                if(pollu_over % 5 == 0 && pollu_over != 0) {
                    addTrash();
                }
    
                // Flashes timer at multiple occasions
                if ((timer < 61 && timer >= 60) || (timer < 31 && timer >= 30) || (timer <= 15)) {
                    smallWarning(text_time);
                }
                
                // Flashes the events  bars when full
                if (pollu_stat >= MAX_EVENT_STAT) {
                    pollu_color = rgb(31, 100, 33);
                    wait(0.3, () =>{
                        pollu_color = rgb(31, 60, 33);
                    })
                }
                if (get("bulldozer").length != 0) {
                    defo_color = rgb(140, 80, 80);
                    wait(0.25, () =>{
                        defo_color = rgb(89, 66, 53);;
                    })
                    wait(0.5, () =>{
                        defo_color = rgb(140, 80, 80);
                    })
                    wait(0.75, () => {
                        defo_color = rgb(89, 66, 53);;
                    })
                }

                // Spawn smoke particles on the bulldozer
                if (nb_bulldozer != 0) {
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

            //Adding different musics
            if(nb_bulldozer > 0){
                if (music_main.volume > 0) {
                    music_main.volume = music_main.volume - 0.15;
                };
                if (music_main.volume < 0) {
                    music_main.volume = 0;
                };

                if (music_pollution.volume > 0) {
                    music_pollution.volume = music_pollution.volume - 0.15;
                };
                if (music_pollution.volume < 0) {
                    music_pollution.volume = 0;
                };

                if (music_bulldozer.volume < 0.75) {
                    music_bulldozer.volume = music_bulldozer.volume + 0.15;
                };
                if (music_bulldozer.volume > 0.75) {
                    music_bulldozer.volume = 0.75;
                };
                //console.log("M : " + music_main.volume + " /  B : " + music_bulldozer.volume + " / P : " + music_pollution.volume);
                if (diaL == 0) {
                    icon_bear.use(sprite("bear_scared"));
                }
            } else if (nb_trash > 0) {
                if (music_main.volume > 0) {
                    music_main.volume = music_main.volume - 0.15;
                };
                if (music_main.volume < 0) {
                    music_main.volume = 0;
                };

                if (music_bulldozer.volume > 0) {
                    music_bulldozer.volume = music_bulldozer.volume - 0.15;
                };
                if (music_bulldozer.volume < 0) {
                    music_bulldozer.volume = 0;
                };

                if (music_pollution.volume < 0.75) {
                    music_pollution.volume = music_pollution.volume + 0.15;
                };
                if (music_pollution.volume > 0.75) {
                    music_pollution.volume = 0.75;
                };
                //console.log("M : " + music_main.volume + " /  B : " + music_bulldozer.volume + " / P : " + music_pollution.volume);
                if (diaL = 0) {
                    icon_bear.use(sprite("bear_sad"));
                }
            } else {
                if (music_pollution.volume > 0) {
                    music_pollution.volume = music_pollution.volume - 0.15;
                };
                if (music_pollution.volume < 0) {
                    music_pollution.volume = 0;
                };

                if (music_bulldozer.volume > 0) {
                    music_bulldozer.volume = music_bulldozer.volume - 0.15;
                };
                if (music_bulldozer.volume < 0) {
                    music_bulldozer.volume = 0;
                };

                if (music_main.volume < 0.5) {
                    music_main.volume = music_main.volume + 0.15;
                };
                if (music_main.volume > 0.5) {
                    music_main.volume = 0.5;
                };
                //console.log("M : " + music_main.volume + " /  B : " + music_bulldozer.volume + " / P : " + music_pollution.volume);
                if (diaL == 0) {
                    icon_bear.use(sprite("bear"));
                }
            }

            //Achievements:
            if (nb_trees > 1 && alw == 0) {
                achieved_lone_wolf = false;
            }
            if ((nb_bees > 1 || nb_beehives > 1) && abw == 0) {
                achieved_bee_whisperer = false;
            }
            if (nb_trees >= 125 && afl == 0) {
                localStorage.setItem('achieved_forest_lord', 'true');
                afl++;
                if (afl == 1) {
                    showAchievementPopUp(TXT.afl);
                }
            }
            if (nb_handmade >= 30  && agd == 0) {
                localStorage.setItem('achieved_gardener_dedicated', 'true');
                agd++;
                if (agd == 1) {
                    showAchievementPopUp(TXT.agd);
                }
            }
            if (nb_birds >= 25  && abk == 0) {
                localStorage.setItem('achieved_bird_kingdom', 'true');
                abk++;
                if (abk == 1) {
                    showAchievementPopUp(TXT.abk);
                }
            }
            if (nb_bees >= 25  && abm == 0) {
                localStorage.setItem('achieved_bee_master', 'true');
                abm++;
                if (abm == 1) {
                    showAchievementPopUp(TXT.abm);
                }
            }
            if (nb_flowered >= 50  && apb == 0) {
                localStorage.setItem('achieved_perfect_bloom', 'true');
                apb++;
                if (apb == 1) {
                    showAchievementPopUp(TXT.apb);
                }
            }
            if (cash >= 200000  && alt == 0) {
                localStorage.setItem('achieved_leaf_tycoon', 'true');
                alt++;
                if (alt == 1) {
                    showAchievementPopUp(TXT.alt);
                }
            }
            if (cash_per_sec >= 20000  && afls == 0) {
                localStorage.setItem('achieved_falling_leafs', 'true');
                afls++;
                if (afls == 1) {
                    showAchievementPopUp(TXT.afls);
                }
            }
            if (economist_timer >= 60  && ae == 0) {
                localStorage.setItem('achieved_economist', 'true');
                ae++;
                if (ae == 1) {
                    showAchievementPopUp(TXT.ae);
                }
            }
        });

        let p = 0; let d = 0; let sbb = false; let sbeeb = false; let sbhb = false; // Try to limit things so the update doesn't update everything even when not needed, but rather only tries to do the if
        onUpdate(() => {    
            diaL        = get("dialog").length;
            nb_trees    = get('tree').length;
            nb_handmade = get('handmade').length;
            nb_bees     = get('bee').length;
            nb_birds    = get('bird').length;
            nb_trash    = get('trash').length;
            nb_bulldozer= get('bulldozer').length;
            nb_flowered = get('flowered').length;
            nb_beehives = get('beehive').length;
            
            cps_tree = cps_t_base * (nb_bees * nb_flowered + 1); //Changes the passive revenue of trees

            cash_per_sec    = (nb_trees * cps_tree);        //Changes the general passive revenue
            cps_final       = cash_per_sec / cps_penalty;   //Changes the general passive revenue based on the penalties (for now, only the trashcans do)
            if (nb_trash == 0) {
                cps_penalty = 1;
            } else {
                cps_penalty = nb_trash;
            }

            // Hide objects based on their need
            if(cash >= pr_new_bird && sbb == false){
                sbb = true;
                new_empty.use(opacity(0));
                new_bird.use(opacity(1));
                text_new_bird_price.use(opacity(1));
                text_nb_birds.use(opacity(1));
                information_1.use(opacity(1));
            }
            if(nb_flowered > 0 && sbeeb == false){
                sbeeb = true;
                new_bee.use(opacity(1));
                text_new_bee_price.use(opacity(1));
                text_nb_bees.use(opacity(1));
                information_2.use(opacity(1));
            }
            if(nb_bees > 0 && sbhb == false){
                sbhb = true;
                new_beehive.use(opacity(1));
                text_new_beehive_price.use(opacity(1));
                text_nb_beehives.use(opacity(1));
                information_3.use(opacity(1));
            }

            // Timer relative actions
            switch(timer){
                case 0 :
                    music_main.volume      = 0.5;
                    music_bulldozer.stop();
                    music_pollution.stop();
                    sound_birds.stop();
                    if (hasBulldozerSound == true) {
                        sound_bulldozer.stop();
                    };

                    if (achieved_lone_wolf == true) {
                        localStorage.setItem('achieved_lone_wolf', 'true');
                        alw++;
                    }
                    if (achieved_tree_guardian == true) {
                        localStorage.setItem('achieved_tree_guardian', 'true');
                        atg++;
                    }
                    if (achieved_bee_whisperer == true && nb_bees != 0 && nb_beehives != 0) {
                        localStorage.setItem('achieved_bee_whisperer', 'true');
                        abw++;
                    }

                    go("gameOver");
                    break;
            }

            // Pollution relative actions
            if (pollu_stat > 50 && p == 0) { //all these >50 are now redundant
                p++;
                // diaBubble(dia_pollution[0]);
            }
            if(pollu_over >= 5 && p == 1) {
                p++;
                diaBubble(dia_pollution[1]);
            }
            if(pollu_over >= 30 && p == 2){
                p++;
                diaBubble(dia_pollution[2]);
            }
            if(nb_trash == 0 && p == 3){
                p++;
                diaBubble(dia_pollution[3]);
            }
            // Deforestation relative actions
            if (defo_stat > 50 && d == 0) {
                d++;
                //diaBubble(dia_deforestation[0]);
            }
            if(defo_stat >= MAX_EVENT_STAT && d == 1) {
                d++;
                diaBubble(dia_deforestation[1]);
            }
            if(defo_over >= 30 && d == 2){
                d++;
                //diaBubble(dia_deforestation[2]);
            }
            if(defo_stat < 6 && d == 3){
                d++;
                //diaBubble(dia_deforestation[3]);
            }

            //Adding different overlays
            if(nb_bulldozer > 0){
                if (deforestationOverlay.opacity < 0.17){
                    deforestationOverlay.opacity = deforestationOverlay.opacity + 0.001;
                };
                if (deforestationOverlay.opacity > 0.17){
                    deforestationOverlay.opacity = 0.17;
                };
            } else {
                if (deforestationOverlay.opacity != 0){
                    deforestationOverlay.opacity = deforestationOverlay.opacity - 0.003;
                };
                if (deforestationOverlay.opacity < 0){
                    deforestationOverlay.opacity = 0;
                };
            };
            if(nb_trash > 0){
                if (pollutionOverlay.opacity < 0.01 * nb_trash){
                    pollutionOverlay.opacity = pollutionOverlay.opacity + 0.001;
                };
                if (pollutionOverlay.opacity > 0.25){
                    pollutionOverlay.opacity = 0.25;
                };
            } else {
                if (pollutionOverlay.opacity != 0){
                    pollutionOverlay.opacity = pollutionOverlay.opacity - 0.003;
                };
                if (pollutionOverlay.opacity < 0){
                    pollutionOverlay.opacity = 0;
                };
            };
        })

    // FUNCTIONS
        // Add a new tree
        function addTree() {
            play('tree_leaf', {volume: 5,});
            let ranYA = H / 2;
            let ranYB = H / 2 + (BG_TILE_SIZE / 2 - 40 * SPRITE_BG_SCALE);
            const randX = rand(0, W);
            const randY = rand(ranYA, ranYB);
            const saturation = calculateSaturation(randY, ranYA, ranYB);
            const color = calculateColor(saturation);
        
            const tree = add([
                sprite(choose(trees)),
                pos(randX, randY),
                scale(0),
                anchor("bot"),
                area(),
                z(randY),
                "tree",
                "hiveable",
                "handmade",
                {
                    update() {
                        // Grow the tree over time
                        if (this.scale.x < randY * TREE_SCALE) {
                            this.scale.x += 0.02; // Control growth speed
                            this.scale.y += 0.02;
                        } else {
                            this.use("grown");
                        }
                    },
                },
            ]);
            
            tree.color = rgb(color.red, color.green, color.blue);
            pay(pr_new_tree);
            pr_new_tree = pr_new_tree * scaling;
        }
        // Add custom new tree for the birds
        function addCustTree(x, y) {
            const tree = add([
                sprite(choose(trees)),
                pos(x, y),
                scale(0),
                anchor("bot"),
                area(),
                z(y),
                "tree",
                "hiveable",
                {
                    update() {
                        // Grow the tree over time
                        if (this.scale.x < y * TREE_SCALE) {
                            this.scale.x += 0.02; // Control growth speed
                            this.scale.y += 0.02;
                        } else {
                            this.use("grown");
                        }
                    },
                },
            ]);
        }
       // Add a new bee
       function addBee(){
        let rF = choose(get('flowered')); // Random flowered objects
        let rB = choose(get('beehive'));  // Random beehive
        let b = 0; // Tracking bee's state
        let bh = 0; // Tracking beehive's state
        let bh2 = 0; // Tracking beehive's state
        const bee = add([
            sprite('bee', {
                anim: "main",
            }),
            pos(choose(-10, W + 10), H/2),
            scale(H/2 * BEE_SCALE),
            anchor('center'),
            area(),
            z(rF.z),
            {
                update(){
                    if (diaL === 0) {
                        // Update based on y position
                        this.z = this.pos.y + 100;
                        this.scale = this.pos.y * BEE_SCALE;

                        //Bee moving to flower
                        if (b === 0 && nb_flowered != 0) {
                            if (this.pos.x > rF.pos.x) {
                                this.flipX = true;
                            } else {
                                this.flipX = false;
                            }
                            this.moveTo(rF.pos.x, rF.pos.y - 50, BEE_SPEED);
                            if(this.pos.x == rF.pos.x && this.pos.y == rF.pos.y - 50){
                                b++; // Once bee reaches flower, increment by 1
                                this.z = rF.z + 1;
                                this.play("pollen");
                                rF = choose(get("flowered")); // New random flower is chosen
                                rB = choose(get("beehive"));
                            };
                        } else if (b === 0 && nb_flowered == 0){
                            this.moveTo(rand(W), rand(H), BEE_SPEED); // If no flowers, bee moves to a random position
                            CASHBOX.add([
                                text("Tes abeilles sont perdues ! Où sont les fleurs?", { 
                                    size: 20,
                                    font: "d",
                                }),
                                pos(text_cash.pos.x - 400, 250), 
                                color(RED), 
                                lifespan(2), 
                            ]);
                        }
                        // Bee moving to beehive
                        if (b === 1 && nb_beehives != 0) { // Bee moves to beehive if there is one
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
                                // Bee pop sound when bee enters beehive
                                play('bee_in_hive');
                                b++;
                                bh = 0;
                                bh2 = 0;
                                honey++; //honey count is incremented
                                zoomOut(get('honey_icon')[0]);
                                this.play("main");
                            };
                        } else if ((b === 1 || b === 2) && nb_beehives == 0){
                            // If there are no beehives, the bee moves to a random position
                            this.moveTo(rand(W), rand(H), BEE_SPEED);
                            CASHBOX.add([
                                text("Où sont les ruches?", { 
                                    size : 20,
                                    font : "d",
                                }),
                                pos(text_cash.pos.x - 150, 220), 
                                color(RED), 
                                lifespan(2), 
                            ]);
                        };
                        if(b === 2){
                            this.z = 0;
                            bh++;
                            if (bh == 1) {
                                zoomIn(rB);
                            }
                            wait(2, () =>{
                                b = 0;
                                bh2++;
                                if (bh2 == 1) {
                                    zoomOut(rB);
                                }
                                this.z = this.pos.y + 100;
                            });
                        }
                    }
                },
            },
            "bee",
        ]);
            pay(pr_new_bee);
            pr_new_bee  = pr_new_bee * scaling;
       };
        // Add a new beehive
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
                pr_new_beehive  = pr_new_beehive * scaling;
        }
        // Add a new trash
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
        // Add a bulldozer
         function addBulldozer() {
            let rT = choose(get('tree'));
            let ranYA2 = H / 2;
            let ranYB2 = H / 2 + (BG_TILE_SIZE / 2 - 40 * SPRITE_BG_SCALE);
            let randX3 = rand(0, W);
            let randY3 = rand(ranYA2, ranYB2);
            const bulldozer = add([
                sprite('bulldozer', {
                    anim: "main",
                }),
                anchor("bot"),
                pos(-100, H/2),
                {
                    update(){
                        if (diaL == 0) {
                            if (nb_trees > 1) {
                                this.z = this.pos.y;
                                /*//dynamically scale bulldozer
                                if (get('bulldozer').length != 0) {
                                    get('bulldozer')[0].scale = get('bulldozer')[0].pos.y * BULLDOZER_SCALE;
                                }*/ //-----> makes it unclickeable for some reason 
                                if (this.pos.x > rT.pos.x) {
                                    this.flipX = false;
                                } else {
                                    this.flipX = true;
                                }
                                this.moveTo(rT.pos.x, rT.pos.y + 10, BULLDOZER_SPEED);
                                if(this.pos.x == rT.pos.x && this.pos.y == rT.pos.y + 10){
                                    play('tree_fall');
                                    destroy(rT);
                                    achieved_tree_guardian = false;
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
                            } else {
                                this.z = this.pos.y;
                                if (this.pos.x < randX3) {
                                    this.flipX = true;
                                } else {
                                    this.flipX = false;
                                }
                                this.moveTo(randX3, randY3, BEE_SPEED * 2);
                                if(this.pos.x == randX3 && this.pos.y == randY3){
                                    randX3 = rand(0, W);
                                    randY3 = rand(ranYA2, ranYB2);
                                };
                            }
                        }
                    },
                },
                z(1),
                scale(H/2 * BULLDOZER_SCALE),
                area({scale : 0.75}),
                "bulldozer",
            ]);
         };
        // Add new bird
        function addBird() {
            let b       = 0;
            let rT      = choose(get('tree'));
            let ranYA   = H/2;
            let ranYB   = H/2 + (BG_TILE_SIZE/2 - 40 * SPRITE_BG_SCALE)
            let randX   = rand(0, W);
            let randY   = rand(ranYA, ranYB);
            const bird  = add([
                sprite('bird', {
                    anim : "fly",
                }),
                anchor("bot"),
                pos(choose(-10, W+10), H/2),
                {
                    update(){ //bird's actions and mouvements
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
                                        rT      = choose(get('tree'));
                                        randX   = rand(0, W);
                                        randY   = rand(ranYA, ranYB);
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
            ]);
            pay(pr_new_bird);
            pr_new_bird  = pr_new_bird * scaling;
         };
       // Add a dialog box
       function diaBubble(array_with_number){
            let width = W/1.5;
            destroyAll("dialog");
            destroyAll("space_bar");
            const bubble = add([ // can't add this to BEARBOX like intended because the area() stops working
                rect(width, H/8, { radius: 32 }),
                anchor("center"),
                pos(BEARBOX.pos.x - 15, H - H/8),
                z(Z_UI_BOTTOM),
                outline(4),
                area(),
                "dialog",
            ]);
            const txt_bubble = add([
                text(array_with_number[2], { size: 16, font:"d", width: width - 15, align: "center" }),
                pos(bubble.pos),
                anchor("center"),
                color(BLACK),
                z(Z_UI_BOTTOM),
                area(),
                "dialog",
            ]);
            const space = add([
                sprite("space_bar"),
                anchor("center"),
                pos(BEARBOX.pos.x + 360, BEARBOX.pos.y - 40), //the position is not relative to the bubbles, if the scale and position was to be dynamic to screensize it should be changed
                z(Z_UI_BOTTOM),
                outline(4),
                area({scale : 0.75}),
                scale(4),
                "dialog",
                "skip",
            ]);
            icon_bear.use(sprite(array_with_number[0]));
            icon_bear.use(scale(BEAR_SCALE));
            play(array_with_number[1], {detune: -600});
       };

       function calculateSaturation(yPos, minY, maxY) {
            /** 
             * ChatGPT generated code
             * Calculate RGB values based on saturation
             * For demonstration, we'll use a simple linear interpolation from gray to fully saturated color
             * Change saturation here - trial and error 
            */
            // Calculate the percentage of yPos within the range minY to maxY
            const percentage = (yPos - minY) / (maxY - minY);
        
            // Calculate saturation based on the percentage
            // For demonstration, we'll linearly interpolate from 100 to 0 as yPos increases
            const saturation = 100 - (percentage * 100);
        
            return saturation;
        }
        function calculateColor(saturation) {
            /** 
             * ChatGPT generated code
             * Calculate RGB values based on saturation
             * For demonstration, we'll use a simple linear interpolation from gray to fully saturated color
             * Change saturation here - trial and error 
            */
            const grayValue     = 600; // Middle gray value
            const maxColorValue = 100; // Maximum color value
            const colorValue    = grayValue + ((maxColorValue - grayValue) * (saturation / 100));
        
            // Return an object containing RGB values
            return {
                red     : colorValue,
                green   : colorValue,
                blue    : colorValue
            };
        }

       // General Functions
        // Add to score and cash
        function plus(x){
            cash    = cash  + x;
            score   = score + x;
        }

        // Pay with cash
        function pay(x){
            cash = cash - x;
            economist_timer = 0;
        }

        // Exponentially scale price --> for some reason this does not work
        function exp(x){
            console.log(x);
            x = x * scaling;
            console.log(x);
        }

        // Remove pollu-stat
        function minusPollu(){
            if (pollu_over > 0) {
                pollu_over = pollu_over - pollu_boost;
            }
            if(pollu_over <= 0 && pollu_stat > 0){
                pollu_stat = pollu_stat - pollu_boost;
            }
        }
        // Remove defo-stat
        function minusDefo(){
            if (defo_over > 0) {
                defo_over = defo_over - defo_boost;
            }
            if(defo_over <= 0 && defo_stat > 0){
                defo_stat = defo_stat - defo_boost;
            }
        }
})

// GameOver Scene --> Type name scene
scene("gameOver", () => {
    /**
     * This scene was heavily assisted by OpenAI's chatGPT-4o.
     * The prompt and response would be too long to add to the code, here is the process of usage:
     *      Gave it the entirety of this code to serve as an example of proper Kaboom.js coding;
     *      Explained the logic of what needs to be done in this scene;
     *      Saw the poor results and tested them;
     *      Re-explained the logic and try to correct it where I couldn't find a fix;
     *      Tested a closer result and change it to fit the full purpose of the scene;
     */
    const LANGUAGE = localStorage.getItem("language") || "FR"; // Language choice on localStorage or French by default
    const TXT = langData[LANGUAGE];

    setBackground(rgb(79, 146, 240));

    if (alw == 1){
        showAchievementPopUp(TXT.alw);
    };
    if (atg == 1){
        showAchievementPopUp(TXT.atg);
    };
    if (abw == 1){
        showAchievementPopUp(TXT.abw);
    };

    let playerName = "";
    let playerScore = honey;
    let colors = [RED, GREEN, BLUE, YELLOW, MAGENTA, CYAN, WHITE, BLACK];
    let currentColorIndex = 6; // Default to WHITE

    // Custom color adjustment values
    let customColor = { r: 255, g: 255, b: 255 };

    const gameOverText = add([
        text(TXT.time_over, {font:"d", size: 50 }),
        color(BLUE),
        pos(W / 2, 100),
        anchor("center"),
    ]);
    const instructionText = add([
        text(TXT.type, {font:"d", size: 30 }),
        color(BLACK),
        pos(W / 2, H / 3 - 50),
        anchor("center"),
    ]);

    const input = add([
        text("", {font:"d", size: 40 }),
        pos(W / 2, H / 3 + 40),
        anchor("center"),
        {
            update() {
                this.text = playerName;
                this.color = rgb(customColor.r, customColor.g, customColor.b);
            },
        },
    ]);

    onCharInput((ch) => {
        if (playerName.length < 20) {
            playerName += ch;
        }
    });

    onKeyPress("backspace", () => {
        playerName = playerName.substring(0, playerName.length - 1);
    });

    onKeyPress("right", () => {
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        customColor = { r: colors[currentColorIndex].r, g: colors[currentColorIndex].g, b: colors[currentColorIndex].b };
        localStorage.setItem('achieved_hidden_secret', 'true');
        if (ahs == 0) {
            showAchievementPopUp(TXT.ahs);
        }
    });

    onKeyPress("left", () => {
        currentColorIndex = (currentColorIndex - 1 + colors.length) % colors.length;
        customColor = { r: colors[currentColorIndex].r, g: colors[currentColorIndex].g, b: colors[currentColorIndex].b };
        localStorage.setItem('achieved_hidden_secret', 'true');
        if (ahs == 0) {
            showAchievementPopUp(TXT.ahs);
        }
    });

    onKeyDown("down", () => {
        customColor.r = Math.max(0, customColor.r - 1);
        customColor.g = Math.max(0, customColor.g - 2);
        customColor.b = Math.max(0, customColor.b - 3);
        localStorage.setItem('achieved_hidden_secret', 'true');
        if (ahs == 0) {
            showAchievementPopUp(TXT.ahs);
        }
    });

    onKeyDown("up", () => {
        customColor.r = Math.min(255, customColor.r + 1);
        customColor.g = Math.min(255, customColor.g + 2);
        customColor.b = Math.min(255, customColor.b + 3);
        localStorage.setItem('achieved_hidden_secret', 'true');
        if (ahs == 0) {
            showAchievementPopUp(TXT.ahs);
        }
    });

    const confirmButton = add([
        rect(200, 50, { radius: 15 }),
        pos(W / 2, H / 2),
        anchor("center"),
        outline(4),
        area(),
        "confirmButton",
        "button",
    ]);

    const confirmButtonText = add([
        text(TXT.confirm, {font:"d", size: 20 }),
        color(0, 0, 0),
        pos(W / 2, H / 2),
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

            if ( !highScores.some(entry => entry.name === newEntry.name && entry.score === newEntry.score && entry.color.r === newEntry.color.r && entry.color.g === newEntry.color.g && entry.color.b === newEntry.color.b)) {
                highScores.push(newEntry);
            }

            highScores = highScores.sort((a, b) => b.score - a.score);

            localStorage.setItem('highScores', JSON.stringify(highScores));

            go("highScoreDisplay", { playerName, playerScore, playerColor: newEntry.color });
        }
    }

    onClick("confirmButton", saveScore);
    onKeyRelease("enter", saveScore);

    // Mobile button
    const mobileButton = add([
        rect(250, 50, { radius: 15 }),
        pos(W - 160, H - 60),
        anchor("center"),
        outline(4),
        area(),
        "mobileButton",
        "button",
    ]);
    const mobileButtonText = add([
        text(TXT.phone, {font:"d", size: 18 }),
        color(0, 0, 0),
        pos(W - 160, H - 60),
        anchor("center"),
        area(),
        "mobileButton",
        "button",
    ]);

    const keys = [
        ...'ABCDEFGHIJKLM',
        ...'NOPQRSTUVWXYZ',
        ...'0123456789',
        '.', ',', '-',
    ];

    const specialKeys = [
        { key: 'espace', display: 'espace', width: 320 },
        { key: 'supprimer', display: 'supprimer', width: 200 },
        { key: '<', display: '<', width: 50 },
        { key: '>', display: '>', width: 50 },
        { key: '^', display: '^', width: 50 },
        { key: 'v', display: 'v', width: 50 }
    ];

    let keyboardVisible = false;

    onClick("mobileButton", () => {
        if ( !keyboardVisible) {
            keyboardVisible = true;
            const buttonSize = 50;
            const padding = 10;
            const columns = 13;
            const startX = (W - (columns * (buttonSize + padding))) / 2;
            const startY = H - (4 * (buttonSize + padding)) - 80;

            keys.forEach((key, index) => {
                const x = startX + (index % columns) * (buttonSize + padding);
                const y = startY + Math.floor(index / columns) * (buttonSize + padding) + 50;

                const keyButton = add([
                    rect(buttonSize, buttonSize, { radius: 5 }),
                    pos(x, y),
                    anchor("center"),
                    outline(2),
                    area(),
                    {key: key,},
                    "keyButton",
                    "button",
                ]);

                add([
                    text(key, {font:"d", size: 16 }),
                    pos(x, y),
                    anchor("center"),
                    color(0, 0, 0),
                    {key: key,},
                    "buttonText",
                ]);

                onClick("keyButton", (b) => {
                    if (playerName.length < 10) {
                        playerName += b.key;
                        playerName = playerName.replace(/(.)\1+/g, "$1");
                    }
                });
            });

            specialKeys.forEach((specKey, index) => {
                const x = -25 + startX + specialKeys.slice(0, index).reduce((sum, k) => sum + k.width + padding, 0) + specKey.width / 2;
                const y = startY + (3 * (buttonSize + padding)) + 50;

                const keyButton = add([
                    rect(specKey.width, buttonSize, { radius: 5 }),
                    pos(x, y),
                    anchor("center"),
                    outline(2),
                    area(),
                    {key: specKey.key},
                    "specKeyButton",
                    "button",
                ]);

                add([
                    text(specKey.display, {font:"d", size: 16 }),
                    pos(x, y),
                    anchor("center"),
                    color(0, 0, 0),
                    "buttonText",
                ]);

                onClick("specKeyButton", (b) => {
                    switch (b.key) {
                        case 'supprimer':
                            playerName = playerName.substring(0, playerName.length - 1);
                            break;
                        case '<':
                            currentColorIndex = (currentColorIndex - 1 + colors.length) % colors.length;
                            customColor = { r: colors[currentColorIndex].r, g: colors[currentColorIndex].g, b: colors[currentColorIndex].b };
                            localStorage.setItem('achieved_hidden_secret', 'true');
                            if (ahs == 0) {
                                showAchievementPopUp(TXT.ahs);
                            }
                            break;
                        case '>':
                            currentColorIndex = (currentColorIndex + 1) % colors.length;
                            customColor = { r: colors[currentColorIndex].r, g: colors[currentColorIndex].g, b: colors[currentColorIndex].b };
                            localStorage.setItem('achieved_hidden_secret', 'true');
                            if (ahs == 0) {
                                showAchievementPopUp(TXT.ahs);
                            }
                            break;
                        case '^':
                            customColor.r = Math.min(255, customColor.r + 1);
                            customColor.g = Math.min(255, customColor.g + 2);
                            customColor.b = Math.min(255, customColor.b + 3);
                            localStorage.setItem('achieved_hidden_secret', 'true');
                            if (ahs == 0) {
                                showAchievementPopUp(TXT.ahs);
                            }
                            break;
                        case 'v':
                            customColor.r = Math.max(0, customColor.r - 1);
                            customColor.g = Math.max(0, customColor.g - 2);
                            customColor.b = Math.max(0, customColor.b - 3);
                            localStorage.setItem('achieved_hidden_secret', 'true');
                            if (ahs == 0) {
                                showAchievementPopUp(TXT.ahs);
                            }
                            break;
                        case 'espace':
                            if (playerName.length < 10) {
                                playerName += ' ';
                                playerName = playerName.replace(/(.)\1+/g, "$1");
                            }
                            break;
                    }
                });
            });
        }
    });

    onClick("button", (b) => {
        zoomIn(b);
        play('button_click');
    });
});

scene("highScoreDisplay", ({ playerName, playerScore, playerColor }) => {
    /**
     * This scene was lightly assisted by OpenAI's chatGPT-4o.
     * The prompt and response would be too long to add to the code, here is the process of usage:
     *      Explained the logic of what the bits I couldn't figure out about localStorage;
     *      Tried to understand the code
     *      Adapted it and added it to the scene based on my newly aquired knowledge
     */
    const LANGUAGE = localStorage.getItem("language") || "FR"; // Language choice on localStorage or French by default
    const TXT = langData[LANGUAGE];

    setBackground(79, 146, 240);

    const icon_honey = add([ // SCOREBOX
        sprite('honey'),
        anchor("center"),
        pos(W / 2, H / 4 + 20),
        z(0),
        scale(10),
        "ui",
     ]);

    add([
        text(TXT.your_score, {font:"d", size: 30 }),
        pos(W / 2, H / 4 - 130),
        anchor("center"),
    ]);

    add([
        text(`${playerScore}`, {font:"d", size: 55, color: BLACK}),
        pos(W / 2, H / 4 + 90),
        anchor("center"),
        color(BLACK),
    ]);

    add([
        text(TXT.best, {font:"d", size: 30 }),
        pos(W / 2, H / 2),
        anchor("center"),
    ]);

    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.slice(0, 3).forEach((entry, index) => {
        add([
            text(`${index + 1}. ${entry.name} : ${entry.score}`, {font:"d", size: 25 }),
            pos(W / 2, H / 2 + 50 + index * 30),
            anchor("center"),
            color(rgb(entry.color.r, entry.color.g, entry.color.b)),
        ]);
    });

    const buttonYPos = H - 100;

    const replayButton = add([
        rect(150, 50, { radius: 15 }),
        anchor("center"),
        pos(W / 2 - 170, buttonYPos),
        outline(4),
        area(),
        "replayButton",
        "button",
    ]);
    const replayButtonText = add([
        text(TXT.replay, {font:"d", size: 18 }),
        color(0, 0, 0),
        pos(W / 2 - 170, buttonYPos),
        anchor("center"),
        area(),
        "replayButton",
        "button",
    ]);
    onClick("replayButton", (b) => {
        timer = CHAL_TIME;
        go("game");
    });

    const scoreboardButton = add([
        rect(150, 50, { radius: 15 }),
        anchor("center"),
        pos(W / 2, buttonYPos),
        outline(4),
        area(),
        "scoreboardButton",
        "button",
    ]);
    const scoreboardButtonText = add([
        text(TXT.scoreboard, {font:"d", size: 14 }),
        color(0, 0, 0),
        pos(W / 2, buttonYPos),
        anchor("center"),
        area(),
        "scoreboardButton",
        "button",
    ]);
    onClick("scoreboardButton", () => {
        go("scoreboard");
        play('button_click');
    });

    const menuButton = add([
        rect(150, 50, { radius: 15 }),
        anchor("center"),
        pos(W / 2 + 170, buttonYPos),
        outline(4),
        area(),
        "button",
        "menuButton",
    ]);

    const menuButtonText = add([
        text(TXT.menu, {font:"d", size: 18 }),
        color(0, 0, 0),
        pos(W / 2 + 170, buttonYPos),
        anchor("center"),
        area(),
        "button",
        "menuButton",
    ]);

    onClick("menuButton", () => {
        go("startMenu");
        play('button_click');
    });
});

scene("scoreboard", () => {
    /**
     * This scene was lightly assisted by OpenAI's chatGPT-4o.
     * The prompt and response would be too long to add to the code, here is the process of usage:
     *      Explained the logic of what the bits I couldn't figure out about localStorage;
     *      Tried to understand the code
     *      Adapted it and added it to the scene based on my newly aquired knowledge
     */
    const LANGUAGE = localStorage.getItem("language") || "FR"; // Language choice on localStorage or French by default
    const TXT = langData[LANGUAGE];

    setBackground(79, 146, 240);

    const buttonYPos        = 50;
    const scoreListYStart   = 150;
    const maxVisibleItems   = Math.floor((H - scoreListYStart) / 40);
    let scrollOffset        = 0;
    let replayTxt           = TXT.replay;
    let replayPos           = -10;

    if (inGame == true) {
        replayTxt = TXT.replay;
        replayPos = -10;
    } else {
        replayTxt = TXT.play;
        replayPos = -26;
    }

    // Replay button
    const replayButton = add([
        rect(150, 50, { radius: 15 }),
        anchor("topright"),
        pos(W / 2 - 10, buttonYPos),
        outline(4),
        area(),
        "replayButton",
        "button",
    ]);
    const replayButtonText = replayButton.add([
        text(replayTxt, {font:"d", size: 18 }),
        color(0, 0, 0),
        pos(replayPos,18),
        anchor("topright"),
        area(),
        "replayButton",
        "button",
    ]);
    onClick("replayButton", () => {
        timer = CHAL_TIME;
        go("game");
        play('button_click');
    });
    // Menu button
    const menuButton = add([
        rect(150, 50, { radius: 15 }),
        anchor("topleft"),
        pos(W / 2 + 10, buttonYPos),
        outline(4),
        area(),
        "menuButton",
        "button",
    ]);
    const menuButtonText = menuButton.add([
        text(TXT.menu, {font:"d", size: 18 }),
        color(0, 0, 0),
        pos(40,18),
        anchor("topleft"),
        area(),
        "menuButton",
        "button",
    ]);
    onClick("menuButton", () => {
        go("startMenu");
        play('button_click');
    });

    // Fetch high scores
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    function drawScores() {
        destroyAll("scoreItem");

        // Check if highScores is empty
        if (highScores.length === 0) {
            // Display the message if there are no scores
            add([
                text(TXT.no_score, {font: "d", size: 24 }),
                pos(W / 2, scoreListYStart),
                anchor("center"),
                color(255, 255, 255),
                "scoreItem",
            ]);
        } else {
            // Display the scores if there are any
            highScores.slice(scrollOffset, scrollOffset + maxVisibleItems).forEach((entry, index) => {
                add([
                    text(entry.name, {font:"d", size: 25 }),
                    pos(W / 2 - 20, scoreListYStart + index * 40),
                    anchor("right"),
                    color(rgb(entry.color.r, entry.color.g, entry.color.b)),
                    "scoreItem"
                ]);

                add([
                    text(entry.score, {font:"d", size: 25 }),
                    pos(W / 2 + 20, scoreListYStart + index * 40),
                    anchor("left"),
                    color(rgb(entry.color.r, entry.color.g, entry.color.b)),
                    "scoreItem"
                ]);
            });
        }
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

    onScroll((dir) => { // I don't know how this works, but so far it does not
        if (dir === "up" && scrollOffset > 0) {
            scrollOffset -= 1;
        } else if (dir === "down" && scrollOffset < highScores.length - maxVisibleItems) {
            scrollOffset += 1;
        }
        drawScores();
    });

        // Add the small text at the bottom right
        add([
            text(TXT.arrows, {font:"d", size: 10 }),
            pos(W - 20, H - 20),
            anchor("botright"),
            color(BLACK),
        ]);
});

scene("achievements", () => { //Scene moderately chatGPT assisted
    const LANGUAGE = localStorage.getItem("language") || "FR"; // Language choice on localStorage or French by default
    const TXT = langData[LANGUAGE];

    setBackground(rgb(0, 191, 255));

    // UI Constants
    const ACHIEVE_WIDTH     = W * 0.8;
    const ACHIEVE_HEIGHT    = H * 0.1;
    const ACHIEVE_PADDING   = 20;
    const COMPLETED_COLOR   = rgb(60, 170, 60);  
    const LOCKED_COLOR      = rgb(120, 120, 120);  
    const SECRET_COLOR      = rgb(255, 223, 0); 
    let scrollOffset        = 0;
    const maxVisibleItems = Math.floor((H - 250) / (ACHIEVE_HEIGHT + ACHIEVE_PADDING));

    // List of achievements
    const achievements = [
        {
            title: TXT.afl, 
            description: TXT.aflD, 
            key: "achieved_forest_lord",
            color: COMPLETED_COLOR,
        },
        {
            title: TXT.abw, 
            description: TXT.abwD, 
            key: "achieved_bee_whisperer",
            color: COMPLETED_COLOR,
        },
        {
            title: TXT.als, 
            description: TXT.alsD, 
            key: "achieved_lone_wolf",
            color: COMPLETED_COLOR,
        },
        {
            title: TXT.agd, 
            description: TXT.agdD, 
            key: "achieved_gardener_dedicated",
            color: COMPLETED_COLOR,
        },
        {
            title: TXT.abk, 
            description: TXT.abkD, 
            key: "achieved_bird_kingdom",
            color: COMPLETED_COLOR,
        },
        {
            title: TXT.abm, 
            description: TXT.abmD, 
            key: "achieved_bee_master",
            color: COMPLETED_COLOR,
        },
        {
            title: TXT.apb, 
            description: TXT.apbD, 
            key: "achieved_perfect_bloom",
            color: COMPLETED_COLOR,
        },
        {
            title: TXT.alt, 
            description: TXT.altD, 
            key: "achieved_leaf_tycoon",
            color: COMPLETED_COLOR,
        },
        {
            title: TXT.afls, 
            description: TXT.aflsD, 
            key: "achieved_falling_leafs",
            color: COMPLETED_COLOR,
        },
        {
            title: TXT.ae, 
            description: TXT.aeD, 
            key: "achieved_economist",
            color: COMPLETED_COLOR,
        },
        {
            title: TXT.atg, 
            description: TXT.atgD, 
            key: "achieved_tree_guardian",
            color: COMPLETED_COLOR,
        },
        {
            title: TXT.ac, 
            description: TXT.acD, 
            key: "achieved_curious",
            color: SECRET_COLOR,
        },
        {
            title: TXT.ahs, 
            description: TXT.ahsD, 
            key: "achieved_hidden_secret",
            color: SECRET_COLOR,
        },
    ];

    // Title of the achievements scene
    add([
        text(TXT.achievements, {
            size: 48,
            font: "d",
        }),
        pos(W / 2, 50),
        anchor("center"),
        color(255, 255, 255),
    ]);

    // Function to display achievements
    function drawAchievements() {
        destroyAll("achievementItem");

        achievements.slice(scrollOffset, scrollOffset + maxVisibleItems).forEach((ach, i) => {
            const isAchieved = !!localStorage.getItem(ach.key);

            const achieveBox = add([
                rect(ACHIEVE_WIDTH, ACHIEVE_HEIGHT, { radius: 8 }),
                pos(W / 2, 150 + (i * (ACHIEVE_HEIGHT + ACHIEVE_PADDING))),
                anchor("center"),
                color(0, 0, 0),
                z(1),
                "achievementItem"
            ]);

            // Achievement title
            achieveBox.add([
                text(ach.title, {
                    size: 32,
                    font: "d",
                    width: ACHIEVE_WIDTH - 20,
                }),
                pos(20, -10),
                anchor("center"),
                color(isAchieved ? ach.color : LOCKED_COLOR),
                "achievementItem"
            ]);

            // Achievement description
            achieveBox.add([
                text(ach.description, {
                    size: 16,
                    font: "d",
                    width: ACHIEVE_WIDTH - 20,
                }),
                pos(20, 20),
                anchor("center"),
                color(isAchieved ? ach.color : LOCKED_COLOR),
                "achievementItem"
            ]);

            // Status: Completed or Locked
            achieveBox.add([
                text(isAchieved ? TXT.completed : TXT.locked , {
                    size: 24,
                    font: "d",
                }),
                pos(ACHIEVE_WIDTH - 20, ACHIEVE_HEIGHT / 2),
                anchor("right"),
                color(isAchieved ? COMPLETED_COLOR : LOCKED_COLOR),
                "achievementItem"
            ]);
        });
    }

    // Draw achievements
    drawAchievements();

    // Scroll  using arrow keys and mouse scroll
    onKeyPress("up", () => {
        if (scrollOffset > 0) {
            scrollOffset -= 1;
            drawAchievements();
        }
    });
    onKeyPress("down", () => {
        if (scrollOffset < achievements.length - maxVisibleItems) {
            scrollOffset += 1;
            drawAchievements();
        }
    });
    onScroll((dir) => { //Still not working
        if (dir === "up" && scrollOffset > 0) {
            scrollOffset -= 1;
        } else if (dir === "down" && scrollOffset < achievements.length - maxVisibleItems) {
            scrollOffset += 1;
        }
        drawAchievements();
    });

    // Menu button
    const menuButton = add([
        rect(150, 50, { radius: 15 }),
        anchor("topleft"),
        pos(25, 25),
        outline(4),
        area(),
        z(Z_UI),
        "menuButton",
        "button",
    ]);
    const menuButtonText = menuButton.add([
        text(TXT.menu, {font:"d", size: 18 }),
        color(0, 0, 0),
        pos(menuButton.pos.x + 15, menuButton.pos.y - 7),
        z(Z_UI_TOP),
        anchor(menuButton.anchor),
        area(),
        "menuButton",
        "button",
    ]);
    onClick("menuButton", () => {
        go("startMenu");
        play('button_click');
    });

    // Small text at the bottom right
    add([
        text(TXT.arrows, {
            font: "d", 
            size: 10,
        }),
        pos(W - 20, H - 20),
        anchor("botright"),
        color(0, 0, 0),
    ]);
});

// GENERAL FUNCTIONS
    // Zoom out
    function zoomOut(t){
        if (t != undefined) {
            t.width  = t.width   * CLICK_JUMP;
            t.height = t.height  * CLICK_JUMP;
        }            
        wait(0.1, () => {
            if (t != undefined) {
                t.width  = t.width  / CLICK_JUMP;
                t.height = t.height / CLICK_JUMP;
            }
        });
    };
    // Zoom in
   function zoomIn(t){
        if (t != undefined) {
            t.width  = t.width   / CLICK_JUMP;
            t.height = t.height  / CLICK_JUMP;
        }            
        wait(0.1, () => {
            if (t != undefined) {
                t.width  = t.width  * CLICK_JUMP;
                t.height = t.height * CLICK_JUMP;
            }
        })
    };
    // Warning in red
    function warning(t){
        shake(1);
        t.color = rgb (255, 0, 0);
        wait(0.5, () =>{
            t.color = '';
        })
        play("error", {volume: 0.2});
    };
    function smallWarning(t){
        t.color = rgb (255, 0, 0);
        wait(0.3, () =>{
            t.color = '';
        })
    };
    
    onClick("button", (t) => {
        play('button_click');
    });

    // Function to display achievement pop-up chatGPT generated
    function showAchievementPopUp(achievementName) {
        achievementQueue.push(achievementName);
        if (!achievementActive) {
            processAchievementQueue();
        }
    }
    function processAchievementQueue() {
        if (achievementQueue.length > 0 && !achievementActive) {
            achievementActive = true;
            const achievementName = achievementQueue.shift();

            play('win');

            // Pop-up container
            const popUpBox = add([
                rect(W * 0.6, 100, { radius: 15 }),
                pos(W / 2, 100),
                anchor("center"),
                color(255, 255, 255), 
                outline(4),
                opacity(0),  // Start with 0 opacity for fade-in
                z(Z_UI_TOP + 1),
                "achievementPopup"
            ]);

            popUpBox.add([
                text(TXT.done, {
                    font: "d",
                    size: 24,
                }),
                pos(0, -20),
                anchor("center"),
                color(60, 170, 60),
                "achievementPopupText"
            ]);

            popUpBox.add([
                text(achievementName, {
                    font: "d",
                    size: 20,
                }),
                pos(0, 20),
                anchor("center"),
                color(0, 0, 0),
                "achievementPopupText"
            ]);

            // Show the pop-up with fade-in effect
            tween(popUpBox.opacity, 1, 0.5, (val) => {
                popUpBox.opacity = val;
            }).then(() => {
                wait(3, () => {
                    // Fade-out the pop-up after 3 seconds
                    tween(popUpBox.opacity, 0, 0.5, (val) => {
                        popUpBox.opacity = val;
                    }).then(() => {
                        destroy(popUpBox);
                        achievementActive = false;
                        processAchievementQueue();  // Process the next achievement pop-up in the queue
                    });
                });
            });
        }
    }

    // THIS DOESN'TXT WORK FOR SOME REASON
    onHover("button", (b) => {
        console.log("HOVERING")
        b.use(shader("lighten"));
    });
    onHoverEnd("button", (b) => {
        console.log("H-over")
        b.use(shader(""));
    });

    // From https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900/63066148 (answered Jul 4, 2019 at 20:48 by MarredCheese)
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
        orderSuffixes = ['', 'k', 'M', 'B', 'TXT'],
        minOrder = 0,
        maxOrder = Infinity
    } = {}) {

    let x = parseFloat(number);

    if (isNaN(x))
        return valueIfNaN;

    if (style === '%')
        x *= 100.0;

    let order;
    if ( !isFinite(x) || !useOrderSuffix)
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
        'fr-CH',    // Need to change that if multiple languages selection
        {
            style: 'decimal',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }
        ) +
        orderSuffix +
        (style === '%' ? '%' : '');
    }

    // From https://stackoverflow.com/a/11486026 (answered Jul 14, 2012 at 20:48 by Vishal)
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

// we finally have a start scene, yay !
function startGame() {
    go("startMenu");
};
startGame();
