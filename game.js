

class Game{
    constructor(canvas,stage_data,character){
        this.canvas=canvas
        this.ctx=this.canvas.getContext("2d");
        this.stage = new Stage(stage_data,this)
        this.player=new Player(character)
        this.player.x = 100
        this.player.y = 10
        this.state='pause'
        this.event_handler
        this.coins=[]
        this.items=[]
        this.active_items=[]
        this.usable_items=[]
        this.coin_count=0
        this.score=0
        this.set_player()
    }
    set_player(){
        for(let i = 0; i<items.length;i++){
            if(this.player.char.special==items[i].name){
                this.player.special=items[i]
            }
        }
    }
    render(){
        let ctx = this.ctx
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.stage.draw(ctx,this)
        this.player.draw(ctx)
        this.coins.forEach(coin=>{
            if(!coin.collected){
                ctx.fillStyle='yellow'
                ctx.fillRect(coin.x,coin.y,coin.w,coin.h)
            }
        })
        this.items.forEach(item=>{
            if(!item.collected){
                ctx.fillStyle=item.item.color
                ctx.fillRect(item.x,item.y,item.w,item.h)
            }
        })
        this.active_items.forEach(item=>{
            if(item.active){
                item.draw(ctx,this)
                ctx.fillStyle='yellow'
                ctx.fillRect(10,10,item.duration,20)
            }
        })
        ctx.fillRect(10,30,this.player.special_cooldown,20)
    }
    run(){
        if(this.state=='running'){
            this.score++
            document.getElementById('score').textContent=`score: ${this.score}`
            document.getElementById('coins').textContent=`coins: ${this.coin_count}`
            if(this.score%1000==0){
                this.stage.speed+=1
                this.stage.base_speed+=1
            }
            this.player.update()
            this.stage.update()
            this.stage.obstacles.forEach(obj=>{
                this.collide_and_clip(this.player, obj);
                this.collide_and_eject(this.player, obj);
            })
            if(this.stage.cycle_has_ended){
                this.stage.obstacles_2.forEach(obj=>{
                    this.collide_and_eject(this.player, obj);
                    this.collide_and_clip(this.player, obj);
                })
            }
            let filtered_coins=[]
            let filtered_items=[]
            this.coins.forEach(coin=>{
                if(!coin.collected){
                    coin.x-=this.stage.speed
                    filtered_coins.push(coin)
                    if(this.check_collision(this.player,coin)){
                        coin.collected=true
                        this.coin_count+=1
                    }
                    
                }
            })
            this.items.forEach(item=>{
                if(!item.collected){
                    item.x-=this.stage.speed
                    filtered_items.push(item)
                    if(this.check_collision(this.player,item)){
                        item.collected=true
                        if(item.item.instant_use){
                            item.use()
                        }else{
                            this.usable_items.push(item)
                            this.display_items()
                        }
                        
                        
                    }
                    
                }
            })
            let active_item_filter=[]
            this.active_items.forEach(item=>{
                if(item.active){
                    item.update()
                    active_item_filter.push(item)
                }
            })
            this.coins=filtered_coins
            this.items=filtered_items
            this.active_items=active_item_filter
            if(this.player.y>1280){
                this.event_handler.publish('game over')
            }
            if(this.player.x<-456){
                this.event_handler.publish('game over')
            }
            this.render()
            document.getElementById('debugger').innerHTML = `<p>x:${this.player.y}</p> <p>y:${this.player.x}</p> <p>dy:${this.player.dy}</p> <p>dx:${this.player.dx}</p> <p>state:${this.player.state} physics:${this.player.physics}</p> <p>onround:${this.player.onGround}</p>
                <p>coins:${this.coin_count}</p>`
        }
       
    }
    check_collision(a,b){
        return (
            a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y
        )
    }
    collide_and_eject(player, obstacle) {
        if(player.invulnerable)return
        // Calculate half sizes
        const playerHalfW = player.w / 2;
        const playerHalfH = player.h / 2;
        const obstacleHalfW = obstacle.w / 2;
        const obstacleHalfH = obstacle.h / 2;

        // Calculate centers
        const playerCenterX = player.x + playerHalfW;
        const playerCenterY = player.y + playerHalfH;
        const obstacleCenterX = obstacle.x + obstacleHalfW;
        const obstacleCenterY = obstacle.y + obstacleHalfH;

        // Distance between centers
        const dx = playerCenterX - obstacleCenterX;
        const dy = playerCenterY - obstacleCenterY;

        // Overlap on each axis
        const overlapX = playerHalfW + obstacleHalfW - Math.abs(dx);
        const overlapY = playerHalfH + obstacleHalfH - Math.abs(dy);

        // No collision
        if (overlapX <= 0 || overlapY <= 0) return false;

        // Resolve collision on smallest axis
        if (overlapX < overlapY) {
            // Resolve X
            if (dx > 0) {
                player.x += overlapX;
                obstacle.oncollide(this,'left')
            } else {
                player.x -= overlapX;
                obstacle.oncollide(this,'right')
            }
            if (player.dx !== undefined) player.dx = 0;
        } else {
            // Resolve Y
            if (dy > 0) {
                player.y += overlapY;
                obstacle.oncollide(this,'bottom')
            } else {
                player.y -= overlapY;
                obstacle.oncollide(this,'top')
                player.onGround = true;
                player.canJump = true;
            }
            if(obstacle.type=='normal'){
                if (player.dy !== undefined) player.dy = 0;
            }
            
        }

        return true;
    }
    getClipRect(obstacle) {
        const clipHeight = 0;          // how forgiving the climb is
        const clipExtraWidth = 32;      // makes grabbing easier

        return {
            x: obstacle.x - clipExtraWidth / 2,
            y: obstacle.y - clipHeight,
            w: obstacle.w + clipExtraWidth,
            h: 8
        };
    }

