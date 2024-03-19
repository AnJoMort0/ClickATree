//IDEAS TO ADD
    //Hide HUD button
    //Timed game mode for the Mystères de l'Unil specifically (with cashboard?)

//===================================================================//
//===================================================================//

kaboom({
    background  : [0, 0, 0],
    width       : window.innerWidth,
    height      : window.innerHeight,
    letterbox   : true,
})

//static values
setGravity(800);
const click_jump    = 1.05;
//z values:
    const z_ui      = 10;
    const z_ui_top  = 11;
    const z_pp      = 9;

//load assets
loadRoot('assets/');

//load images
    //game elements
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
    //ui elements
        //new buttons
        loadSprite('new_tree', "ui/new_buttons/new_tree_button.png");
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
    let nb_trees     = 1;
    //prices
        let pr_new_tree = 20;

    //ADDING UI
    //cash
    const icon_cash = add([
        sprite('leaf0'),
        pos(10, 50),
        scale(0.03),
        anchor('left'),
        z(z_ui),
        "ui",
     ]);
    const text_cash = add([
        text(Math.floor(cash),{
           width : 600
        }),
        pos(icon_cash.pos.x + 60, icon_cash.pos.y),
        anchor(icon_cash.anchor),
        z(z_ui),
        // mettre à jour le cash
        {
           update(){
              this.text = Math.floor(cash);
           }
        },
        "ui"
     ]);
    //score
    const text_score = add([
        text(`Score : ${Math.floor(score)}`,{
           width : 600
        }),
        pos(15, height() - 30),
        anchor("left"),
        z(z_ui),
        // mettre à jour le score
        {
           update(){
              this.text = `Score : ${Math.floor(score)}`;
           }
        },
       "ui"
    ]);

     //adding a new tree button
     const new_tree = add([
        sprite('new_tree'),
        pos(width() - 10, 75),
        scale(1),
        anchor("right"),
        area(),
        z(z_ui),
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
        z(z_ui_top),
     ])

    //ADDING OBJECTS
        //adding starting tree
        const start_tree = add([
        sprite(`tree0`),
        pos(vec2(width()/2, height()/2)),
        scale(0.3),
        anchor("center"),
        area(),
        z(z_pp),
        "tree",
        "clickable",
        "start_tree",
    ]);

    //ADDING EVENT LISTENERS
    //Game elements
        //click the starting tree
        onClick("start_tree", (t) => {    
            cash++; //add to the cash
            score++; //add to score
            //particles when clicked
            for (let i = 0; i < 3; i++) {
                const leaf_particle = add([
                    pos(mousePos()),
                    sprite(choose(leafs)),
                    anchor("center"),
                    scale(rand(0.008, 0.02)),
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
    
    //UI elements
        //click any button
        onClick("button", (b) => {
            zoomIn(b);
        })

        //New itens buttons
            //New tree
            onClick("new_tree", (t) =>{
                console.log("new tree");
                if(cash < pr_new_tree){
                    warning(text_cash);
                    warning(text_new_tree_price);
                } else {
                    cash = cash - pr_new_tree;
                    pr_new_tree = pr_new_tree * 1.4;
                    addTree();
                    nb_trees++;
                }
            })

    //AUTOMATIC STUFF
       //Each tree gives cash overtime
       loop(10, () => {
            cash  = cash  + nb_trees;
            score = score + nb_trees;
       })

    //FUNCTIONS
        //Add a new tree
       function addTree() {
         const tree = add([
             sprite(choose(trees)),
             pos(rand(0, width()), rand(height()/3, height()-100)),
             scale(rand(0.1, 0.23)),
             anchor("center"),
             area(),
             z(1),
             "tree",
          ])
       }
})

scene("pauseMenu", () => {

})

go('game');

//GENERAL FUNCTIONS
    //Zoom out
    function zoomOut(t){
        t.width  = t.width   * click_jump;
        t.height = t.height  * click_jump;            
        wait(0.1, () => {
            t.width  = t.width  / click_jump;
            t.height = t.height / click_jump;
        })
    }
    //Zoom in
   function zoomIn(t){
        t.width  = t.width   / click_jump;
        t.height = t.height  / click_jump;            
        wait(0.1, () => {
            t.width  = t.width  * click_jump;
            t.height = t.height * click_jump;
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