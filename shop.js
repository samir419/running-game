let coins = sessionStorage.getItem('running game coins')?sessionStorage.getItem('running game coins'):0
let starting_items = []
let starting_characters = [sakura]
document.getElementById('shop-coins').innerHTML=`coins:${coins}`
chars=[
    felicia,mai,jackie,sakura2
]


chars.forEach(char => {
    let elem = document.createElement('button')
    elem.textContent = char.name + '\n' +char.price
    elem.onclick=()=>{
        let coins = sessionStorage.getItem('running game coins') 
        if(coins<char.price){
            alert('not enough money')
        }else{
            coins-=char.price
            sessionStorage.setItem('running game coins',coins)
            starting_characters.push(char)
            alert('item purchases')
        }
    }
    document.getElementById('character-list').appendChild(elem)
});
items.forEach(item=>{
    let elem = document.createElement('button')
    elem.textContent = item.name + '\n' +item.price
    elem.onclick=()=>{
        let coins = sessionStorage.getItem('running game coins') 
        if(coins<item.price){
            alert('not enough money')
        }else{
            coins-=item.price
            sessionStorage.setItem('running game coins',coins)
            starting_items.push(item)
            alert('item purchases')
        }
    }
    document.getElementById('item-list').appendChild(elem)
})