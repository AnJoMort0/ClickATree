update()//{
                    if (diaL == 0) {
                        this.z = this.pos.y + 100;
                        this.pos.y * BEE_SCALE;
                        if (this.pos.x > rF.pos.x) {
                            this.flipX = true;
                        } else {
                            this.flipX = false;
                        }
                        if (b == 0) {
                            this.moveTo(rF.pos.x, rF.pos.y - 50, BEE_SPEED);
                            if(this.pos.x == rF.pos.x && this.pos.y == rF.pos.y - 50){
                                if(nb_flowered != 0){
                                    rF = choose(get('flowered'));
                                    b = 1;
                                } else {
                                    b = 100;
                                }
                            }
                        }
                        if(b == 1){
                            if(nb_beehives == 0){
                                b = 101;
                            } else {
                                rB = choose(get('beehive'));
                                this.moveTo(rB.pos.x, rB.pos.y, BEE_SPEED)
                                b = 2;
                            }
                        }
                        if(b == 2 && this.pos.x == rB.pos.x && this.pos.y == rB.pos.y){
                            this.z(0);
                            rB.zoomIn();
                            wait(2, () =>{
                                rB.zoomOut();
                                this.z = this.pos.y + 100;
                                honey++;
                                console.log("honey");
                                b = 0;
                            });
                            if(nb_beehives != 0){
                                rF = choose(get('beehive'));
                                b = 1;
                            } else {
                                b = 101;
                            }
                        }
                        if(b == 100){
                            this.moveTo(rand(W), rand(H), BEE_SPEED);
                            if(nb_flowered != 0){
                                b = 0;
                            }
                        }
                        if(b != 101){
                            this.moveTo(rand(W), rand(H), BEE_SPEED);
                            if(nb_beehives != 0){
                                b = 1;
                            }
                        }
                    }
                //}