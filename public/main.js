var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-ban");

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const price = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = this.parentNode.parentNode.childNodes[5].innerText
        console.log(price)
        // allows to reach server from main JS with this fetch
        // then a put for win to say how theny win
        // then a put for loose to sya how much they loose
        fetch('bills', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'price': price,
            'thumbUp':"PAID!"
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});


Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const price = this.parentNode.parentNode.childNodes[3].innerText
        console.log(name)
        fetch('bills', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'price': price
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

document.querySelector('.getYourTotal').onclick = function(){
  let listOfBills = document.getElementsByClassName('messages')
  console.log(listOfBills)
  let listOfAllTheBills = []
  for(let i = 0; i<listOfBills[0].children.length; i++){
    let valueOfBills = parseInt(listOfBills[0].children[i].childNodes[3].innerText)
    // console.log(valueOfBills)
    listOfAllTheBills.push(valueOfBills)
    console.log(listOfAllTheBills)
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    // console.log(listOfAllTheBills.reduce(reducer));
    let totalPricOfBills = listOfAllTheBills.reduce(reducer)
    console.log(totalPricOfBills)
    document.querySelector(".billTotal").textContent = totalPricOfBills


  }

}
