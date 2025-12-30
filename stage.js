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
        this.set_pattern(this.patterns[this.current_pattern])
        this.speed=10
        this.base_speed=10
        this.next_pattern_set=false
    }
    update(){
        for(let i = 0; i<this.obstacles.length; i++){
            let obstacle = this.obstacles[i]
            obstacle.x-=this.speed
            if(this.cycle_has_ended){
                if(!this.next_pattern_set){
                    let pattern_index = this.current_pattern + 1
                    if(pattern_index >= this.patterns.length) pattern_index = 0
                    this.set_next_pattern(this.patterns[pattern_index])
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
                obstacle.x-=this.speed
            }
        }
    }
    draw(ctx,game){
        ctx.drawImage(this.bg,0,0,this.stage_data.width,this.stage_data.height)
        this.obstacles.forEach(obstacle=>{
            ctx.drawImage(this.ground,obstacle.x,obstacle.y,obstacle.w,obstacle.h)
            const clip = game.getClipRect(obstacle);
            ctx.strokeStyle = 'lime';
            ctx.strokeRect(clip.x, clip.y, clip.w, clip.h);
        })
        if(this.cycle_has_ended){
            this.obstacles_2.forEach(obstacle=>{
                ctx.drawImage(this.ground,obstacle.x,obstacle.y,obstacle.w,obstacle.h)
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
    set_pattern(pattern){
        let obstacles=[]
        for(let i = 0;i<pattern.data.length;i++){
            let rise = pattern.data.length-i
            for(let j = 0; j<pattern.data[i].length;j++){
                if(pattern.data[i][j]==1){
                    obstacles.push({x:j*this.obstacle_width,y:1080-this.obstacle_height*rise,w:this.obstacle_width,h:this.obstacle_height})
                }
                
            }
        }
        this.obstacles=obstacles
    }
    set_next_pattern(pattern){
        let obstacles=[]
        for(let i = 0;i<pattern.data.length;i++){
            let rise = pattern.data.length-i
            for(let j = 0; j<pattern.data[i].length;j++){
                if(pattern.data[i][j]==1){
                    obstacles.push({x:j*this.obstacle_width+1920,y:1080-this.obstacle_height*rise,w:this.obstacle_width,h:this.obstacle_height})
                }
                
            }
        }
        this.obstacles_2=obstacles
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