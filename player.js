class Player{
    constructor(char){
        this.char = char
        this.x
        this.y 
        this.w = 128
        this.h = 128
        this.dx = 0
        this.dy = 0
        this.state=0//0:idle,1:running,2:jumping,3:mid_air,4:falling
        this.image = new Image()
        this.image.src = `${this.char.image_path}${0}-${0}.png`
        this.onGround = false
        this.canJump=false
        this.animations=[]
        this.frame=0
        this.frame_counter=0
        this.scale=1.5
        this.input_buffer='none'
        this.coyoteTimeMax = 16
        this.coyoteTimer = 0
        for(let state in this.char.state_animation_frames){
            let arr = []
            for(let i=0;i<this.char.state_animation_frames[state];i++){
                let img = new Image()
                img.src = `${this.char.image_path}${this.animations.length}-${i}.png`
                arr.push(img)
            }
            this.animations.push(arr)
        }
        this.invulnerable=false
        this.physics='normal'
        this.special=null
        this.canusespecial=true
        this.special_cooldown=0
    }
    update(){
        if(!this.onGround&&this.physics=='normal'){
            if(this.dy<0){
                this.change_state(2)
            }else if(this.dy>0){
                this.change_state(4)
            }else{
                this.change_state(3)
            }
        }else{
            this.change_state(1)
        }

        if (this.onGround) {
            this.coyoteTimer = this.coyoteTimeMax
        } else {
            this.coyoteTimer--
        }

         if (this.coyoteTimer < 0) {
            this.coyoteTimer = 0
        }

        if(this.onGround&&this.input_buffer=='jump'){
            this.dy=-30
            this.canJump=false
            this.input_buffer='none'
        }
        if(this.dy<0||this.dy>0){
            this.onGround=false
            this.canJump=false
        }
        if(this.dx>0){
            this.dx-=1.5
        }
        if(this.x<250){
            this.x+=2
        }
        if(this.x>250){
            this.x-=2
        }
        if(this.special_cooldown>0){
            this.canusespecial=false
            this.special_cooldown--
        }else{
            this.canusespecial=true
        }
        if(this.physics=='normal'){
            this.dy+=1.5
            this.x+=this.dx
            this.y+=this.dy
        }
        
    }
    draw(ctx){
        this.frame_counter++
        if(this.frame_counter>100){
            this.frame_counter=0
        }
        ctx.fillStyle='yellow'
        //ctx.fillRect(this.x,this.y,this.w,this.h)
        let image = this.animations[this.state][this.frame]
        ctx.drawImage(image,this.x,this.y,image.width*this.scale,image.height*this.scale)
        if(this.frame_counter%5==0){
            this.frame++
            if(this.frame>=this.animations[this.state].length){
                this.frame=0
            }
        }
        
    }
    jump(force){
        if(this.canJump){
            this.dy=force
            this.canJump=false
            this.input_buffer='none'
        }else{
            this.input_buffer='jump'
            if (this.coyoteTimer > 0) {
                this.dy=force
                this.coyoteTimer = 0 // consume jump
                this.input_buffer='none'
                this.canJump=false
            }
        }
    }
    dash(num){
        this.dx=30*num
    }
    jump_cancel(){
        if(!this.onGround){
            this.dy=30
        }
    }
    change_state(new_state){
        if(this.state===new_state)return
        this.state=new_state
        this.frame=0
        this.frame_counter=0
    }
}