    collide_and_clip(player, obstacle) {
        if(obstacle.type=='missle')return
        // only allow climbing while jumping/falling
        if (player.onGround==true||player.dy<0) return;

        const clipRect = this.getClipRect(obstacle);

        if (this.check_collision(player, clipRect)) {
            // snap player on top
            player.y = obstacle.y - player.h;
            player.dy = 0;

            player.onGround = true;
        }
    }

    restart(){
        this.player.x = 10
        this.player.y = 10
        this.player.physics='normal'
        this.player.invulnerable=false
        this.player.dx=0
        this.player.dy=0
        this.score=0
        this.coin_count=0
        this.stage.speed=10
        this.stage.base_speed=10
        this.active_items=[]
        this.usable_items=[]
        document.getElementById('items').innerHTML=''
        this.state='running'
    }
    handle_event(e){
        if(e=='game over'){
            let amount = sessionStorage.getItem('running game coins')
            amount+=this.coin_count
            sessionStorage.setItem('running game coins',amount)
            this.coin_count=0
            this.state='pause'
        }
        if(e=='enter'){
            if(this.state=='pause'){
                this.state='running'
            }else{
                this.state='pause'
            }
        }
        if(this.state!='running')return
        if(e=='jump'||e=='single tap'){
            this.player.jump(-30)
        }
        
        if(e=='dash'||e=='swipe right'){
            this.player.dash(1)
        }
         if(e=='back dash'||e=='swipe left'){
            this.player.dash(-1)
        }
         if(e=='hop'){
            this.player.jump(-25)
        }
        
        if(e=='holding jump'){
            if(this.player.onGround){
                this.player.jump(-30)
            }
        }
        if(e=='jump-cancel'||e=='swipe down'){
            this.player.jump_cancel()
        }
        if(e=='use item'){
            if(!this.usable_items[0])return
            this.usable_items[0].use()
            this.usable_items.shift()
            let item_list = ''
            this.usable_items.forEach(item=>{
                item_list+=item.item.name
            })
            document.getElementById('items').innerHTML=item_list
        }
        if (e === 'cycle item') {
            if (this.usable_items.length === 0) return

            const first = this.usable_items.shift()
            this.usable_items.push(first)

            this.display_items()
        }

        if(e=='holding up'){
            if(this.player.physics=='float'){
                this.player.y-=15
            }
        }
        if(e=='holding down'){
            if(this.player.physics=='float'){
                this.player.y+=15
            }
        }
        if(e=='use special'||e=='swipe up'){
            if(this.player.canusespecial){
                let spmove = new Item(this.player.special,this.player,this)
                spmove.use()
                this.player.special_cooldown=100
            }
            
        }
    }
    subscribe(handler){
        handler.listeners.push(this)
        this.event_handler=handler
    }
    spawn_coin(obj){
        let coin = new Coin()
        coin.x=obj.x+obj.w/2
        coin.y=obj.y-obj.h/2
        this.stage.obstacles.forEach(obst=>{
            if(this.check_collision(coin,obst)){
                return
            }
        })
        this.coins.push(coin)
    }
    spawn_item(obj){
        let item = new Item(pickable_items[Math.floor(Math.random() * pickable_items.length)],this.player,this)
        item.x=obj.x+obj.w/2
        item.y=obj.y-obj.h/2
        this.stage.obstacles.forEach(obst=>{
            if(this.check_collision(item,obst)){
                return
            }
        })
        this.items.push(item)
        
    }
    get_starting_items(items){
        items.forEach(item=>{
            let i = new Item(item,this.player,this)
            this.usable_items.push(i)

        })
        this.display_items()
    }
    display_items(){
        let item_list = ''
        this.usable_items.forEach(item => {
            item_list += item.item.name+' '
        })
        document.getElementById('items').innerText = item_list
    }

}