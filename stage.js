class Stage{
    constructor(data,game){
        this.stage_data = data
        this.bg = new Image()
        this.bg.src = this.stage_data.images.background
        this.ground = new Image()
        this.ground.src = this.stage_data.images.floor
        this.obstacle_width = 160
        this.obstacle_height = 160
        this.cycle_counter=0
        this.cycle_has_ended=false
        this.obstacles = []
        this.obstacles_2 = []
        this.current_pattern=0
        console.log('stage')
        this.game_instance=game
        this.patterns = this.stage_data.patterns
        this.set_pattern(this.patterns[this.current_pattern],0)
        this.speed=10
        this.base_speed=10
        this.next_pattern_set=false
    }
    update(){
        for(let i = 0; i<this.obstacles.length; i++){
            let obstacle = this.obstacles[i]
            this.update_obstacle(obstacle)
            if(this.cycle_has_ended){
                if(!this.next_pattern_set){
                    let pattern_index = this.current_pattern + 1
                    if(pattern_index >= this.patterns.length) pattern_index = 0
                    this.set_pattern(this.patterns[pattern_index],1920)
                    this.next_pattern_set = true
                }
                if(i==this.obstacles.length-1){
                    if(obstacle.x+obstacle.w<=0){
                        this.finish_cycle()
                    }
                }
                continue
            }
            if(obstacle.x+obstacle.w<=0){
                
                if(this.patterns[this.current_pattern].randomized==true){
                    let randomInt = Math.floor(Math.random() * 10);
                    obstacle.x=1920+randomInt*160
                }else{
                    obstacle.x=1920
                }
                if(Math.floor(Math.random() * 10)==1){
                    this.game_instance.spawn_coin(obstacle)
                }
                if(Math.floor(Math.random() * 40)==1){
                    this.game_instance.spawn_item(obstacle)
                }
                if(i==this.obstacles.length-1){
                    this.next_cycle()
                }
                
            }
        }
        if(this.cycle_has_ended){
            for(let i = 0; i<this.obstacles_2.length; i++){
                let obstacle = this.obstacles_2[i]
                this.update_obstacle(obstacle)
            }
        }
    }
    update_obstacle(obstacle){
        obstacle.x-=this.speed
        if(obstacle.type=='missle'||obstacle.type=='flying platform'||obstacle.type=='murder drone'){
            obstacle.onupdate(obstacle)
        }
    }
    draw(ctx,game){
        ctx.drawImage(this.bg,0,0,this.stage_data.width,this.stage_data.height)
        this.obstacles.forEach(obstacle=>{
            if(obstacle.type=='bouncer'){
                ctx.fillStyle='orange'
                ctx.fillRect(obstacle.x-5,obstacle.y-5,obstacle.w+5,obstacle.h+5)
            }
            ctx.drawImage(this.ground,obstacle.x,obstacle.y,obstacle.w,obstacle.h)
            if(obstacle.type=='missle'){
                ctx.fillStyle='orange'
                ctx.fillRect(obstacle.x,obstacle.y,obstacle.w,obstacle.h)
            }
            if(obstacle.type=='murder drone'){
                ctx.fillStyle='red'
                ctx.fillRect(obstacle.x,obstacle.y,obstacle.w,obstacle.h)
            }
            const clip = game.getClipRect(obstacle);
            ctx.strokeStyle = 'lime';
            ctx.strokeRect(clip.x, clip.y, clip.w, clip.h);
        })
        if(this.cycle_has_ended){
            this.obstacles_2.forEach(obstacle=>{
                if(obstacle.type=='bouncer'){
                    ctx.fillStyle='orange'
                    ctx.fillRect(obstacle.x-5,obstacle.y-5,obstacle.w+5,obstacle.h+5)
                }
                ctx.drawImage(this.ground,obstacle.x,obstacle.y,obstacle.w,obstacle.h)
                    if(obstacle.type=='missle'){
                    ctx.fillStyle='orange'
                    ctx.fillRect(obstacle.x,obstacle.y,obstacle.w,obstacle.h)
                }
                const clip = game.getClipRect(obstacle);
                ctx.strokeStyle = 'lime';
                ctx.strokeRect(clip.x, clip.y, clip.w, clip.h);
            })
        }
        
        
    }
    next_cycle(){
        this.cycle_counter++
        if(this.cycle_counter>=this.patterns[this.current_pattern].cycles){
            this.cycle_counter=0
            this.cycle_has_ended=true
            //this.current_pattern++
            //if(this.current_pattern>=this.patterns.length){this.current_pattern=0}
            //this.set_pattern(this.patterns[this.current_pattern])
        }
    }
    set_pattern(pattern,offset){
        let obstacles=[]
        for(let i = 0;i<pattern.data.length;i++){
            let rise = pattern.data.length-i
            for(let j = 0; j<pattern.data[i].length;j++){
                let obj
                if(pattern.data[i][j]==1){
                    obj = {x:j*this.obstacle_width+offset,y:1080-this.obstacle_height*rise,w:this.obstacle_width,h:this.obstacle_height,type:'normal',
                        oncollide:function(game,dir){
                            return
                        }
                    }
                    obstacles.push(obj)
                }
                if(pattern.data[i][j]==2){
                    obj = {x:j*this.obstacle_width+offset,y:1080-this.obstacle_height*rise,w:this.obstacle_width,h:this.obstacle_height,type:'bouncer',
                        oncollide:function(game,dir){
                            if(dir=='top'){
                                game.player.dy=-40
                            }
                            if(dir=='bottom'){
                                return
                            }
                            if(dir=='left'){
                                game.player.dx=-40
                            }
                            if(dir=='right'){
                                game.player.dx=40
                            }
                        }
                    }
                    obstacles.push(obj)
                }
                if(pattern.data[i][j]==3){
                    obj = {x:j*this.obstacle_width+offset,y:1080-this.obstacle_height*rise,w:40,h:25,type:'missle',
                        oncollide:function(game,dir){
                            game.event_handler.publish('game over')
                        },
                        onupdate:function(self){
                            self.x-=20
                        }
                    }
                    obstacles.push(obj)
                }
                if(pattern.data[i][j]==4){
                    obj = {x:j*this.obstacle_width+offset,y:1080-this.obstacle_height*rise,w:100,h:50,type:'flying platform',
                        oncollide:function(game,dir){
                            return
                        },
                        onupdate:function(self){
                            self.x-=10
                        }
                    }
                    obstacles.push(obj)
                }
                if(pattern.data[i][j]==5){
                    obj = {x:j*this.obstacle_width+offset,y:1080-this.obstacle_height*rise,w:100,h:50,type:'murder drone',
                        oncollide:function(game,dir){
                            game.event_handler.publish('game over')
                        },
                        onupdate:function(self){
                            self.x-=10
                        }
                    }
                    obstacles.push(obj)
                }
                
            }
        }
        if(offset==0){
            this.obstacles=obstacles
        }else{
            this.obstacles_2=obstacles
        }
        
    }
    
    
    finish_cycle(){
        this.cycle_has_ended = false
        this.next_pattern_set = false
        this.current_pattern++
        if(this.current_pattern >= this.patterns.length) this.current_pattern = 0
        this.obstacles = this.obstacles_2
        this.obstacles_2 = []
    }
}