
if(time == -10){
    loadSprite("store_icon","v2assets/icons/store_icon.png")
    const store_icon = add([
        sprite("store_icon"),
        anchor("center"),
        pos(15, H - 100),
        z(Z_UI),
        area(),
        scale(4),
        "icon",
        "button",
        "store_button"
    ])
}