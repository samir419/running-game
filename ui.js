
class UI{
    constructor(canvas){
        this.canvas = canvas
        this.current_window
        this.current_ui
        this.switch_ui('none')
    }
    switch_window(id){
        let windows = document.querySelectorAll('.window')
        for(let i=0;i<windows.length;i++){
            if(windows[i].id==id){
                windows[i].style.display='block'
                this.current_window=id
            }else{
                windows[i].style.display='none'
            }
        }
    }
    switch_ui(id){
        let windows = document.querySelectorAll('.in-game-ui')
        for(let i=0;i<windows.length;i++){
            if(windows[i].id==id){
                windows[i].style.display='block'
                this.current_ui=id
            }else{
                windows[i].style.display='none'
            }
        }
    }
    handle_event(e){
        if(e=='game over'){
            this.switch_ui('pause')
        }
        if(e=='enter'){
            if(this.current_ui=='none'){
                this.switch_ui('pause')
            }else if(this.current_ui=='pause'){
                this.switch_ui('none')
            }
            
        }
    }
    subscribe(handler){
        handler.listeners.push(this)
    }
}