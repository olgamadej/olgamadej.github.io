document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let width = 10;
    let mineAmount = 20;
    let fields = [];
    let isGameOver = false;

    //Board Creation
    function createBoardFields() {
        //get jiggled array of randomly placed mines
        const mineArray = Array(mineAmount).fill('mine');
        const emptyArray = Array(width*width-mineAmount).fill('empty');
        const boardArray = emptyArray.concat(mineArray);
        const jiggledArray = boardArray.sort(() => Math.random()- 0.5);
        

        //Create div elements of the Board
        for(let i = 0; i<width*width; i++){
            const field = document.createElement('div');
            field.setAttribute('id', i);
            field.classList.add(jiggledArray[i]);
            grid.appendChild(field);
            fields.push(field);

            //click on the field
            field.addEventListener('click', function(e) {
                click(field)
            });
        };

        //count the numbers of bombs surrounding each field
        for (let i = 0; i < fields.length; i++) {
            let total = 0;
            const onLeftEdge = (i%width === 0);
            const onRightEdge = (i%width === width-1);

            if(fields[i].classList.contains('empty')) {
                if(/*i>0 &&*/ !onLeftEdge && fields[i-1].classList.contains('mine')) {total++}; 
                if(i>9 && !onRightEdge && fields[i+1-width].classList.contains('mine')) {total++};
                if(i>10 && fields[i-width].classList.contains('mine')) {total++}; 
                if(i>11 && !onLeftEdge && fields[i-1-width].classList.contains('mine')){total++};
                if(/*i<98*/!onRightEdge && fields[i+1].classList.contains('mine')){total++};
                if(i<90 && !onLeftEdge && fields[i-1+width].classList.contains('mine')) {total++};
                if(i<88 && !onRightEdge && fields[i+1+width].classList.contains('mine')) {total++};
                if(i<90 && fields[i+width].classList.contains('mine')) {total++};
                fields[i].setAttribute('data', total);
                
            };
            
        };
    };

    createBoardFields();

    //clicking actions
    function click(field){
        let currentId = field.id;
        if (isGameOver) return;
        if (field.classList.contains('checked') || field.classList.contains('flag')) return 
        if (field.classList.contains('mine')){
            alert('Game Over for now! Try again! Maybe this time you will not blow us up!');
        } else {
            let total = field.getAttribute('data');
            if (total != 0 ) {
                field.classList.add('checked');
                field.innerHTML = total;
                return
            }
            checkField(field, currentId)
            
        }
        field.classList.add('checked');
    }
    //check neighboring fields once field is clicked
    function checkField(field, currentId){
        const isLeftEdge = (currentId%width === 0)
        const isRightEdge = (currentId%width === width -1)

        setTimeout(() => {
            if(currentId>0 && !isLeftEdge) {
                const newId = fields[parseInt(currentId)-1].id;
                const newField = document.getElementById(newId);
                click(newField);
            }
            if(currentId>9 && !isRightEdge) {
                const newId = fields[parseInt(currentId)+1 -width].id;
                const newField = document.getElementById(newId);
                click(newField);
            }
            if(currentId>10){
                const newId = fields[parseInt(currentId)-width].id;
                const newField = document.getElementById(newId);
                click(newField);
            }
            if(currentId>11 && !isLeftEdge){
                const newId = fields[parseInt(currentId)-1-width].id;
                const newField = document.getElementById(newId);
                click(newField);
            }
            if(currentId<98 && !isRightEdge){
                const newId = fields[parseInt(currentId)+ 1].id;
                const newField = document.getElementById(newId);
                click(newField);
            }
            if(currentId<90 && !isLeftEdge){
                const newId = fields[parseInt(currentId)-1 + width].id;
                const newField = document.getElementById(newId);
                click(newField);
            }
            if(currentId<88 && !isRightEdge){
                const newId = fields[parseInt(currentId)+1+width].id;
                const newField = document.getElementById(newId);
                click(newField);
            }
            if(currentId<89){
                const newId = fields[parseInt(currentId)+width].id;
                const newField = document.getElementById(newId);
                click(newField);
            }            
        }, 20)
    }



})