class Controller{
    constructor(){
        this.event_handler
        this.last_key
        this.screen=document.getElementById('touch-screen')
        this.touch_data={
            startx:0,starty:0,
            endx:0,endy:0
        }
        this.TAP_MAX_DISTANCE = 20;     // px
        this.DOUBLE_TAP_DELAY = 300;   // ms
        this.lastTapTime = 0;

        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            if(e.key=='w'){
                
                if(this.last_key!=e.key){
                    this.event_handler.publish('jump')
                }else{
                    this.event_handler.publish('holding up')
                }
                
            }
            if(e.key=='d'){
                if(this.last_key!=e.key){
                    this.event_handler.publish('dash')
                }else{
                    this.event_handler.publish('holding dash')
                }
                
            }
            if(e.key=='a'){
                if(this.last_key!=e.key){
                    this.event_handler.publish('back dash')
                }else{
                    this.event_handler.publish('holding dash')
                }
                
            }
            if(e.key=='q'){
                if(this.last_key!=e.key){
                    this.event_handler.publish('hop')
                }else{
                    this.event_handler.publish('holding hop')
                }
                
            }
            if(e.key=='e'){
                this.event_handler.publish('use special')
            }
            if(e.key=='Enter'){
                if(this.last_key!=e.key){
                    this.event_handler.publish('enter')
                }else{
                    this.event_handler.publish('holding enter')
                }
            }
            if(e.key=='s'){
                if(this.last_key!=e.key){
                    this.event_handler.publish('jump-cancel')
                }else{
                    this.event_handler.publish('holding down')
                }
            }
            if(e.key=='j'){
                if(this.last_key!=e.key){
                    this.event_handler.publish('use item')
                }else{
                    this.event_handler.publish('holding item')
                }
                
            }
            this.last_key=e.key
        });
        window.addEventListener('keyup', (e) => {
            this.last_key=null
        });
        this.screen.addEventListener('touchstart', (event) => {
            event.preventDefault()
            const touch = event.touches[0];
            this.touch_data.startx=touch.clientX
            this.touch_data.starty=touch.clientY
        });

        this.screen.addEventListener('touchend', (event) => {
            event.preventDefault()
            const touch = event.changedTouches[0]

            this.touch_data.endx = touch.clientX
            this.touch_data.endy = touch.clientY

            const dx = this.touch_data.endx - this.touch_data.startx
            const dy = this.touch_data.endy - this.touch_data.starty
            const distance = Math.hypot(dx, dy)

            // TAP
            if (distance < this.TAP_MAX_DISTANCE) {
                this.handleTap()
            } else {
                this.handleSwipe(this.touch_data)
            }
        })

    }
    handle_controls(){
        
    }
    handleSwipe(data) {
        const diffX = data.endx - data.startx
        const diffY = data.endy - data.starty

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 30) {
                this.event_handler.publish('swipe right')
            } else if (diffX < -30) {
                this.event_handler.publish('swipe left')
            }
        } else {
            if (diffY > 30) {
                this.event_handler.publish('swipe down')
            } else if (diffY < -30) {
                this.event_handler.publish('swipe up')
            }
        }
    }
    handleTap() {
        const now = Date.now()

        if (now - this.lastTapTime < this.DOUBLE_TAP_DELAY) {
            this.event_handler.publish('double tap')
            this.lastTapTime = 0
        } else {
            this.event_handler.publish('single tap')
            this.lastTapTime = now
        }
    }

    handle_event(e){
        
    }
    subscribe(handler){
        handler.listeners.push(this)
        this.event_handler=handler
    }
}