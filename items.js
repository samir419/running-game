class Coin{
    constructor(){
        this.x
        this.y
        this.w=64
        this.h=64
        this.collected=false
    }
}
class Item{
    constructor(item,player,game){
        this.item = item
        this.player = player
        this.game_instance=game
        this.x
        this.y
        this.w=64
        this.h=64
        this.collected=false
        this.active=false
        this.duration=this.item.duration
    }
    use(){
        this.item.onuse(this)
    }
    update(){
        this.item.onupdate(this)
    }
    draw(ctx,game){
        if(this.item.rect){
            ctx.fillStyle=this.item.rect.color
            ctx.fillRect(this.item.rect.x,this.item.rect.y,this.item.rect.w,this.item.rect.h)
        }
        
    }
}
const items=[
    {
        name:'pogostick',
        duration:0,
        instant_use:false,
        color:'green',
        onuse:function(p){
            p.player.dy=-45
            p.player.dx=20
            p.active=false
        },
        onupdate:function(p){return}
    },
    {
        name:'booster',
        duration:500,
        instant_use:true,
        color:'red',
        rect:{color:"rgba(255, 0, 0, 0.2)",x:0,y:0,w:1920,h:1080},
        onuse:function(p){
            p.active=true
            p.game_instance.active_items.push(p)
        },
        onupdate:function(p){
            p.duration--
            p.player.invulnerable=true
            p.player.physics='float'
            p.game_instance.stage.speed=20
            p.player.special_cooldown=100
            //p.item.rect.x=p.player.x
            //p.item.rect.y=p.player.y
            if(p.duration<=0){
                p.player.invulnerable=false
                p.player.physics='normal'
                p.active=false
                p.game_instance.stage.speed=p.game_instance.stage.base_speed
            }
        }
    },
    {
        name:'flowstate',
        duration:100,
        instant_use:true,
        color:'red',
        rect:{color:"rgba(255, 0, 0, 0.2)",x:0,y:0,w:1920,h:1080},
        onuse:function(p){
            p.active=true
            p.game_instance.active_items.push(p)
        },
        onupdate:function(p){
            p.duration--
            p.player.invulnerable=true
            p.player.physics='float'
            p.game_instance.stage.speed=20
            p.player.special_cooldown=100
            //p.item.rect.x=p.player.x
            //p.item.rect.y=p.player.y
            if(p.duration<=0){
                p.player.invulnerable=false
                p.player.physics='normal'
                p.active=false
                p.game_instance.stage.speed=p.game_instance.stage.base_speed
            }
        }
    },
    {
        name:'timeslow',
        duration:200,
        instant_use:false,
        color:'blue',
        rect:{color:"rgba(0, 0, 255, 0.2)",x:0,y:0,w:1920,h:1080},
        onuse:function(p){
            p.active=true
            p.game_instance.active_items.push(p)
        },
        onupdate:function(p){
            p.duration--
            p.game_instance.stage.speed=5
            if(p.duration<=0){
                p.active=false
                p.game_instance.stage.speed=p.game_instance.stage.base_speed
            }
        }
    },
    {
        name:'phantom dash',
        duration:10,
        instant_use:false,
        color:'black',
        rect:{color:"rgba(0, 0, 0, 0.2)",x:0,y:0,w:128,h:128},
        onuse:function(p){
            p.active=true
            p.game_instance.active_items.push(p)
            p.player.dx=40
            p.player.invulnerable=true
        },
        onupdate:function(p){
            p.duration--
            p.item.rect.x=p.player.x
            p.item.rect.y=p.player.y
            if(p.duration<=0){
                p.active=false
                p.player.invulnerable=false
            }
        }
    },
    {
        name: 'web swin #',
        duration: 100, // until released
        instant_use: false,
        color: 'white',
        rect:{ color:"rgba(255,255,255,0.15)", x:0,y:0,w:0,h:0 },
        anchor:null,
        length:0,
        angle:0,
        angularVelocity:0,
        onuse:function(p){
            // Attach point (mouse / aim direction / forward)
            p.item.anchor = {
                x: p.player.x + 300,
                y: p.player.y - 200
            }

            p.item.length = Math.hypot(
                p.player.x - p.item.anchor.x,
                p.player.y - p.item.anchor.y
            )

            p.item.angle = Math.atan2(
                p.player.y - p.item.anchor.y,
                p.player.x - p.item.anchor.x
            )

            p.item.angularVelocity = 0
            p.active = true
            p.player.onGround=false
            p.player.physics = 'swing'
            p.game_instance.active_items.push(p)
        },

        onupdate:function(p){
            p.duration--
            const g = 0.6
            const damping = 0.995

            // Pendulum physics
            p.item.angularVelocity += (-g / p.item.length) * Math.sin(p.item.angle)
            p.item.angularVelocity *= damping
            p.item.angle += p.item.angularVelocity

            // New player position
            p.player.x = p.item.anchor.x + Math.cos(p.item.angle) * p.item.length
            p.player.y = p.item.anchor.y + Math.sin(p.item.angle) * p.item.length

            // Update velocity for release
            //p.player.dx = -Math.sin(p.angle) * p.item.angularVelocity * p.item.length
            //p.player.dy =  Math.cos(p.angle) * p.item.angularVelocity * p.item.length

            // Draw web
            p.item.rect.x = p.item.anchor.x
            p.item.rect.y = p.item.anchor.y
            p.item.rect.w = p.player.x - p.item.anchor.x
            p.item.rect.h = p.player.y - p.item.anchor.y
            if(p.angle > Math.PI * 0.85||p.duration<=0){
                p.active = false
                p.player.physics = 'normal'
            }
        }
    },
    {
        name: 'rope',
        duration: 30, // until released
        instant_use: false,
        color: 'brown',
        rect:{ color:"rgba(255,255,255,0.15)", x:0,y:0,w:0,h:0 },
        onuse:function(p){
            p.active = true
            p.player.onGround=false
            p.game_instance.active_items.push(p)
        },

        onupdate:function(p){
            p.duration--
            if(p.duration>0){
                p.player.dx=0
                p.player.dy=-20
            }
            if(p.duration>5){
                p.player.dx=10
                p.player.dy=-20
            }
            if(p.duration>10){
                p.player.dx=20
                p.player.dy=-20
            }
            if(p.duration>15){
                p.player.dx=20
                p.player.dy=-10
            }
            if(p.duration>20){
                p.player.dx=20
                p.player.dy=10
            }
            if(p.duration>25){
                p.player.dx=20
                p.player.dy=20
            }
            if(p.duration<=0){
                p.active = false
            }
        }
    }

]

const pickable_items = [
    items[0],items[1],items[3],items[6]
]